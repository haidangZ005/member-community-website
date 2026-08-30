const express = require('express');
const makeAuthRoutes = require('./authRoutes');
const makeUserRoutes = require('./userRoutes');
const makePostRoutes = require('./postRoutes');

function makeRoutes({ authController, userController, postController, authMiddleware }) {
  const router = express.Router();
  router.get('/health', (_req, res) => res.json({ data: { status: 'ok' } }));
  router.use('/auth', makeAuthRoutes(authController));
  router.use('/users', makeUserRoutes(userController, authMiddleware));
  router.use('/posts', makePostRoutes(postController, authMiddleware));
  return router;
}

module.exports = makeRoutes;
