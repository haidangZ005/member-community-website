const ValidationError = require('../errors/ValidationError');

class User {
  constructor({
    id,
    username,
    email,
    passwordHash,
    fullName = null,
    avatarUrl = null,
    role = 'member',
    status = 'active',
    createdAt,
    updatedAt,
  }) {
    const normalizedEmail = email?.trim().toLowerCase();
    const normalizedUsername = username?.trim();

    if (!normalizedUsername || normalizedUsername.length < 3 || normalizedUsername.length > 50) {
      throw new ValidationError('Tên người dùng phải có từ 3 đến 50 ký tự');
    }
    if (!/^[a-zA-Z0-9_]+$/.test(normalizedUsername)) {
      throw new ValidationError('Tên người dùng chỉ gồm chữ, số và dấu gạch dưới');
    }
    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      throw new ValidationError('Email không hợp lệ');
    }
    if (!['member', 'admin'].includes(role) || !['active', 'locked'].includes(status)) {
      throw new ValidationError('Vai trò hoặc trạng thái tài khoản không hợp lệ');
    }

    this.id = id;
    this.username = normalizedUsername;
    this.email = normalizedEmail;
    this.passwordHash = passwordHash;
    this.fullName = fullName?.trim() || null;
    this.avatarUrl = avatarUrl?.trim() || null;
    this.role = role;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toPublicJSON() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      fullName: this.fullName,
      avatarUrl: this.avatarUrl,
      role: this.role,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = User;

