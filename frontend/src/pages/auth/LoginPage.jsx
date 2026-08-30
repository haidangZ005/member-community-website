import { Link, useLocation } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import LoginForm from '../../features/auth/components/LoginForm';

export default function LoginPage() {
  const location = useLocation();
  return (
    <AuthLayout eyebrow="Chào mừng trở lại" title="Tiếp tục câu chuyện của bạn" description="Đăng nhập để xem những điều mới trong cộng đồng hôm nay.">
      {location.state?.notice && <div className="alert success" role="status">{location.state.notice}</div>}
      <LoginForm />
      <div className="single-link"><Link to="/forgot-password">Quên mật khẩu?</Link></div>
      <p className="switch-copy">Chưa là thành viên? <Link to="/register">Tạo tài khoản</Link></p>
    </AuthLayout>
  );
}

