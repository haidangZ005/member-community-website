const NotFoundError = require('../../../domain/errors/NotFoundError');

class UnlikePost {
  constructor({ postRepository, likeRepository }) {
    this.postRepository = postRepository;
    this.likeRepository = likeRepository;
  }

  async execute(postId, userId) {
    const post = await this.postRepository.findById(postId, userId);
    if (!post || post.status !== 'published') throw new NotFoundError('Không tìm thấy bài viết');
    await this.likeRepository.remove(postId, userId);
    return { liked: false, likeCount: await this.likeRepository.countByPost(postId) };
  }
}

module.exports = UnlikePost;
