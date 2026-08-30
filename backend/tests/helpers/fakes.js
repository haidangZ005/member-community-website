const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../../src/domain/entities/User');

class MemoryUserRepository {
  constructor() { this.users = []; }
  async findById(id) { return this.users.find((user) => user.id === id) || null; }
  async findByEmail(email) { return this.users.find((user) => user.email === email) || null; }
  async findByUsername(username) { return this.users.find((user) => user.username === username) || null; }
  async create(user) {
    const created = new User({ ...user, id: crypto.randomUUID(), createdAt: new Date(), updatedAt: new Date() });
    this.users.push(created);
    return created;
  }
  async updateProfile(id, profile) {
    const user = await this.findById(id);
    Object.assign(user, profile, { updatedAt: new Date() });
    return user;
  }
  async updatePassword(id, passwordHash) {
    const user = await this.findById(id);
    user.passwordHash = passwordHash;
    return user;
  }
}

class MemoryRefreshTokenRepository {
  constructor() { this.tokens = []; }
  async create(token) { const record = { id: crypto.randomUUID(), ...token, revoked_at: null }; this.tokens.push(record); return record; }
  async findValidByHash(tokenHash) { return this.tokens.find((token) => token.tokenHash === tokenHash && !token.revoked_at && token.expiresAt > new Date()) || null; }
  async revokeByHash(tokenHash) { const token = this.tokens.find((item) => item.tokenHash === tokenHash); if (token) token.revoked_at = new Date(); }
  async revokeAllForUser(userId) { this.tokens.filter((token) => token.userId === userId).forEach((token) => { token.revoked_at = new Date(); }); }
}

class MemoryResetTokenRepository {
  constructor() { this.tokens = []; }
  async create(token) { const record = { id: crypto.randomUUID(), ...token, usedAt: null }; this.tokens.push(record); return record; }
  async findValidByHash(tokenHash) { return this.tokens.find((token) => token.tokenHash === tokenHash && !token.usedAt && token.expiresAt > new Date()) || null; }
  async markUsed(id) { const token = this.tokens.find((item) => item.id === id); if (token) token.usedAt = new Date(); }
  async invalidateForUser(userId) { this.tokens.filter((token) => token.userId === userId && !token.usedAt).forEach((token) => { token.usedAt = new Date(); }); }
}

class FakeHashService {
  async hash(value) { return `hashed:${value}`; }
  async compare(value, hash) { return hash === `hashed:${value}`; }
}

class FakeTokenService {
  constructor() { this.accessSecret = 'test-access-secret'; this.refreshSecret = 'test-refresh-secret'; this.lastOpaqueToken = null; }
  generateAccessToken(payload) { return jwt.sign(payload, this.accessSecret, { expiresIn: '15m' }); }
  generateRefreshToken(payload) { return jwt.sign({ ...payload, nonce: crypto.randomUUID() }, this.refreshSecret, { expiresIn: '7d' }); }
  verifyAccessToken(token) { return jwt.verify(token, this.accessSecret); }
  verifyRefreshToken(token) { return jwt.verify(token, this.refreshSecret); }
  generateOpaqueToken() { this.lastOpaqueToken = crypto.randomBytes(16).toString('hex'); return this.lastOpaqueToken; }
  hashToken(token) { return crypto.createHash('sha256').update(token).digest('hex'); }
  getExpiration(token) { return new Date(jwt.decode(token).exp * 1000); }
}

class FakeEmailService {
  constructor() { this.messages = []; }
  async sendPasswordReset(message) { this.messages.push(message); }
}

function makeFakeDependencies() {
  return {
    userRepository: new MemoryUserRepository(),
    refreshTokenRepository: new MemoryRefreshTokenRepository(),
    resetTokenRepository: new MemoryResetTokenRepository(),
    hashService: new FakeHashService(),
    tokenService: new FakeTokenService(),
    emailService: new FakeEmailService(),
  };
}

module.exports = { makeFakeDependencies };
