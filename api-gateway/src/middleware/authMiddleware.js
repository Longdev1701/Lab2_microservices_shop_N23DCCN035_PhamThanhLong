const jwt = require("jsonwebtoken");

const publicPaths = ["/health", "/api/auth"];

const isPublicPath = (path) =>
  publicPaths.some((publicPath) => path === publicPath || path.startsWith(`${publicPath}/`));

const authenticateGateway = (req, res, next) => {
  if (isPublicPath(req.path)) {
    return next();
  }

  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      success: false,
      message: "Can Bearer token de truy cap",
    });
  }

  try {
    if (!process.env.JWT_ACCESS_SECRET) {
      return res.status(500).json({
        success: false,
        message: "JWT_ACCESS_SECRET chua duoc cau hinh tren API Gateway",
      });
    }

    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    if (payload.type !== "access") {
      return res.status(401).json({
        success: false,
        message: "Access token khong hop le",
      });
    }

    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };

    req.headers["x-user-id"] = payload.sub;
    req.headers["x-user-email"] = payload.email || "";
    req.headers["x-user-role"] = payload.role || "";

    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Access token khong hop le hoac da het han",
    });
  }
};

module.exports = authenticateGateway;
