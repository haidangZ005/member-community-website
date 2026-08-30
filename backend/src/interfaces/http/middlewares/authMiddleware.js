const UnauthorizedError = require('../../../domain/errors/UnauthorizedError');

function makeAuthMiddleware(tokenService) {
  return (req, _res, next) => {
    const [scheme, token] = (req.headers.authorization || '').split(' ');
    if (scheme !== 'Bearer' || !token) return next(new UnauthorizedError('Vui lòng đăng nhập'));

    try {
      const payload = tokenService.verifyAccessToken(token);
      req.user = { id: payload.sub, role: payload.role };
      return next();
    } catch {
      return next(new UnauthorizedError('Access token không hợp lệ hoặc đã hết hạn'));
    }
  };
}

module.exports = makeAuthMiddleware;
