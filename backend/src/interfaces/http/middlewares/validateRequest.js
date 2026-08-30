const ValidationError = require('../../../domain/errors/ValidationError');

function validateRequest(schema, source = 'body') {
  return (req, _res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const message = result.error.issues.map((issue) => issue.message).join(', ');
      return next(new ValidationError(message));
    }
    const target = `validated${source.slice(0, 1).toUpperCase()}${source.slice(1)}`;
    req[target] = result.data;
    return next();
  };
}

module.exports = validateRequest;
