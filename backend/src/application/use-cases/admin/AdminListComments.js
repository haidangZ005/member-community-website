class AdminListComments {
  constructor({ commentRepository }) { this.commentRepository = commentRepository; }

  async execute({ page = 1, limit = 10, search = '', status = null } = {}) {
    const normalizedPage = Math.max(1, Number(page) || 1);
    const normalizedLimit = Math.min(50, Math.max(1, Number(limit) || 10));
    const result = await this.commentRepository.listAll({
      page: normalizedPage,
      limit: normalizedLimit,
      search: search.trim(),
      status: status || null,
    });
    return {
      data: result.items.map((comment) => comment.toJSON()),
      meta: { page: normalizedPage, limit: normalizedLimit, total: result.total, totalPages: Math.max(1, Math.ceil(result.total / normalizedLimit)) },
    };
  }
}

module.exports = AdminListComments;
