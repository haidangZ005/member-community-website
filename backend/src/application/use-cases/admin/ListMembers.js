class ListMembers {
  constructor({ userRepository }) { this.userRepository = userRepository; }

  async execute({ page = 1, limit = 10, search = '' } = {}) {
    const normalizedPage = Math.max(1, Number(page) || 1);
    const normalizedLimit = Math.min(50, Math.max(1, Number(limit) || 10));
    const result = await this.userRepository.listMembers({
      page: normalizedPage,
      limit: normalizedLimit,
      search: search.trim(),
    });
    return {
      data: result.items.map((user) => user.toPublicJSON()),
      meta: {
        page: normalizedPage,
        limit: normalizedLimit,
        total: result.total,
        totalPages: Math.max(1, Math.ceil(result.total / normalizedLimit)),
      },
    };
  }
}

module.exports = ListMembers;
