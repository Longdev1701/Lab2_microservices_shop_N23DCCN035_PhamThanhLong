const prisma = require("../lib/prisma");
const { verifyAccessToken } = require("../lib/jwt");
const toSafeUser = require("../lib/userPresenter");

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      success: false,
      message: "Can Bearer token de truy cap",
    });
  }

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Access token khong hop le",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number.parseInt(payload.sub, 10) },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Access token khong hop le",
      });
    }

    req.user = toSafeUser(user);
    req.userId = user.id;

    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = authenticate;
