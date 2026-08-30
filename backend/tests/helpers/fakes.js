const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../../src/domain/entities/User');
const Post = require('../../src/domain/entities/Post');
const Comment = require('../../src/domain/entities/Comment');

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

class MemoryCategoryRepository {
  constructor() {
    const now = new Date();
    this.categories = [
      { id: crypto.randomUUID(), name: 'Hỏi đáp', description: 'Cùng nhau giải đáp', createdAt: now, updatedAt: now },
      { id: crypto.randomUUID(), name: 'Chia sẻ', description: 'Kinh nghiệm thành viên', createdAt: now, updatedAt: now },
    ];
  }
  async findById(id) { return this.categories.find((category) => category.id === id) || null; }
  async list() { return [...this.categories]; }
}

class MemoryLikeRepository {
  constructor() { this.likes = []; }
  async create(postId, userId) {
    if (!this.likes.some((like) => like.postId === postId && like.userId === userId)) this.likes.push({ postId, userId });
  }
  async remove(postId, userId) { this.likes = this.likes.filter((like) => like.postId !== postId || like.userId !== userId); }
  async countByPost(postId) { return this.likes.filter((like) => like.postId === postId).length; }
  has(postId, userId) { return this.likes.some((like) => like.postId === postId && like.userId === userId); }
}

class MemoryCommentRepository {
  constructor(userRepository) { this.comments = []; this.userRepository = userRepository; }
  async create(comment) {
    const user = await this.userRepository.findById(comment.authorId);
    const created = new Comment({
      ...comment,
      id: crypto.randomUUID(),
      author: user ? { id: user.id, username: user.username, fullName: user.fullName, avatarUrl: user.avatarUrl } : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    this.comments.push(created);
    return created;
  }
  async listByPost(postId) { return this.comments.filter((comment) => comment.postId === postId && comment.status === 'visible'); }
  countByPost(postId) { return this.comments.filter((comment) => comment.postId === postId && comment.status === 'visible').length; }
}

class MemoryPostRepository {
  constructor(userRepository, categoryRepository, likeRepository, commentRepository) {
    this.posts = [];
    this.userRepository = userRepository;
    this.categoryRepository = categoryRepository;
    this.likeRepository = likeRepository;
    this.commentRepository = commentRepository;
  }
  async hydrate(post, viewerId = null) {
    const user = await this.userRepository.findById(post.authorId);
    const category = post.categoryId ? await this.categoryRepository.findById(post.categoryId) : null;
    return new Post({
      ...post,
      author: user ? { id: user.id, username: user.username, fullName: user.fullName, avatarUrl: user.avatarUrl } : null,
      category: category ? { id: category.id, name: category.name } : null,
      likeCount: await this.likeRepository.countByPost(post.id),
      commentCount: this.commentRepository.countByPost(post.id),
      likedByCurrentUser: viewerId ? this.likeRepository.has(post.id, viewerId) : false,
    });
  }
  async create(post) {
    const created = new Post({ ...post, id: crypto.randomUUID(), createdAt: new Date(), updatedAt: new Date() });
    this.posts.push(created);
    return this.hydrate(created, post.authorId);
  }
  async list({ page, limit, categoryId, viewerId }) {
    const filtered = this.posts.filter((post) => post.status === 'published' && (!categoryId || post.categoryId === categoryId));
    const pageItems = filtered.slice((page - 1) * limit, page * limit);
    return { items: await Promise.all(pageItems.map((post) => this.hydrate(post, viewerId))), total: filtered.length };
  }
  async findById(id, viewerId = null) {
    const post = this.posts.find((item) => item.id === id);
    return post ? this.hydrate(post, viewerId) : null;
  }
  async update(id, changes, viewerId = null) {
    const post = this.posts.find((item) => item.id === id);
    Object.assign(post, changes, { updatedAt: new Date() });
    return this.hydrate(post, viewerId);
  }
  async remove(id) { const post = this.posts.find((item) => item.id === id); if (post) post.status = 'removed'; }
}

function makeFakeDependencies() {
  const userRepository = new MemoryUserRepository();
  const categoryRepository = new MemoryCategoryRepository();
  const likeRepository = new MemoryLikeRepository();
  const commentRepository = new MemoryCommentRepository(userRepository);
  const postRepository = new MemoryPostRepository(userRepository, categoryRepository, likeRepository, commentRepository);
  return {
    userRepository,
    refreshTokenRepository: new MemoryRefreshTokenRepository(),
    resetTokenRepository: new MemoryResetTokenRepository(),
    hashService: new FakeHashService(),
    tokenService: new FakeTokenService(),
    emailService: new FakeEmailService(),
    categoryRepository,
    postRepository,
    commentRepository,
    likeRepository,
  };
}

module.exports = { makeFakeDependencies };
