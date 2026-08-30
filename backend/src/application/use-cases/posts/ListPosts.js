class ListPosts {
  constructor({ postRepository }) { this.postRepository = postRepository; }

  async execute({ page = 1, limit = 10, categoryId = null, viewerId = null } = {}) {
    const normalizedPage = Math.max(1, Number(page) || 1);
    const normalizedLimit = Math.min(50, Math.max(1, Number(limit) || 10));
    const result = await this.postRepository.list({
      page: normalizedPage,
      limit: normalizedLimit,
      categoryId: categoryId || null,
      viewerId,
    });
    return {
      data: result.items.map((post) => post.toJSON()),
      meta: {
        page: normalizedPage,
        limit: normalizedLimit,
        total: result.total,
        totalPages: Math.max(1, Math.ceil(result.total / normalizedLimit)),
      },
    };
  }
}

module.exports = ListPosts;
