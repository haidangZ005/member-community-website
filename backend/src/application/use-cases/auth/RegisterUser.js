const User = require('../../../domain/entities/User');
const ConflictError = require('../../../domain/errors/ConflictError');
const ValidationError = require('../../../domain/errors/ValidationError');

class RegisterUser {
  constructor({ userRepository, hashService }) {
    this.userRepository = userRepository;
    this.hashService = hashService;
  }

  async execute({ username, email, password, fullName }) {
    if (!password || password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      throw new ValidationError('Mật khẩu phải có ít nhất 8 ký tự, gồm chữ và số');
    }

    const normalizedEmail = email?.trim().toLowerCase();
    const normalizedUsername = username?.trim();
    if (await this.userRepository.findByEmail(normalizedEmail)) {
      throw new ConflictError('Email đã được sử dụng');
    }
    if (await this.userRepository.findByUsername(normalizedUsername)) {
      throw new ConflictError('Tên người dùng đã tồn tại');
    }

    const passwordHash = await this.hashService.hash(password);
    const user = new User({ username: normalizedUsername, email: normalizedEmail, passwordHash, fullName });
    const created = await this.userRepository.create(user);
    return created.toPublicJSON();
  }
}

module.exports = RegisterUser;

