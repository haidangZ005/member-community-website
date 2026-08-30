const NotFoundError = require('../../../domain/errors/NotFoundError');

class GetProfile {
  constructor({ userRepository }) { this.userRepository = userRepository; }

  async execute(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundError('Không tìm thấy tài khoản');
    return user.toPublicJSON();
  }
}

module.exports = GetProfile;

