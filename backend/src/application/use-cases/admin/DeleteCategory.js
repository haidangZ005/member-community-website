const NotFoundError = require('../../../domain/errors/NotFoundError');

class DeleteCategory {
  constructor({ categoryRepository }) { this.categoryRepository = categoryRepository; }

  async execute(id) {
    if (!(await this.categoryRepository.findById(id))) throw new NotFoundError('Không tìm thấy chuyên mục');
    await this.categoryRepository.remove(id);
    return { message: 'Đã xóa chuyên mục' };
  }
}

module.exports = DeleteCategory;
