const UnauthorizedError = require('../../../domain/errors/UnauthorizedError');

class LoginUser {
  constructor({ userRepository, hashService, tokenService, refreshTokenRepository }) {
    this.userRepository = userRepository;
    this.hashService = hashService;
    this.tokenService = tokenService;
    this.refreshTokenRepository = refreshTokenRepository;
  }

  async execute({ email, password }) {
    const user = await this.userRepository.findByEmail(email?.trim().toLowerCase());
    if (!user || !(await this.hashService.compare(password, user.passwordHash))) {
      throw new UnauthorizedError('Email hoặc mật khẩu không đúng');
    }
    if (user.status === 'locked') {
      throw new UnauthorizedError('Tài khoản đã bị khóa');
    }

    const payload = { sub: user.id, role: user.role };
    const accessToken = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);
    await this.refreshTokenRepository.create({
      userId: user.id,
      tokenHash: this.tokenService.hashToken(refreshToken),
      expiresAt: this.tokenService.getExpiration(refreshToken),
    });

    return { accessToken, refreshToken, user: user.toPublicJSON() };
  }
}

module.exports = LoginUser;

