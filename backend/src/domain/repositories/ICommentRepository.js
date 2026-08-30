class ICommentRepository {
  async create(_comment) { throw new Error('Not implemented'); }
  async listByPost(_postId) { throw new Error('Not implemented'); }
}

module.exports = ICommentRepository;
