const bcrypt = require("bcryptjs");
const prisma = require("../lib/prisma");
const toSafeUser = require("../lib/userPresenter");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} = require("../lib/jwt");

const SALT_ROUNDS = Number.parseInt(process.env.BCRYPT_SALT_ROUNDS || "12", 10);

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const createTokens = (user) => ({
  accessToken: signAccessToken(user),
  refreshToken: signRefreshToken(user),
  tokenType: "Bearer",
  accessTokenExpiresIn: ACCESS_TOKEN_EXPIRES_IN,
  refreshTokenExpiresIn: REFRESH_TOKEN_EXPIRES_IN,
});

const register = async (req, res, next) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = req.body.password;
    const name = req.body.name ? String(req.body.name).trim() : null;

    if (!validateEmail(email)) {
      return res.status(422).json({
        success: false,
        message: "Email khong hop le",
      });
    }

    if (typeof password !== "string" || password.length < 6) {
      return res.status(422).json({
        success: false,
        message: "Mat khau phai co it nhat 6 ky tu",
      });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email da duoc su dung",
      });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await prisma.user.create({
      data: { email, passwordHash, name },
    });

    return res.status(201).json({
      success: true,
      message: "Dang ky tai khoan thanh cong",
      data: toSafeUser(user),
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = req.body.password;

    if (!email || typeof password !== "string") {
      return res.status(400).json({
        success: false,
        message: "Vui long nhap email va mat khau",
      });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    const isValidPassword =
      user && (await bcrypt.compare(password, user.passwordHash));

    if (!user || !isValidPassword || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Email hoac mat khau khong dung",
      });
    }

    return res.json({
      success: true,
      message: "Dang nhap thanh cong",
      data: {
        user: toSafeUser(user),
        ...createTokens(user),
      },
    });
  } catch (error) {
    return next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token la bat buoc",
      });
    }

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Refresh token khong hop le",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: Number.parseInt(payload.sub, 10) },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Refresh token khong hop le",
      });
    }

    return res.json({
      success: true,
      data: {
        accessToken: signAccessToken(user),
        tokenType: "Bearer",
        accessTokenExpiresIn: ACCESS_TOKEN_EXPIRES_IN,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const me = async (req, res) => {
  return res.json({
    success: true,
    data: req.user,
  });
};

module.exports = {
  register,
  login,
  refresh,
  me,
};
