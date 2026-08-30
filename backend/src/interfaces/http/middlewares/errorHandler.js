const DomainError = require('../../../domain/errors/DomainError');

function errorHandler(error, _req, res, _next) {
  if (error instanceof DomainError) {
    return res.status(error.statusCode).json({ error: { code: error.code, message: error.message } });
  }
  if (error?.code === '23505') {
    return res.status(409).json({ error: { code: 'CONFLICT', message: 'Dữ liệu đã tồn tại' } });
  }

  if (process.env.NODE_ENV !== 'test') console.error(error);
  return res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Đã có lỗi xảy ra' } });
}

module.exports = errorHandler;

