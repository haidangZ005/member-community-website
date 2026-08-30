import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Email không hợp lệ'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

export const registerSchema = z.object({
  fullName: z.string().trim().min(2, 'Họ tên cần ít nhất 2 ký tự').max(100),
  username: z.string().trim().min(3, 'Tên người dùng cần ít nhất 3 ký tự').max(50).regex(/^[a-zA-Z0-9_]+$/, 'Chỉ dùng chữ, số và dấu gạch dưới'),
  email: z.email('Email không hợp lệ'),
  password: z.string().min(8, 'Mật khẩu cần ít nhất 8 ký tự').regex(/[A-Za-z]/, 'Mật khẩu cần có chữ').regex(/\d/, 'Mật khẩu cần có số'),
  confirmPassword: z.string(),
}).refine((values) => values.password === values.confirmPassword, { path: ['confirmPassword'], message: 'Mật khẩu nhập lại chưa khớp' });

export const forgotPasswordSchema = z.object({ email: z.email('Email không hợp lệ') });

export const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Mật khẩu cần ít nhất 8 ký tự').regex(/[A-Za-z]/, 'Mật khẩu cần có chữ').regex(/\d/, 'Mật khẩu cần có số'),
  confirmPassword: z.string(),
}).refine((values) => values.password === values.confirmPassword, { path: ['confirmPassword'], message: 'Mật khẩu nhập lại chưa khớp' });

export const profileSchema = z.object({
  fullName: z.string().trim().max(100),
  username: z.string().trim().min(3, 'Tên người dùng cần ít nhất 3 ký tự').max(50).regex(/^[a-zA-Z0-9_]+$/, 'Chỉ dùng chữ, số và dấu gạch dưới'),
  avatarUrl: z.union([z.url('URL ảnh không hợp lệ'), z.literal('')]),
});

