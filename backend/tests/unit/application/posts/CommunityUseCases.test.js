const makeUseCases = require('../../../../src/main/factories/makeUseCases');
const { makeFakeDependencies } = require('../../../helpers/fakes');

async function createMember(dependencies, username, email) {
  return dependencies.userRepository.create({
    username,
    email,
    passwordHash: 'hashed:Matkhau123',
    fullName: username,
  });
}

describe('Sprint 2 community use cases', () => {
  let dependencies;
  let useCases;
  let author;

  beforeEach(async () => {
    dependencies = makeFakeDependencies();
    useCases = makeUseCases(dependencies);
    author = await createMember(dependencies, 'tacgia', 'tacgia@example.com');
  });

  test('tạo, liệt kê, xem và sửa bài viết', async () => {
    const category = (await dependencies.categoryRepository.list())[0];
    const created = await useCases.createPost.execute(author.id, {
      title: 'Cách xây dựng một cộng đồng bền vững',
      content: 'Mình muốn cùng mọi người thảo luận về những nguyên tắc quan trọng.',
      categoryId: category.id,
    });
    expect(created.authorId).toBe(author.id);

    const list = await useCases.listPosts.execute({ page: 1, limit: 10, categoryId: category.id, viewerId: author.id });
    expect(list.data).toHaveLength(1);
    expect(list.meta.total).toBe(1);

    const detail = await useCases.getPostDetail.execute(created.id, author.id);
    expect(detail.title).toContain('cộng đồng');

    const updated = await useCases.editPost.execute(created.id, author.id, { title: 'Xây dựng cộng đồng cùng nhau' });
    expect(updated.title).toBe('Xây dựng cộng đồng cùng nhau');
  });

  test('thích/bỏ thích không tạo bản ghi trùng và tạo bình luận', async () => {
    const post = await useCases.createPost.execute(author.id, {
      title: 'Một câu hỏi dành cho mọi người',
      content: 'Theo bạn điều gì khiến một cuộc thảo luận trở nên có giá trị?',
    });
    expect(await useCases.likePost.execute(post.id, author.id)).toEqual({ liked: true, likeCount: 1 });
    expect(await useCases.likePost.execute(post.id, author.id)).toEqual({ liked: true, likeCount: 1 });

    const comment = await useCases.createComment.execute(post.id, author.id, { content: 'Sự chân thành và lắng nghe.' });
    expect(comment.content).toContain('chân thành');
    expect(await useCases.listCommentsByPost.execute(post.id, author.id)).toHaveLength(1);
    expect(await useCases.unlikePost.execute(post.id, author.id)).toEqual({ liked: false, likeCount: 0 });
  });

  test('chỉ tác giả được sửa hoặc xóa bài viết', async () => {
    const other = await createMember(dependencies, 'thanhvien', 'member@example.com');
    const post = await useCases.createPost.execute(author.id, {
      title: 'Bài viết thuộc về tác giả',
      content: 'Nội dung đủ dài để kiểm tra quyền sở hữu của bài viết.',
    });
    await expect(useCases.editPost.execute(post.id, other.id, { title: 'Không được phép sửa bài này' })).rejects.toMatchObject({ code: 'FORBIDDEN' });
    await expect(useCases.deletePost.execute(post.id, other.id)).rejects.toMatchObject({ code: 'FORBIDDEN' });
    await expect(useCases.deletePost.execute(post.id, author.id)).resolves.toEqual({ message: 'Đã xóa bài viết' });
    await expect(useCases.getPostDetail.execute(post.id, author.id)).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  test('từ chối chuyên mục không tồn tại và dữ liệu bài viết không hợp lệ', async () => {
    await expect(useCases.createPost.execute(author.id, {
      title: 'Tiêu đề hợp lệ', content: 'Nội dung hợp lệ để kiểm thử.', categoryId: 'missing-category',
    })).rejects.toMatchObject({ code: 'NOT_FOUND' });
    await expect(useCases.createPost.execute(author.id, { title: 'Ngắn', content: 'Quá ngắn' })).rejects.toMatchObject({ code: 'VALIDATION_ERROR' });
  });
});
