import { Link, NavLink } from 'react-router-dom';
import { LogOut, MessageCircleMore, PenLine, ShieldCheck, UserRound } from 'lucide-react';
import { useLogout } from '../../features/auth/hooks/useAuth';
import { useAuthStore } from '../../store/authStore';
import ThemeSwitcher from '../ui/ThemeSwitcher';

export default function CommunityHeader() {
  const logout = useLogout();
  const user = useAuthStore((state) => state.user);
  const displayName = user?.fullName || user?.username || 'Thành viên';
  return (
    <header className="community-header">
      <div className="community-header-inner">
        <Link className="brand dark" to="/posts"><span className="brand-mark"><MessageCircleMore size={22} /></span><span>Common Ground</span></Link>
        <nav className="community-nav" aria-label="Điều hướng chính">
          <NavLink to="/posts">Cộng đồng</NavLink>
          <NavLink to="/posts/new"><PenLine size={16} /> Viết bài</NavLink>
          {user?.role === 'admin' && <NavLink to="/admin"><ShieldCheck size={16} /> Quản trị</NavLink>}
        </nav>
        <div className="account-menu">
          <ThemeSwitcher />
          <Link className="account-link" to="/profile"><UserRound size={17} /><span>{displayName}</span></Link>
          <button className="icon-button" type="button" title="Đăng xuất" aria-label="Đăng xuất" onClick={() => logout.mutate()} disabled={logout.isPending}><LogOut size={18} /></button>
        </div>
      </div>
    </header>
  );
}
