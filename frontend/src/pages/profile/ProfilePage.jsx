import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AtSign, Camera, LogOut, Mail, MessageCircleMore, ShieldCheck, UserRound } from 'lucide-react';
import FormField from '../../components/ui/FormField';
import SubmitButton from '../../components/ui/SubmitButton';
import { useLogout, useProfile, useUpdateProfile } from '../../features/auth/hooks/useAuth';
import { profileSchema } from '../../features/auth/schema/authSchema';

export default function ProfilePage() {
  const profile = useProfile();
  const update = useUpdateProfile();
  const logout = useLogout();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(profileSchema), defaultValues: { fullName: '', username: '', avatarUrl: '' } });

  useEffect(() => {
    if (profile.data) reset({ fullName: profile.data.fullName || '', username: profile.data.username, avatarUrl: profile.data.avatarUrl || '' });
  }, [profile.data, reset]);

  if (profile.isLoading) return <div className="page-loader">Đang tải hồ sơ...</div>;
  return (
    <main className="profile-page">
      <header className="site-header">
        <div className="brand dark"><span className="brand-mark"><MessageCircleMore size={22} /></span><span>Common Ground</span></div>
        <button className="ghost-button" onClick={() => logout.mutate()} disabled={logout.isPending}><LogOut size={17} /> Đăng xuất</button>
      </header>
      <section className="profile-hero">
        <div><p className="eyebrow"><ShieldCheck size={15} /> Tài khoản thành viên</p><h1>Hồ sơ của bạn</h1><p>Cập nhật cách bạn xuất hiện trong những cuộc trò chuyện của cộng đồng.</p></div>
        <div className="avatar-card">{profile.data?.avatarUrl ? <img src={profile.data.avatarUrl} alt="Ảnh đại diện" /> : <span>{(profile.data?.fullName || profile.data?.username || 'M').slice(0, 1).toUpperCase()}</span>}<small><Camera size={14} /> Ảnh đại diện</small></div>
      </section>
      <section className="profile-card">
        <div className="profile-card-head"><div><h2>Thông tin cá nhân</h2><p>Email và vai trò được quản lý an toàn bởi hệ thống.</p></div><span className="status-pill">● Đang hoạt động</span></div>
        <form className="profile-form" onSubmit={handleSubmit((values) => update.mutate(values))} noValidate>
          {update.isSuccess && <div className="alert success">Đã lưu thay đổi hồ sơ.</div>}
          {update.error && <div className="alert error">{update.error.response?.data?.error?.message || 'Không thể cập nhật hồ sơ.'}</div>}
          <div className="field-grid">
            <FormField label="Họ và tên" icon={UserRound} error={errors.fullName?.message}><input {...register('fullName')} /></FormField>
            <FormField label="Tên người dùng" icon={AtSign} error={errors.username?.message}><input {...register('username')} /></FormField>
          </div>
          <FormField label="Email" icon={Mail}><input value={profile.data?.email || ''} disabled /></FormField>
          <FormField label="URL ảnh đại diện" icon={Camera} error={errors.avatarUrl?.message}><input placeholder="https://..." {...register('avatarUrl')} /></FormField>
          <div className="profile-actions"><SubmitButton isPending={update.isPending}>Lưu thay đổi</SubmitButton></div>
        </form>
      </section>
    </main>
  );
}

