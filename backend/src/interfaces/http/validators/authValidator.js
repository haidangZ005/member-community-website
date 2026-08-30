const { z } = require('zod');

const username = z.string().trim().min(3, 'Tên người dùng cần ít nhất 3 ký tự').max(50).regex(/^[a-zA-Z0-9_]+$/, 'Tên người dùng chỉ gồm chữ, số và dấu gạch dưới');
const password = z.string().min(8, 'Mật khẩu cần ít nhất 8 ký tự').regex(/[A-Za-z]/, 'Mật khẩu cần có chữ').regex(/\d/, 'Mật khẩu cần có số');

module.exports = {
  registerSchema: z.object({
    username,
    email: z.email('Email không hợp lệ').transform((value) => value.toLowerCase()),
    password,
    fullName: z.string().trim().max(100).optional(),
  }),
  loginSchema: z.object({
    email: z.email('Email không hợp lệ').transform((value) => value.toLowerCase()),
    password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
  }),
  forgotPasswordSchema: z.object({
    email: z.email('Email không hợp lệ').transform((value) => value.toLowerCase()),
  }),
  resetPasswordSchema: z.object({
    token: z.string().min(1, 'Thiếu mã đặt lại mật khẩu'),
    password,
  }),
  updateProfileSchema: z.object({
    username: username.optional(),
    fullName: z.string().trim().max(100).nullable().optional(),
    avatarUrl: z.union([z.url('URL ảnh đại diện không hợp lệ'), z.literal(''), z.null()]).optional(),
  }).refine((data) => Object.keys(data).length > 0, 'Cần ít nhất một thông tin để cập nhật'),
};

