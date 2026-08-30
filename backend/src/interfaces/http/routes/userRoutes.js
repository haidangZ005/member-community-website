const express = require('express');
const asyncHandler = require('../../../shared/utils/asyncHandler');
const validateRequest = require('../middlewares/validateRequest');
const { updateProfileSchema } = require('../validators/authValidator');

function makeUserRoutes(controller, authMiddleware) {
  const router = express.Router();
  router.use(authMiddleware);
  router.get('/me', asyncHandler(controller.getMe));
  router.put('/me', validateRequest(updateProfileSchema), asyncHandler(controller.updateMe));
  return router;
}

module.exports = makeUserRoutes;

