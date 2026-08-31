import { createElement } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, BookOpenCheck, FolderKanban, MessageSquareText, ShieldCheck, UsersRound } from 'lucide-react';
import { useDashboardStats } from '../../features/admin/hooks/useAdmin';

export default function DashboardPage() {
  const stats = useDashboardStats();
  if (stats.isLoading) return <div className="admin-state">Đang tổng hợp dữ liệu cộng đồng…</div>;
  if (stats.error) return <div className="admin-state error-state">Không thể tải số liệu quản trị.</div>;
  const data = stats.data;
  const cards = [
    { label: 'Thành viên', value: data.members.total, detail: `${data.members.active} đang hoạt động`, icon: UsersRound, tone: 'green', to: '/admin/members' },
    { label: 'Bài viết', value: data.posts.total, detail: `${data.posts.published} đang hiển thị`, icon: BookOpenCheck, tone: 'orange', to: '/admin/posts' },
    { label: 'Bình luận', value: data.comments.total, detail: `${data.comments.visible} đang hiển thị`, icon: MessageSquareText, tone: 'blue', to: '/admin/comments' },
    { label: 'Chuyên mục', value: data.categories, detail: 'Chủ đề đang sử dụng', icon: FolderKanban, tone: 'gold', to: '/admin/categories' },
  ];
  const moderationTotal = data.posts.removed + data.comments.removed;
  return (
    <>
      <header className="admin-page-header"><div><p className="eyebrow"><ShieldCheck size={15} /> Trung tâm quản trị</p><h1>Tổng quan cộng đồng</h1><p>Theo dõi sức khỏe nội dung và xử lý những việc cần chú ý.</p></div><span className="admin-date">Dữ liệu trực tiếp</span></header>
      <section className="stat-grid">{cards.map((card) => <Link className="stat-card" to={card.to} key={card.label}><span className={`stat-icon ${card.tone}`}>{createElement(card.icon, { size: 21 })}</span><div><small>{card.label}</small><strong>{card.value}</strong><p>{card.detail}</p></div><ArrowUpRight size={17} /></Link>)}</section>
      <section className="admin-overview-grid">
        <article className="overview-card"><div className="overview-card-head"><div><h2>Tình trạng cộng đồng</h2><p>Tỷ lệ nội dung đang được hiển thị.</p></div></div><div className="health-row"><span>Bài viết</span><div><i style={{ width: `${data.posts.total ? (data.posts.published / data.posts.total) * 100 : 0}%` }} /></div><strong>{data.posts.published}/{data.posts.total}</strong></div><div className="health-row"><span>Bình luận</span><div><i style={{ width: `${data.comments.total ? (data.comments.visible / data.comments.total) * 100 : 0}%` }} /></div><strong>{data.comments.visible}/{data.comments.total}</strong></div><div className="health-row"><span>Thành viên</span><div><i style={{ width: `${data.members.total ? (data.members.active / data.members.total) * 100 : 0}%` }} /></div><strong>{data.members.active}/{data.members.total}</strong></div></article>
        <article className="attention-card"><span><ShieldCheck size={24} /></span><p>Đã xử lý</p><strong>{moderationTotal}</strong><small>nội dung được gỡ khỏi cộng đồng</small><Link to="/admin/posts">Mở hàng chờ kiểm duyệt <ArrowUpRight size={15} /></Link></article>
      </section>
    </>
  );
}
