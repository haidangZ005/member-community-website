class ILikeRepository {
  async create(_postId, _userId) { throw new Error('Not implemented'); }
  async remove(_postId, _userId) { throw new Error('Not implemented'); }
  async countByPost(_postId) { throw new Error('Not implemented'); }
}

module.exports = ILikeRepository;
