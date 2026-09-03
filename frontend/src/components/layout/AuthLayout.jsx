import { Link } from 'react-router-dom';
import { ShieldCheck, UsersRound } from 'lucide-react';
import ThemeSwitcher from '../ui/ThemeSwitcher';
import BrandLogo from '../ui/BrandLogo';

export default function AuthLayout({ children, eyebrow, title, description }) {
  return (
    <main className="auth-shell">
      <section className="brand-panel">
        <Link className="brand" to="/login" aria-label="VRUM - Trang đăng nhập"><BrandLogo /></Link>
        <div className="brand-copy">
          <h1>
            <span className="brand-copy-lead">Làn gió mới</span>
            <span className="brand-copy-tail">của diễn đàn Việt</span>
          </h1>
        </div>
        <div className="trust-row">
          <span><UsersRound size={18} /> Kết nối chân thành</span>
          <span><ShieldCheck size={18} /> Không gian an toàn</span>
        </div>
        <div className="orb orb-one" />
        <div className="orb orb-two" />
      </section>
      <section className="form-panel">
        <ThemeSwitcher className="auth-theme-switcher" />
        <Link className="mobile-brand" to="/login" aria-label="VRUM - Trang đăng nhập"><BrandLogo /></Link>
        <div className="form-wrap">
          <p className="eyebrow">{eyebrow}</p>
          {title && <h2>{title}</h2>}
          <p className="form-description">{description}</p>
          {children}
        </div>
        <p className="legal-copy">Bằng việc tiếp tục, bạn đồng ý với Quy tắc cộng đồng và Chính sách bảo mật.</p>
      </section>
    </main>
  );
}
