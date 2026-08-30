class IRefreshTokenRepository {
  async create(_token) { throw new Error('Not implemented'); }
  async findValidByHash(_tokenHash) { throw new Error('Not implemented'); }
  async revokeByHash(_tokenHash) { throw new Error('Not implemented'); }
  async revokeAllForUser(_userId) { throw new Error('Not implemented'); }
}

module.exports = IRefreshTokenRepository;

