const express = require('express');
const makeAuthRoutes = require('./authRoutes');
const makeUserRoutes = require('./userRoutes');

function makeRoutes({ authController, userController, authMiddleware }) {
  const router = express.Router();
  router.get('/health', (_req, res) => res.json({ data: { status: 'ok' } }));
  router.use('/auth', makeAuthRoutes(authController));
  router.use('/users', makeUserRoutes(userController, authMiddleware));
  return router;
}

module.exports = makeRoutes;

