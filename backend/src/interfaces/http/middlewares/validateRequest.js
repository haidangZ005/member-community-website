const ValidationError = require('../../../domain/errors/ValidationError');

function validateRequest(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.issues.map((issue) => issue.message).join(', ');
      return next(new ValidationError(message));
    }
    req.validatedBody = result.data;
    return next();
  };
}

module.exports = validateRequest;

