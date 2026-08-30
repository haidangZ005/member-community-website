const UnauthorizedError = require('../../../domain/errors/UnauthorizedError');
const ValidationError = require('../../../domain/errors/ValidationError');

class ResetPassword {
  constructor({ userRepository, resetTokenRepository, refreshTokenRepository, hashService, tokenService }) {
    this.userRepository = userRepository;
    this.resetTokenRepository = resetTokenRepository;
    this.refreshTokenRepository = refreshTokenRepository;
    this.hashService = hashService;
    this.tokenService = tokenService;
  }

  async execute({ token, password }) {
    if (!password || password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      throw new ValidationError('Mật khẩu phải có ít nhất 8 ký tự, gồm chữ và số');
    }
    const record = await this.resetTokenRepository.findValidByHash(this.tokenService.hashToken(token));
    if (!record) throw new UnauthorizedError('Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn');

    await this.userRepository.updatePassword(record.userId, await this.hashService.hash(password));
    await this.resetTokenRepository.markUsed(record.id);
    await this.refreshTokenRepository.revokeAllForUser(record.userId);
  }
}

module.exports = ResetPassword;
