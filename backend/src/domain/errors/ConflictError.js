const DomainError = require('./DomainError');

class ConflictError extends DomainError {
  constructor(message) {
    super(message, { code: 'CONFLICT', statusCode: 409 });
  }
}

module.exports = ConflictError;

