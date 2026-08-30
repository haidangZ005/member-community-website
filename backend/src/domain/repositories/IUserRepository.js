class IUserRepository {
  async findById(_id) { throw new Error('Not implemented'); }
  async findByEmail(_email) { throw new Error('Not implemented'); }
  async findByUsername(_username) { throw new Error('Not implemented'); }
  async create(_user) { throw new Error('Not implemented'); }
  async updateProfile(_id, _profile) { throw new Error('Not implemented'); }
  async updatePassword(_id, _passwordHash) { throw new Error('Not implemented'); }
}

module.exports = IUserRepository;

