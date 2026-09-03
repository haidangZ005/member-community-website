import { createElement } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { BookOpenCheck, FolderKanban, Gauge, MessageSquareWarning, ShieldCheck, UsersRound } from 'lucide-react';
import CommunityHeader from '../layout/CommunityHeader';

const links = [
  { to: '/admin', label: 'Tổng quan', icon: Gauge, end: true },
  { to: '/admin/members', label: 'Thành viên', icon: UsersRound },
  { to: '/admin/posts', label: 'Bài viết', icon: BookOpenCheck },
  { to: '/admin/comments', label: 'Bình luận', icon: MessageSquareWarning },
  { to: '/admin/categories', label: 'Chuyên mục', icon: FolderKanban },
];

export default function AdminLayout() {
  return (
    <div className="admin-shell">
      <CommunityHeader />
      <div className="admin-workspace">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-title"><span><ShieldCheck size={18} /></span><div><strong>Quản trị</strong><small>VRUM</small></div></div>
          <nav aria-label="Điều hướng quản trị">{links.map((link) => <NavLink key={link.to} to={link.to} end={link.end}>{createElement(link.icon, { size: 18 })} {link.label}</NavLink>)}</nav>
          <p>Giữ cộng đồng an toàn, rõ ràng và đáng tin cậy.</p>
        </aside>
        <main className="admin-content"><Outlet /></main>
      </div>
    </div>
  );
}
