class IPostRepository {
  async create(_post) { throw new Error('Not implemented'); }
  async list(_options) { throw new Error('Not implemented'); }
  async findById(_id, _viewerId) { throw new Error('Not implemented'); }
  async update(_id, _changes, _viewerId) { throw new Error('Not implemented'); }
  async remove(_id) { throw new Error('Not implemented'); }
}

module.exports = IPostRepository;
