const Category = require('../../../domain/entities/Category');
const ConflictError = require('../../../domain/errors/ConflictError');

class CreateCategory {
  constructor({ categoryRepository }) { this.categoryRepository = categoryRepository; }

  async execute(input) {
    const category = new Category(input);
    if (await this.categoryRepository.findByName(category.name)) throw new ConflictError('Tên chuyên mục đã tồn tại');
    return (await this.categoryRepository.create(category)).toJSON();
  }
}

module.exports = CreateCategory;
