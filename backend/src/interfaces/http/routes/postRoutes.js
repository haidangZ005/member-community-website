const express = require('express');
const asyncHandler = require('../../../shared/utils/asyncHandler');
const validateRequest = require('../middlewares/validateRequest');
const { createPostSchema, updatePostSchema, createCommentSchema, postIdSchema, listPostsSchema } = require('../validators/postValidator');

function makePostRoutes(controller, authMiddleware) {
  const router = express.Router();
  router.use(authMiddleware);
  router.get('/categories', asyncHandler(controller.listCategories));
  router.get('/', validateRequest(listPostsSchema, 'query'), asyncHandler(controller.list));
  router.post('/', validateRequest(createPostSchema), asyncHandler(controller.create));
  router.get('/:id', validateRequest(postIdSchema, 'params'), asyncHandler(controller.getById));
  router.put('/:id', validateRequest(postIdSchema, 'params'), validateRequest(updatePostSchema), asyncHandler(controller.update));
  router.delete('/:id', validateRequest(postIdSchema, 'params'), asyncHandler(controller.remove));
  router.post('/:id/like', validateRequest(postIdSchema, 'params'), asyncHandler(controller.like));
  router.delete('/:id/like', validateRequest(postIdSchema, 'params'), asyncHandler(controller.unlike));
  router.get('/:id/comments', validateRequest(postIdSchema, 'params'), asyncHandler(controller.listComments));
  router.post('/:id/comments', validateRequest(postIdSchema, 'params'), validateRequest(createCommentSchema), asyncHandler(controller.createComment));
  return router;
}

module.exports = makePostRoutes;
