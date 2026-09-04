const ValidationError = require('../errors/ValidationError');

class Category {
  constructor({ id, name, description = null, ownerId = null, joinedByCurrentUser = false, favoriteByCurrentUser = false, createdAt, updatedAt }) {
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
    this.ownerId = ownerId;
    this.joinedByCurrentUser = Boolean(joinedByCurrentUser);
    this.favoriteByCurrentUser = Boolean(favoriteByCurrentUser);
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      ownerId: this.ownerId,
      joinedByCurrentUser: this.joinedByCurrentUser,
      favoriteByCurrentUser: this.favoriteByCurrentUser,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = Category;
