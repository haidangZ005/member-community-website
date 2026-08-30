const ValidationError = require('../errors/ValidationError');

class Comment {
  constructor({ id, postId, authorId, content, status = 'visible', author = null, createdAt, updatedAt }) {
    const normalizedContent = content?.trim();
    if (!normalizedContent || normalizedContent.length < 2 || normalizedContent.length > 2000) {
      throw new ValidationError('Bình luận phải có từ 2 đến 2000 ký tự');
    }
    if (!['visible', 'removed'].includes(status)) {
      throw new ValidationError('Trạng thái bình luận không hợp lệ');
    }
    this.id = id;
    this.postId = postId;
    this.authorId = authorId;
    this.content = normalizedContent;
    this.status = status;
    this.author = author;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toJSON() {
    return {
      id: this.id,
      postId: this.postId,
      authorId: this.authorId,
      content: this.content,
      status: this.status,
      author: this.author,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = Comment;
