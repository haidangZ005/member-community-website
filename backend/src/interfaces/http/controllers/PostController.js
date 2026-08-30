function makePostController(useCases, dependencies) {
  return {
    async list(req, res) {
      const result = await useCases.listPosts.execute({ ...req.validatedQuery, viewerId: req.user.id });
      return res.json(result);
    },
    async getById(req, res) {
      return res.json({ data: await useCases.getPostDetail.execute(req.validatedParams.id, req.user.id) });
    },
    async create(req, res) {
      return res.status(201).json({ data: await useCases.createPost.execute(req.user.id, req.validatedBody) });
    },
    async update(req, res) {
      return res.json({ data: await useCases.editPost.execute(req.validatedParams.id, req.user.id, req.validatedBody) });
    },
    async remove(req, res) {
      return res.json({ data: await useCases.deletePost.execute(req.validatedParams.id, req.user.id) });
    },
    async like(req, res) {
      return res.json({ data: await useCases.likePost.execute(req.validatedParams.id, req.user.id) });
    },
    async unlike(req, res) {
      return res.json({ data: await useCases.unlikePost.execute(req.validatedParams.id, req.user.id) });
    },
    async listComments(req, res) {
      return res.json({ data: await useCases.listCommentsByPost.execute(req.validatedParams.id, req.user.id) });
    },
    async createComment(req, res) {
      return res.status(201).json({ data: await useCases.createComment.execute(req.validatedParams.id, req.user.id, req.validatedBody) });
    },
    async listCategories(_req, res) {
      return res.json({ data: await dependencies.categoryRepository.list() });
    },
  };
}

module.exports = makePostController;
