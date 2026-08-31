const ForbiddenError = require('../../../domain/errors/ForbiddenError');
const NotFoundError = require('../../../domain/errors/NotFoundError');

class LockMemberAccount {
  constructor({ userRepository, refreshTokenRepository }) {
    this.userRepository = userRepository;
    this.refreshTokenRepository = refreshTokenRepository;
  }

  async execute(memberId) {
    const member = await this.userRepository.findById(memberId);
    if (!member) throw new NotFoundError('Không tìm thấy thành viên');
    if (member.role === 'admin') throw new ForbiddenError('Không thể khóa tài khoản quản trị');
    const updated = await this.userRepository.updateStatus(memberId, 'locked');
    await this.refreshTokenRepository.revokeAllForUser(memberId);
    return updated.toPublicJSON();
  }
}

module.exports = LockMemberAccount;
