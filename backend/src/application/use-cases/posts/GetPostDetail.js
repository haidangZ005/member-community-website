const NotFoundError = require('../../../domain/errors/NotFoundError');

class GetPostDetail {
  constructor({ postRepository }) { this.postRepository = postRepository; }

  async execute(id, viewerId = null) {
    const post = await this.postRepository.findById(id, viewerId);
    if (!post || post.status !== 'published') throw new NotFoundError('Không tìm thấy bài viết');
    return post.toJSON();
  }
}

module.exports = GetPostDetail;
