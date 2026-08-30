const ForbiddenError = require('../../../domain/errors/ForbiddenError');
const NotFoundError = require('../../../domain/errors/NotFoundError');

class DeletePost {
  constructor({ postRepository }) { this.postRepository = postRepository; }

  async execute(id, userId) {
    const post = await this.postRepository.findById(id, userId);
    if (!post || post.status !== 'published') throw new NotFoundError('Không tìm thấy bài viết');
    if (post.authorId !== userId) throw new ForbiddenError('Bạn chỉ có thể xóa bài viết của mình');
    await this.postRepository.remove(id);
    return { message: 'Đã xóa bài viết' };
  }
}

module.exports = DeletePost;
