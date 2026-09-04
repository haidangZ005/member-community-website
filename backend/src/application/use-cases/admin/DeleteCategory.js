const NotFoundError = require('../../../domain/errors/NotFoundError');
const ForbiddenError = require('../../../domain/errors/ForbiddenError');

class DeleteCategory {
  constructor({ categoryRepository }) { this.categoryRepository = categoryRepository; }

  async execute(id, ownerId = null) {
    const category = await this.categoryRepository.findById(id);
    if (!category) throw new NotFoundError('Không tìm thấy chuyên mục');
    if (ownerId && category.ownerId !== ownerId) throw new ForbiddenError('Bạn chỉ có thể xóa cộng đồng do mình tạo');
    await this.categoryRepository.remove(id);
    return { message: 'Đã xóa chuyên mục' };
  }
}

module.exports = DeleteCategory;
