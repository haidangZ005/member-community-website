const Post = require('../../../domain/entities/Post');
const NotFoundError = require('../../../domain/errors/NotFoundError');
const ValidationError = require('../../../domain/errors/ValidationError');

class CreatePost {
  constructor({ postRepository, categoryRepository }) {
    this.postRepository = postRepository;
    this.categoryRepository = categoryRepository;
  }

  async execute(authorId, input) {
    if (!input.categoryId) throw new ValidationError('Hãy chọn chủ đề trước khi tạo bài đăng');
    if (!(await this.categoryRepository.findById(input.categoryId))) {
      throw new NotFoundError('Không tìm thấy chủ đề');
    }
    const created = await this.postRepository.create(new Post({ ...input, authorId }));
    return created.toJSON();
  }
}

module.exports = CreatePost;
