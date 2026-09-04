import { useState } from 'react';
import { ArrowLeft, ExternalLink, Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import CommunityHeader from '../../components/layout/CommunityHeader';
import CommunitySidebar from '../../components/layout/CommunitySidebar';
import { useManageCategory, useMyCategories } from '../../features/posts/hooks/usePosts';
import { useAuthStore } from '../../store/authStore';
import { forgetCommunity, rememberCommunity } from '../../utils/recentCommunities';

export default function ManageCommunitiesPage() {
  const user = useAuthStore((state) => state.user);
  const categories = useMyCategories();
  const actions = useManageCategory();
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const recentKey = `vrum.recentCommunities.${user?.id || 'guest'}`;

  const edit = (category) => {
    setEditingId(category.id);
    setForm({ name: category.name, description: category.description || '' });
  };

  const submit = (event) => {
    event.preventDefault();
    actions.update.mutate({ id: editingId, name: form.name.trim(), description: form.description.trim() || null }, {
      onSuccess: (category) => {
        rememberCommunity(window.localStorage, recentKey, { id: category.id, name: category.name });
        setEditingId(null);
      },
    });
  };

  const remove = (category) => {
    if (!window.confirm(`Xóa cộng đồng “${category.name}”? Các bài đăng cũ sẽ không còn thuộc cộng đồng này.`)) return;
    actions.remove.mutate(category.id, { onSuccess: () => forgetCommunity(window.localStorage, recentKey, category.id) });
  };

  return (
    <div className="community-page"><CommunityHeader />
      <div className="community-shell">
        <CommunitySidebar />
        <main className="community-main community-manager-main">
          <Link className="back-to-feed" to="/posts"><ArrowLeft size={17} /> Trở lại bảng tin</Link>
          <header className="community-manager-heading"><div><h1>Cộng đồng của bạn</h1><p>Chỉnh sửa những cộng đồng bạn đã tạo hoặc bắt đầu một không gian mới.</p></div><Link className="primary-button" to="/communities/new"><Plus size={18} /> Tạo cộng đồng</Link></header>
          {categories.isLoading && <div className="feed-state">Đang tải cộng đồng của bạn…</div>}
          {categories.error && <div className="feed-state error-state">Không thể tải cộng đồng. Vui lòng thử lại.</div>}
          {!categories.isLoading && categories.data?.length === 0 && <div className="feed-state empty-state"><h3>Bạn chưa tạo cộng đồng nào</h3><p>Khi tạo cộng đồng đầu tiên, bạn có thể quản lý nó tại đây.</p><Link to="/communities/new">Bắt đầu một cộng đồng</Link></div>}
          {categories.data?.length > 0 && <section className="managed-community-list" aria-label="Cộng đồng do bạn quản lý">
            {categories.data.map((category) => editingId === category.id ? <form className="managed-community-edit" key={category.id} onSubmit={submit}>
              <label><span>Tên cộng đồng</span><input autoFocus required minLength="2" maxLength="100" value={form.name} onChange={(event) => setForm((value) => ({ ...value, name: event.target.value }))} /></label>
              <label><span>Mô tả</span><textarea rows="3" maxLength="500" value={form.description} onChange={(event) => setForm((value) => ({ ...value, description: event.target.value }))} /></label>
              {actions.update.error && <div className="alert error">{actions.update.error.response?.data?.error?.message || 'Không thể lưu cộng đồng.'}</div>}
              <div className="managed-community-actions"><button className="text-button" type="button" onClick={() => setEditingId(null)}><X size={16} /> Hủy</button><button className="primary-button" type="submit" disabled={actions.update.isPending || form.name.trim().length < 2}><Save size={16} /> {actions.update.isPending ? 'Đang lưu…' : 'Lưu thay đổi'}</button></div>
            </form> : <article className="managed-community-row" key={category.id}>
              <span className="community-mark large" aria-hidden="true">{category.name.charAt(0).toUpperCase()}</span>
              <div><h2>{category.name}</h2><p>{category.description || 'Chưa có mô tả.'}</p></div>
              <div className="managed-community-actions"><Link className="text-button" to={`/posts?categoryId=${encodeURIComponent(category.id)}`}><ExternalLink size={16} /> Mở</Link><button className="text-button" type="button" onClick={() => edit(category)}><Pencil size={16} /> Sửa</button><button className="text-button danger-text" type="button" disabled={actions.remove.isPending} onClick={() => remove(category)}><Trash2 size={16} /> Xóa</button></div>
            </article>)}
          </section>}
        </main>
      </div>
    </div>
  );
}
