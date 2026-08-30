const DomainError = require('../../../domain/errors/DomainError');

function roleGuard(...allowedRoles) {
  return (req, _res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new DomainError('Không đủ quyền truy cập', { code: 'FORBIDDEN', statusCode: 403 }));
    }
    return next();
  };
}

module.exports = roleGuard;

