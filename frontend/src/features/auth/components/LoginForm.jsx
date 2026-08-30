import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { LockKeyhole, Mail } from 'lucide-react';
import FormField from '../../../components/ui/FormField';
import SubmitButton from '../../../components/ui/SubmitButton';
import { loginSchema } from '../schema/authSchema';
import { useLogin } from '../hooks/useAuth';

export default function LoginForm() {
  const login = useLogin();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(loginSchema) });
  const apiError = login.error?.response?.data?.error?.message;
  return (
    <form className="auth-form" onSubmit={handleSubmit((values) => login.mutate(values))} noValidate>
      {apiError && <div className="alert error" role="alert">{apiError}</div>}
      <FormField label="Email" icon={Mail} error={errors.email?.message}><input type="email" autoComplete="email" placeholder="ban@example.com" {...register('email')} /></FormField>
      <FormField label="Mật khẩu" icon={LockKeyhole} error={errors.password?.message}><input type="password" autoComplete="current-password" placeholder="Nhập mật khẩu" {...register('password')} /></FormField>
      <SubmitButton isPending={login.isPending}>Đăng nhập</SubmitButton>
    </form>
  );
}

