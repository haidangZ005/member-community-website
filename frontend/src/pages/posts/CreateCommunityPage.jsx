import { useState } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import CommunityHeader from '../../components/layout/CommunityHeader';
import { useCreateCategory } from '../../features/posts/hooks/usePosts';

export default function CreateCommunityPage() {
  const create = useCreateCategory();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const submit = (event) => {
    event.preventDefault();
    create.mutate({ name: name.trim(), description: description.trim() || null });
  };

  return (
    <div className="community-page"><CommunityHeader />
      <main className="editor-main">
        <section className="editor-heading"><h1>Bắt đầu một cộng đồng.</h1><p>Chọn một tên dễ nhớ và mô tả ngắn gọn để mọi người biết nơi này dành cho điều gì.</p></section>
        {create.error && <div className="alert error editor-alert">{create.error.response?.data?.error?.message || 'Không thể tạo cộng đồng.'}</div>}
        <form className="editor-card" onSubmit={submit}>
          <label className="editor-field"><span>Tên cộng đồng</span><input autoFocus required minLength="2" maxLength="100" value={name} onChange={(event) => setName(event.target.value)} placeholder="Ví dụ: Công nghệ Việt" /></label>
          <label className="editor-field"><span>Mô tả</span><textarea rows="6" maxLength="500" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Cộng đồng này dành cho những cuộc trò chuyện nào?" /></label>
          <div className="editor-actions"><Link className="text-button" to="/posts"><ArrowLeft size={17} /> Quay lại</Link><button className="primary-button editor-submit" type="submit" disabled={create.isPending || name.trim().length < 2}><Plus size={18} /> {create.isPending ? 'Đang tạo…' : 'Tạo cộng đồng'}</button></div>
        </form>
      </main>
    </div>
  );
}
