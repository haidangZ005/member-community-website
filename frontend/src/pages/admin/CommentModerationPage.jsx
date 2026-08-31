import { useState } from 'react';
import { ExternalLink, MessageSquareWarning, Search, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminPagination from '../../components/admin/AdminPagination';
import StatusBadge from '../../components/admin/StatusBadge';
import { useAdminComments, useModerateComment } from '../../features/admin/hooks/useAdmin';

const dateFormatter = new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' });

export default function CommentModerationPage() {
  const [page, setPage] = useState(1);
  const [draft, setDraft] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const comments = useAdminComments({ page, limit: 10, search: search || undefined, status: status || undefined });
  const moderate = useModerateComment();
  const submitSearch = (event) => { event.preventDefault(); setSearch(draft.trim()); setPage(1); };
  return (
    <>
      <header className="admin-page-header"><div><p className="eyebrow"><MessageSquareWarning size={15} /> Hội thoại</p><h1>Kiểm duyệt bình luận</h1><p>Đọc ngữ cảnh và gỡ những phản hồi vi phạm quy tắc cộng đồng.</p></div></header>
      <form className="admin-toolbar" onSubmit={submitSearch}><div className="admin-search"><Search size={17} /><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Tìm nội dung, tác giả hoặc bài viết…" /></div><select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}><option value="">Mọi trạng thái</option><option value="visible">Đang hiển thị</option><option value="removed">Đã gỡ</option></select><button type="submit">Tìm kiếm</button></form>
      <section className="admin-table-card"><div className="table-scroll"><table className="admin-table"><thead><tr><th>Bình luận</th><th>Ngữ cảnh</th><th>Ngày viết</th><th>Trạng thái</th><th aria-label="Thao tác" /></tr></thead><tbody>{comments.data?.data.map((comment) => <tr key={comment.id}><td className="comment-content-cell"><p>{comment.content}</p><small>{comment.author?.fullName || comment.author?.username}</small></td><td className="content-cell"><strong>{comment.post?.title || 'Bài viết'}</strong></td><td>{dateFormatter.format(new Date(comment.createdAt))}</td><td><StatusBadge status={comment.status} /></td><td className="table-action"><div><Link className="icon-action" to={`/posts/${comment.postId}`} title="Xem ngữ cảnh"><ExternalLink size={16} /></Link><button className="danger-soft" disabled={comment.status === 'removed' || moderate.isPending} onClick={() => { if (window.confirm('Gỡ bình luận này khỏi cộng đồng?')) moderate.mutate(comment.id); }}><Trash2 size={15} /> Gỡ</button></div></td></tr>)}</tbody></table></div>{comments.isLoading && <div className="admin-state">Đang tải bình luận…</div>}{!comments.isLoading && comments.data?.data.length === 0 && <div className="admin-state">Không có bình luận phù hợp.</div>}<AdminPagination meta={comments.data?.meta} onPageChange={setPage} /></section>
    </>
  );
}
