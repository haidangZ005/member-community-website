const Post = require('../../../domain/entities/Post');
const NotFoundError = require('../../../domain/errors/NotFoundError');

class CreatePost {
  constructor({ postRepository, categoryRepository }) {
    this.postRepository = postRepository;
    this.categoryRepository = categoryRepository;
  }

  async execute(authorId, input) {
    if (input.categoryId && !(await this.categoryRepository.findById(input.categoryId))) {
      throw new NotFoundError('Không tìm thấy chuyên mục');
    }
    const created = await this.postRepository.create(new Post({ ...input, authorId }));
    return created.toJSON();
  }
}

module.exports = CreatePost;
