import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout';
import FormField from '../../components/ui/FormField';
import SubmitButton from '../../components/ui/SubmitButton';
import { forgotPasswordSchema } from '../../features/auth/schema/authSchema';
import { useForgotPassword } from '../../features/auth/hooks/useAuth';

export default function ForgotPasswordPage() {
  const mutation = useForgotPassword();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(forgotPasswordSchema) });
  return (
    <AuthLayout eyebrow="Khôi phục tài khoản" title="Bạn sẽ sớm quay lại" description="Nhập email đã đăng ký. Chúng tôi sẽ gửi liên kết đặt lại mật khẩu nếu tìm thấy tài khoản.">
      {mutation.isSuccess ? (
        <div className="success-card"><span>✓</span><h3>Hãy kiểm tra hộp thư</h3><p>{mutation.data.message}</p></div>
      ) : (
        <form className="auth-form" onSubmit={handleSubmit((values) => mutation.mutate(values))} noValidate>
          {mutation.error && <div className="alert error">{mutation.error.response?.data?.error?.message || 'Không thể gửi yêu cầu lúc này.'}</div>}
          <FormField label="Email" icon={Mail} error={errors.email?.message}><input type="email" autoComplete="email" placeholder="ban@example.com" {...register('email')} /></FormField>
          <SubmitButton isPending={mutation.isPending}>Gửi liên kết</SubmitButton>
        </form>
      )}
      <p className="switch-copy"><Link className="back-link" to="/login"><ArrowLeft size={16} /> Quay lại đăng nhập</Link></p>
    </AuthLayout>
  );
}

