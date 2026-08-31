class ICategoryRepository {
  async findById(_id) { throw new Error('Not implemented'); }
  async list() { throw new Error('Not implemented'); }
  async findByName(_name) { throw new Error('Not implemented'); }
  async create(_category) { throw new Error('Not implemented'); }
  async update(_id, _changes) { throw new Error('Not implemented'); }
  async remove(_id) { throw new Error('Not implemented'); }
  async count() { throw new Error('Not implemented'); }
}

module.exports = ICategoryRepository;
