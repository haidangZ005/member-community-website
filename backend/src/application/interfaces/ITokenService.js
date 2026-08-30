class ITokenService {
  generateAccessToken(_payload) { throw new Error('Not implemented'); }
  generateRefreshToken(_payload) { throw new Error('Not implemented'); }
  verifyAccessToken(_token) { throw new Error('Not implemented'); }
  verifyRefreshToken(_token) { throw new Error('Not implemented'); }
  generateOpaqueToken() { throw new Error('Not implemented'); }
  hashToken(_token) { throw new Error('Not implemented'); }
  getExpiration(_token) { throw new Error('Not implemented'); }
}

module.exports = ITokenService;
