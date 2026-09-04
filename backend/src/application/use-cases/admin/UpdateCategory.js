const Category = require('../../../domain/entities/Category');
const ConflictError = require('../../../domain/errors/ConflictError');
const ForbiddenError = require('../../../domain/errors/ForbiddenError');
const NotFoundError = require('../../../domain/errors/NotFoundError');

class UpdateCategory {
  constructor({ categoryRepository }) { this.categoryRepository = categoryRepository; }

  async execute(id, input, ownerId = null) {
    const current = await this.categoryRepository.findById(id);
    if (!current) throw new NotFoundError('Không tìm thấy chuyên mục');
    if (ownerId && current.ownerId !== ownerId) throw new ForbiddenError('Bạn chỉ có thể sửa cộng đồng do mình tạo');
    const candidate = new Category({ ...current.toJSON(), ...input });
    const duplicate = await this.categoryRepository.findByName(candidate.name);
    if (duplicate && duplicate.id !== id) throw new ConflictError('Tên chuyên mục đã tồn tại');
    return (await this.categoryRepository.update(id, candidate)).toJSON();
  }
}

module.exports = UpdateCategory;
