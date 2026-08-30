import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useSearchParams } from 'react-router-dom';
import { LockKeyhole } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout';
import FormField from '../../components/ui/FormField';
import SubmitButton from '../../components/ui/SubmitButton';
import { resetPasswordSchema } from '../../features/auth/schema/authSchema';
import { useResetPassword } from '../../features/auth/hooks/useAuth';

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const mutation = useResetPassword();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(resetPasswordSchema) });
  return (
    <AuthLayout eyebrow="Mật khẩu mới" title="Bắt đầu lại thật an toàn" description="Chọn một mật khẩu có ít nhất 8 ký tự, bao gồm chữ và số.">
      {!token ? <div className="alert error">Liên kết đặt lại mật khẩu không hợp lệ. <Link to="/forgot-password">Yêu cầu liên kết mới</Link>.</div> : (
        <form className="auth-form" onSubmit={handleSubmit(({ confirmPassword: _, password }) => mutation.mutate({ token, password }))} noValidate>
          {mutation.error && <div className="alert error">{mutation.error.response?.data?.error?.message || 'Không thể cập nhật mật khẩu.'}</div>}
          <FormField label="Mật khẩu mới" icon={LockKeyhole} error={errors.password?.message}><input type="password" autoComplete="new-password" {...register('password')} /></FormField>
          <FormField label="Nhập lại mật khẩu" icon={LockKeyhole} error={errors.confirmPassword?.message}><input type="password" autoComplete="new-password" {...register('confirmPassword')} /></FormField>
          <SubmitButton isPending={mutation.isPending}>Cập nhật mật khẩu</SubmitButton>
        </form>
      )}
    </AuthLayout>
  );
}

