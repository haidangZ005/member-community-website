const DomainError = require('./DomainError');

class ValidationError extends DomainError {
  constructor(message) {
    super(message, { code: 'VALIDATION_ERROR', statusCode: 422 });
  }
}

module.exports = ValidationError;

