const NotFoundError = require('../../../domain/errors/NotFoundError');

class LikePost {
  constructor({ postRepository, likeRepository }) {
    this.postRepository = postRepository;
    this.likeRepository = likeRepository;
  }

  async execute(postId, userId) {
    const post = await this.postRepository.findById(postId, userId);
    if (!post || post.status !== 'published') throw new NotFoundError('Không tìm thấy bài viết');
    await this.likeRepository.create(postId, userId);
    return { liked: true, likeCount: await this.likeRepository.countByPost(postId) };
  }
}

module.exports = LikePost;
