const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || "15m";
const REFRESH_TOKEN_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

const getSecret = (name) => {
  const secret = process.env[name];
  if (!secret) {
    const error = new Error(`${name} is not configured`);
    error.status = 500;
    throw error;
  }

  return secret;
};

const createPayload = (user, type) => ({
  sub: String(user.id),
  email: user.email,
  role: user.role,
  type,
});

const signAccessToken = (user) =>
  jwt.sign(createPayload(user, "access"), getSecret("JWT_ACCESS_SECRET"), {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });

const signRefreshToken = (user) =>
  jwt.sign(createPayload(user, "refresh"), getSecret("JWT_REFRESH_SECRET"), {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });

const verifyAccessToken = (token) => {
  const payload = jwt.verify(token, getSecret("JWT_ACCESS_SECRET"));
  if (payload.type !== "access") {
    const error = new Error("Access token khong hop le");
    error.status = 401;
    throw error;
  }

  return payload;
};

const verifyRefreshToken = (token) => {
  const payload = jwt.verify(token, getSecret("JWT_REFRESH_SECRET"));
  if (payload.type !== "refresh") {
    const error = new Error("Refresh token khong hop le");
    error.status = 401;
    throw error;
  }

  return payload;
};

module.exports = {
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
