const DomainError = require('./DomainError');

class ForbiddenError extends DomainError {
  constructor(message = 'Bạn không có quyền thực hiện thao tác này') {
    super(message, { code: 'FORBIDDEN', statusCode: 403 });
  }
}

module.exports = ForbiddenError;
