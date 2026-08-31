const NotFoundError = require('../../../domain/errors/NotFoundError');

class AdminDeletePost {
  constructor({ postRepository }) { this.postRepository = postRepository; }

  async execute(postId) {
    const post = await this.postRepository.findById(postId);
    if (!post) throw new NotFoundError('Không tìm thấy bài viết');
    await this.postRepository.remove(postId);
    return { message: 'Đã gỡ bài viết khỏi cộng đồng' };
  }
}

module.exports = AdminDeletePost;
