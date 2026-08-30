const ConflictError = require('../../../domain/errors/ConflictError');
const NotFoundError = require('../../../domain/errors/NotFoundError');

class UpdateProfile {
  constructor({ userRepository }) { this.userRepository = userRepository; }

  async execute(userId, { username, fullName, avatarUrl }) {
    const current = await this.userRepository.findById(userId);
    if (!current) throw new NotFoundError('Không tìm thấy tài khoản');

    if (username && username !== current.username) {
      const existing = await this.userRepository.findByUsername(username);
      if (existing && existing.id !== userId) throw new ConflictError('Tên người dùng đã tồn tại');
    }

    const updated = await this.userRepository.updateProfile(userId, {
      username: username?.trim() || current.username,
      fullName: fullName?.trim() || null,
      avatarUrl: avatarUrl?.trim() || null,
    });
    return updated.toPublicJSON();
  }
}

module.exports = UpdateProfile;
