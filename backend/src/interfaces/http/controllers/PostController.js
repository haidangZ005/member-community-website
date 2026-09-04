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
    async listCategories(req, res) {
      const { id, search = '', limit, mine } = req.validatedQuery;
      if (id) {
        const category = await dependencies.categoryRepository.findById(id);
        return res.json({ data: category ? [category] : [] });
      }
      return res.json({ data: await dependencies.categoryRepository.list({ search, limit, ownerId: mine ? req.user.id : null }) });
    },
    async createCategory(req, res) {
      return res.status(201).json({ data: await useCases.createCategory.execute(req.validatedBody, req.user.id) });
    },
    async updateCategory(req, res) {
      return res.json({ data: await useCases.updateCategory.execute(req.validatedParams.id, req.validatedBody, req.user.id) });
    },
    async deleteCategory(req, res) {
      return res.json({ data: await useCases.deleteCategory.execute(req.validatedParams.id, req.user.id) });
    },
  };
}

module.exports = makePostController;
