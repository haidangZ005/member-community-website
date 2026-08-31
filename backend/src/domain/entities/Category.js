const ValidationError = require('../errors/ValidationError');

class Category {
  constructor({ id, name, description = null, createdAt, updatedAt }) {
    const normalizedName = name?.trim();
    const normalizedDescription = description?.trim() || null;
    if (!normalizedName || normalizedName.length < 2 || normalizedName.length > 100) {
      throw new ValidationError('Tên chuyên mục phải có từ 2 đến 100 ký tự');
    }
    if (normalizedDescription && normalizedDescription.length > 500) {
      throw new ValidationError('Mô tả chuyên mục tối đa 500 ký tự');
    }
    this.id = id;
    this.name = normalizedName;
    this.description = normalizedDescription;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = Category;
