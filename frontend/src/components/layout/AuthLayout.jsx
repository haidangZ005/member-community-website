import { Link } from 'react-router-dom';
import { MessageCircleMore, ShieldCheck, Sparkles, UsersRound } from 'lucide-react';

export default function AuthLayout({ children, eyebrow, title, description }) {
  return (
    <main className="auth-shell">
      <section className="brand-panel">
        <Link className="brand" to="/login" aria-label="Common Ground - Trang đăng nhập">
          <span className="brand-mark"><MessageCircleMore size={24} /></span>
          <span>Common Ground</span>
        </Link>
        <div className="brand-copy">
          <p className="eyebrow light"><Sparkles size={15} /> Cộng đồng dành cho mọi tiếng nói</p>
          <h1>Những cuộc trò chuyện đáng nhớ bắt đầu từ đây.</h1>
          <p>Kết nối với những người cùng mối quan tâm, chia sẻ điều bạn biết và khám phá những góc nhìn mới.</p>
        </div>
        <div className="trust-row">
          <span><UsersRound size={18} /> Kết nối chân thành</span>
          <span><ShieldCheck size={18} /> Không gian an toàn</span>
        </div>
        <div className="orb orb-one" />
        <div className="orb orb-two" />
      </section>
      <section className="form-panel">
        <div className="mobile-brand"><span className="brand-mark"><MessageCircleMore size={21} /></span> Common Ground</div>
        <div className="form-wrap">
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          <p className="form-description">{description}</p>
          {children}
        </div>
        <p className="legal-copy">Bằng việc tiếp tục, bạn đồng ý với Quy tắc cộng đồng và Chính sách bảo mật.</p>
      </section>
    </main>
  );
}

