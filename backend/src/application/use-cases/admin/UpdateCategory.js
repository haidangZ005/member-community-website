const Category = require('../../../domain/entities/Category');
const ConflictError = require('../../../domain/errors/ConflictError');
const NotFoundError = require('../../../domain/errors/NotFoundError');

class UpdateCategory {
  constructor({ categoryRepository }) { this.categoryRepository = categoryRepository; }

  async execute(id, input) {
    const current = await this.categoryRepository.findById(id);
    if (!current) throw new NotFoundError('Không tìm thấy chuyên mục');
    const candidate = new Category({ ...current.toJSON(), ...input });
    const duplicate = await this.categoryRepository.findByName(candidate.name);
    if (duplicate && duplicate.id !== id) throw new ConflictError('Tên chuyên mục đã tồn tại');
    return (await this.categoryRepository.update(id, candidate)).toJSON();
  }
}

module.exports = UpdateCategory;
