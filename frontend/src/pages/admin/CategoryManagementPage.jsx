import { useEffect, useState } from 'react';
import { FolderKanban, Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import { useAdminCategories, useCategoryActions } from '../../features/admin/hooks/useAdmin';

export default function CategoryManagementPage() {
  const categories = useAdminCategories();
  const actions = useCategoryActions();
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const activeMutation = editingId ? actions.update : actions.create;
  useEffect(() => { if (!editingId) setForm({ name: '', description: '' }); }, [editingId]);
  const submit = (event) => {
    event.preventDefault();
    const input = { name: form.name.trim(), description: form.description.trim() || null };
    if (input.name.length < 2) return;
    activeMutation.mutate(editingId ? { id: editingId, ...input } : input, { onSuccess: () => { setEditingId(null); setForm({ name: '', description: '' }); } });
  };
  const edit = (category) => { setEditingId(category.id); setForm({ name: category.name, description: category.description || '' }); };
  return (
    <>
      <header className="admin-page-header"><div><p className="eyebrow"><FolderKanban size={15} /> Phân loại</p><h1>Quản lý chuyên mục</h1><p>Tổ chức chủ đề để thành viên dễ tìm đúng cuộc trò chuyện.</p></div></header>
      <div className="category-admin-grid">
        <form className="category-form-card" onSubmit={submit}><div className="category-form-title"><span>{editingId ? <Pencil size={19} /> : <Plus size={19} />}</span><div><h2>{editingId ? 'Chỉnh sửa chuyên mục' : 'Chuyên mục mới'}</h2><p>{editingId ? 'Cập nhật tên và mô tả.' : 'Tạo một chủ đề cho cộng đồng.'}</p></div></div>{activeMutation.error && <div className="alert error">{activeMutation.error.response?.data?.error?.message || 'Không thể lưu chuyên mục.'}</div>}<label><span>Tên chuyên mục</span><input value={form.name} onChange={(event) => setForm((value) => ({ ...value, name: event.target.value }))} maxLength="100" placeholder="Ví dụ: Sự kiện" /></label><label><span>Mô tả</span><textarea value={form.description} onChange={(event) => setForm((value) => ({ ...value, description: event.target.value }))} maxLength="500" rows="5" placeholder="Chuyên mục này dành cho nội dung gì?" /></label><div className="category-form-actions">{editingId && <button className="text-button" type="button" onClick={() => setEditingId(null)}><X size={16} /> Hủy</button>}<button className="primary-button" type="submit" disabled={activeMutation.isPending || form.name.trim().length < 2}><Save size={17} /> {activeMutation.isPending ? 'Đang lưu…' : 'Lưu chuyên mục'}</button></div></form>
        <section className="category-list-card"><div className="category-list-head"><div><h2>Chuyên mục hiện có</h2><p>{categories.data?.length || 0} chủ đề</p></div></div><div className="category-admin-list">{categories.data?.map((category) => <article key={category.id}><span className="category-symbol">{category.name.slice(0, 1).toUpperCase()}</span><div><strong>{category.name}</strong><p>{category.description || 'Chưa có mô tả.'}</p></div><div><button onClick={() => edit(category)} title="Sửa chuyên mục"><Pencil size={16} /></button><button className="delete-icon" disabled={actions.remove.isPending} onClick={() => { if (window.confirm(`Xóa chuyên mục “${category.name}”? Bài viết sẽ chuyển về chủ đề chung.`)) actions.remove.mutate(category.id); }} title="Xóa chuyên mục"><Trash2 size={16} /></button></div></article>)}</div>{categories.isLoading && <div className="admin-state">Đang tải chuyên mục…</div>}{!categories.isLoading && categories.data?.length === 0 && <div className="admin-state">Chưa có chuyên mục.</div>}</section>
      </div>
    </>
  );
}
