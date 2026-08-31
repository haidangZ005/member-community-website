const NotFoundError = require('../../../domain/errors/NotFoundError');

class UnlockMemberAccount {
  constructor({ userRepository }) { this.userRepository = userRepository; }

  async execute(memberId) {
    const member = await this.userRepository.findById(memberId);
    if (!member) throw new NotFoundError('Không tìm thấy thành viên');
    return (await this.userRepository.updateStatus(memberId, 'active')).toPublicJSON();
  }
}

module.exports = UnlockMemberAccount;
