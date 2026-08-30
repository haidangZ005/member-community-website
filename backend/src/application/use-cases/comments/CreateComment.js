const Comment = require('../../../domain/entities/Comment');
const NotFoundError = require('../../../domain/errors/NotFoundError');

class CreateComment {
  constructor({ postRepository, commentRepository }) {
    this.postRepository = postRepository;
    this.commentRepository = commentRepository;
  }

  async execute(postId, authorId, input) {
    const post = await this.postRepository.findById(postId, authorId);
    if (!post || post.status !== 'published') throw new NotFoundError('Không tìm thấy bài viết');
    const comment = await this.commentRepository.create(new Comment({ postId, authorId, content: input.content }));
    return comment.toJSON();
  }
}

module.exports = CreateComment;
