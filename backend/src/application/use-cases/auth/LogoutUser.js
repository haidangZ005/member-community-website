class LogoutUser {
  constructor({ refreshTokenRepository, tokenService }) {
    this.refreshTokenRepository = refreshTokenRepository;
    this.tokenService = tokenService;
  }

  async execute(refreshToken) {
    if (refreshToken) {
      await this.refreshTokenRepository.revokeByHash(this.tokenService.hashToken(refreshToken));
    }
  }
}

module.exports = LogoutUser;

