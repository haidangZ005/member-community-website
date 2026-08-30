const DomainError = require('./DomainError');

class UnauthorizedError extends DomainError {
  constructor(message = 'Thông tin xác thực không hợp lệ') {
    super(message, { code: 'UNAUTHORIZED', statusCode: 401 });
  }
}

module.exports = UnauthorizedError;

