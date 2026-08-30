const { z } = require('zod');

const optionalCategory = z.union([z.uuid('Chuyên mục không hợp lệ'), z.null()]).optional();

const createPostSchema = z.object({
  title: z.string().trim().min(5, 'Tiêu đề phải có ít nhất 5 ký tự').max(255, 'Tiêu đề tối đa 255 ký tự'),
  content: z.string().trim().min(10, 'Nội dung phải có ít nhất 10 ký tự'),
  categoryId: optionalCategory,
}).strict();

const updatePostSchema = z.object({
  title: z.string().trim().min(5, 'Tiêu đề phải có ít nhất 5 ký tự').max(255, 'Tiêu đề tối đa 255 ký tự').optional(),
  content: z.string().trim().min(10, 'Nội dung phải có ít nhất 10 ký tự').optional(),
  categoryId: optionalCategory,
}).strict().refine((value) => Object.keys(value).length > 0, 'Cần cung cấp ít nhất một thay đổi');

const createCommentSchema = z.object({
  content: z.string().trim().min(2, 'Bình luận phải có ít nhất 2 ký tự').max(2000, 'Bình luận tối đa 2000 ký tự'),
}).strict();

const postIdSchema = z.object({ id: z.uuid('Mã bài viết không hợp lệ') });
const listPostsSchema = z.object({
  page: z.coerce.number().int().positive('Trang phải lớn hơn 0').optional(),
  limit: z.coerce.number().int().positive('Số bài mỗi trang phải lớn hơn 0').max(50, 'Tối đa 50 bài mỗi trang').optional(),
  categoryId: z.uuid('Chuyên mục không hợp lệ').optional(),
});

module.exports = { createPostSchema, updatePostSchema, createCommentSchema, postIdSchema, listPostsSchema };
