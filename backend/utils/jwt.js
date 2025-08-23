import jwt from "jsonwebtoken";
import crypto from "crypto";

// ✅ Load and sanitize env vars
const accessTokenSecret = process.env.JWT_SECRET?.trim() || "3uOFR0AY7RN2wJYi0OspbbGzzw59hVopIKH3mawZU";
const refreshTokenSecret = process.env.JWT_REFRESH_SECRET?.trim() || "kKxQHU8Yh4OO56J5efgWrlnC3GQVxeUNbxvQB4Oato";
const accessTokenExpiry = process.env.JWT_ACCESS_EXPIRY?.trim() || "15m";
const refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRY?.trim() || "7d";

// Validate secrets
if (!accessTokenSecret) {
  throw new Error("❌ JWT_SECRET is not configured in .env");
}
if (!refreshTokenSecret) {
  throw new Error("❌ JWT_REFRESH_SECRET is not configured in .env");
}

// Validate expiry format at startup
_validateExpiry(accessTokenExpiry, "JWT_ACCESS_EXPIRY");
_validateExpiry(refreshTokenExpiry, "JWT_REFRESH_EXPIRY");

function _validateExpiry(expiryString, varName) {
  const regex = /^(\d+)([smhd])$/;
  if (!regex.test(expiryString)) {
    throw new Error(
      `❌ Invalid ${varName} format "${expiryString}". Use like: 15m, 1h, 7d`
    );
  }
}

// Parse expiry string to ms
function parseExpiryString(expiryString) {
  const units = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  const match = expiryString.match(/^(\d+)([smhd])$/);
  if (!match) {
    throw new Error(
      `Invalid expiry format: "${expiryString}". Use format like: 15m, 1h, 7d`
    );
  }

  const [, value, unit] = match;
  return parseInt(value, 10) * units[unit];
}

// Get expiration timestamp
function getExpirationTime(expiryString) {
  const now = new Date();
  const expiry = parseExpiryString(expiryString);
  return new Date(now.getTime() + expiry);
}

// Generate access token
function generateAccessToken(payload) {
  const tokenPayload = {
    id: payload.id,
    email: payload.email,
    role: payload.role,
    permissions: payload.permissions || [],
    isVerified: payload.isVerified,
  };

  return jwt.sign(tokenPayload, accessTokenSecret, {
    expiresIn: accessTokenExpiry,
    issuer: "your-app-name",
    audience: "your-app-users",
  });
}

// Generate refresh token
function generateRefreshToken(payload) {
  const tokenPayload = {
    id: payload.id,
    email: payload.email,
    tokenVersion: payload.tokenVersion || 0,
  };

  return jwt.sign(tokenPayload, refreshTokenSecret, {
    expiresIn: refreshTokenExpiry,
    issuer: "your-app-name",
    audience: "your-app-users",
  });
}

// Generate both tokens
function generateTokenPair(payload) {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    accessToken,
    refreshToken,
    accessTokenExpiresIn: getExpirationTime(accessTokenExpiry),
    refreshTokenExpiresIn: getExpirationTime(refreshTokenExpiry),
  };
}

// Verify access token
function verifyAccessToken(token) {
  try {
    return jwt.verify(token, accessTokenSecret, {
      issuer: "your-app-name",
      audience: "your-app-users",
    });
  } catch (error) {
    throw handleJWTError(error);
  }
}

// Verify refresh token
function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, refreshTokenSecret, {
      issuer: "your-app-name",
      audience: "your-app-users",
    });
  } catch (error) {
    throw handleJWTError(error);
  }
}

// Decode token without verification
function decodeToken(token) {
  return jwt.decode(token);
}

// JWT error mapping
function handleJWTError(error) {
  const errorMap = {
    TokenExpiredError: {
      name: "TOKEN_EXPIRED",
      message: "Token has expired",
      status: 401,
    },
    JsonWebTokenError: {
      name: "INVALID_TOKEN",
      message: "Invalid token format or signature",
      status: 403,
    },
    NotBeforeError: {
      name: "TOKEN_NOT_ACTIVE",
      message: "Token is not active yet",
      status: 403,
    },
  };

  const mappedError = errorMap[error.name] || {
    name: "JWT_ERROR",
    message: "Token verification failed",
    status: 403,
  };

  const customError = new Error(mappedError.message);
  customError.name = mappedError.name;
  customError.status = mappedError.status;
  customError.originalError = error;

  return customError;
}

// Secure random token
function generateSecureToken(length = 32) {
  return crypto.randomBytes(length).toString("hex");
}

// Extract token from header
function extractTokenFromHeader(authHeader) {
  if (!authHeader) return null;

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return null;
  }

  return parts[1];
}

// Check if token expiring soon
function isTokenExpiring(token, bufferMinutes = 5) {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;

    const now = Math.floor(Date.now() / 1000);
    const buffer = bufferMinutes * 60;

    return decoded.exp - now <= buffer;
  } catch (error) {
    return true;
  }
}

export default {
  generateAccessToken,
  generateRefreshToken,
  generateTokenPair,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken,
  getExpirationTime,
  parseExpiryString,
  handleJWTError,
  generateSecureToken,
  extractTokenFromHeader,
  isTokenExpiring,
};
