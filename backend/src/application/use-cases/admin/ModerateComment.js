const NotFoundError = require('../../../domain/errors/NotFoundError');

class ModerateComment {
  constructor({ commentRepository }) { this.commentRepository = commentRepository; }

  async execute(commentId) {
    if (!(await this.commentRepository.findById(commentId))) throw new NotFoundError('Không tìm thấy bình luận');
    await this.commentRepository.moderate(commentId, 'removed');
    return { message: 'Đã gỡ bình luận khỏi cộng đồng' };
  }
}

module.exports = ModerateComment;
