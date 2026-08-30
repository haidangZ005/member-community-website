const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const env = require('../config/env');

class JwtTokenService {
  generateAccessToken(payload) {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRES_IN });
  }

  generateRefreshToken(payload) {
    return jwt.sign({ ...payload, nonce: crypto.randomUUID() }, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN });
  }

  verifyAccessToken(token) { return jwt.verify(token, env.JWT_ACCESS_SECRET); }
  verifyRefreshToken(token) { return jwt.verify(token, env.JWT_REFRESH_SECRET); }
  generateOpaqueToken() { return crypto.randomBytes(32).toString('hex'); }
  hashToken(token) { return crypto.createHash('sha256').update(token).digest('hex'); }
  getExpiration(token) {
    const decoded = jwt.decode(token);
    return new Date(decoded.exp * 1000);
  }
}

module.exports = JwtTokenService;
