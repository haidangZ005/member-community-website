import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { AtSign, LockKeyhole, Mail, UserRound } from 'lucide-react';
import FormField from '../../../components/ui/FormField';
import SubmitButton from '../../../components/ui/SubmitButton';
import { registerSchema } from '../schema/authSchema';
import { useRegister } from '../hooks/useAuth';

export default function RegisterForm() {
  const mutation = useRegister();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(registerSchema) });
  const apiError = mutation.error?.response?.data?.error?.message;
  return (
    <form className="auth-form compact" onSubmit={handleSubmit(({ confirmPassword: _, ...values }) => mutation.mutate(values))} noValidate>
      {apiError && <div className="alert error" role="alert">{apiError}</div>}
      <div className="field-grid">
        <FormField label="Họ và tên" icon={UserRound} error={errors.fullName?.message}><input placeholder="Nhập họ và tên" autoComplete="name" {...register('fullName')} /></FormField>
        <FormField label="Tên người dùng" icon={AtSign} error={errors.username?.message}><input placeholder="Nhập tên người dùng" autoComplete="username" {...register('username')} /></FormField>
      </div>
      <FormField label="Email" icon={Mail} error={errors.email?.message}><input type="email" placeholder="Nhập địa chỉ email" autoComplete="email" {...register('email')} /></FormField>
      <div className="field-grid">
        <FormField label="Mật khẩu" icon={LockKeyhole} error={errors.password?.message}><input type="password" placeholder="Tối thiểu 8 ký tự" autoComplete="new-password" {...register('password')} /></FormField>
        <FormField label="Nhập lại mật khẩu" icon={LockKeyhole} error={errors.confirmPassword?.message}><input type="password" placeholder="Nhập lại mật khẩu" autoComplete="new-password" {...register('confirmPassword')} /></FormField>
      </div>
      <SubmitButton isPending={mutation.isPending}>Tạo tài khoản</SubmitButton>
    </form>
  );
}
