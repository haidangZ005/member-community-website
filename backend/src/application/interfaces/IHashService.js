class IHashService {
  async hash(_value) { throw new Error('Not implemented'); }
  async compare(_value, _hash) { throw new Error('Not implemented'); }
}

module.exports = IHashService;

