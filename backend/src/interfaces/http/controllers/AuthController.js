const env = require('../../../infrastructure/config/env');

function refreshCookieOptions() {
  return {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api/auth',
  };
}

function makeAuthController(useCases) {
  return {
    async register(req, res) {
      const user = await useCases.registerUser.execute(req.validatedBody);
      return res.status(201).json({ data: user });
    },

    async login(req, res) {
      const result = await useCases.loginUser.execute(req.validatedBody);
      res.cookie('refreshToken', result.refreshToken, refreshCookieOptions());
      return res.json({ data: { accessToken: result.accessToken, user: result.user } });
    },

    async refresh(req, res) {
      const result = await useCases.refreshSession.execute(req.cookies.refreshToken);
      res.cookie('refreshToken', result.refreshToken, refreshCookieOptions());
      return res.json({ data: { accessToken: result.accessToken, user: result.user } });
    },

    async logout(req, res) {
      await useCases.logoutUser.execute(req.cookies.refreshToken);
      res.clearCookie('refreshToken', refreshCookieOptions());
      return res.json({ data: { message: 'Đăng xuất thành công' } });
    },

    async forgotPassword(req, res) {
      await useCases.forgotPassword.execute(req.validatedBody);
      return res.json({ data: { message: 'Nếu email tồn tại, hướng dẫn đặt lại mật khẩu đã được gửi.' } });
    },

    async resetPassword(req, res) {
      await useCases.resetPassword.execute(req.validatedBody);
      res.clearCookie('refreshToken', refreshCookieOptions());
      return res.json({ data: { message: 'Mật khẩu đã được cập nhật. Vui lòng đăng nhập lại.' } });
    },
  };
}

module.exports = makeAuthController;
