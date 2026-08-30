const UnauthorizedError = require('../../../domain/errors/UnauthorizedError');

class RefreshSession {
  constructor({ userRepository, tokenService, refreshTokenRepository }) {
    this.userRepository = userRepository;
    this.tokenService = tokenService;
    this.refreshTokenRepository = refreshTokenRepository;
  }

  async execute(refreshToken) {
    if (!refreshToken) throw new UnauthorizedError('Thiếu refresh token');

    let payload;
    try {
      payload = this.tokenService.verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedError('Phiên đăng nhập đã hết hạn');
    }

    const tokenHash = this.tokenService.hashToken(refreshToken);
    const storedToken = await this.refreshTokenRepository.findValidByHash(tokenHash);
    const user = storedToken && await this.userRepository.findById(payload.sub);
    if (!storedToken || !user || user.status !== 'active') {
      throw new UnauthorizedError('Phiên đăng nhập không còn hợp lệ');
    }

    await this.refreshTokenRepository.revokeByHash(tokenHash);
    const nextPayload = { sub: user.id, role: user.role };
    const nextRefreshToken = this.tokenService.generateRefreshToken(nextPayload);
    await this.refreshTokenRepository.create({
      userId: user.id,
      tokenHash: this.tokenService.hashToken(nextRefreshToken),
      expiresAt: this.tokenService.getExpiration(nextRefreshToken),
    });

    return {
      accessToken: this.tokenService.generateAccessToken(nextPayload),
      refreshToken: nextRefreshToken,
      user: user.toPublicJSON(),
    };
  }
}

module.exports = RefreshSession;
