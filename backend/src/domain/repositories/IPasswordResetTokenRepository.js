class IPasswordResetTokenRepository {
  async create(_token) { throw new Error('Not implemented'); }
  async findValidByHash(_tokenHash) { throw new Error('Not implemented'); }
  async markUsed(_id) { throw new Error('Not implemented'); }
  async invalidateForUser(_userId) { throw new Error('Not implemented'); }
}

module.exports = IPasswordResetTokenRepository;

