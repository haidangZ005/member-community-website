const express = require('express');
const rateLimit = require('express-rate-limit');
const asyncHandler = require('../../../shared/utils/asyncHandler');
const validateRequest = require('../middlewares/validateRequest');
const schemas = require('../validators/authValidator');

function makeAuthRoutes(controller) {
  const router = express.Router();
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: { code: 'TOO_MANY_REQUESTS', message: 'Bạn thao tác quá nhanh, vui lòng thử lại sau.' } },
  });

  router.post('/register', authLimiter, validateRequest(schemas.registerSchema), asyncHandler(controller.register));
  router.post('/login', authLimiter, validateRequest(schemas.loginSchema), asyncHandler(controller.login));
  router.post('/refresh', asyncHandler(controller.refresh));
  router.post('/logout', asyncHandler(controller.logout));
  router.post('/forgot-password', authLimiter, validateRequest(schemas.forgotPasswordSchema), asyncHandler(controller.forgotPassword));
  router.post('/reset-password', authLimiter, validateRequest(schemas.resetPasswordSchema), asyncHandler(controller.resetPassword));
  return router;
}

module.exports = makeAuthRoutes;

