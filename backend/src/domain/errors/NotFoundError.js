const DomainError = require('./DomainError');

class NotFoundError extends DomainError {
  constructor(message = 'Không tìm thấy dữ liệu') {
    super(message, { code: 'NOT_FOUND', statusCode: 404 });
  }
}

module.exports = NotFoundError;

