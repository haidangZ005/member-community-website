import { useState } from 'react';
import { ArrowLeft, ArrowRight, PenLine, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import CommunityHeader from '../../components/layout/CommunityHeader';
import PostCard from '../../features/posts/components/PostCard';
import { useCategories, usePosts } from '../../features/posts/hooks/usePosts';

export default function PostListPage() {
  const [page, setPage] = useState(1);
  const [categoryId, setCategoryId] = useState('');
  const posts = usePosts({ page, limit: 8, categoryId: categoryId || undefined });
  const categories = useCategories();
  const selectCategory = (value) => { setCategoryId(value); setPage(1); };

  return (
    <div className="community-page"><CommunityHeader />
      <main className="community-main">
        <section className="feed-hero"><div><p className="eyebrow"><Sparkles size={15} /> Không gian thành viên</p><h1>Ý tưởng lớn bắt đầu từ một cuộc trò chuyện.</h1><p>Cùng đặt câu hỏi, chia sẻ trải nghiệm và tìm những người đồng hành trong cộng đồng.</p></div><Link className="primary-button create-button" to="/posts/new"><PenLine size={18} /> Viết bài mới</Link></section>
        <div className="feed-layout">
          <aside className="category-panel"><span>Khám phá theo chủ đề</span><button className={!categoryId ? 'active' : ''} onClick={() => selectCategory('')}>Tất cả bài viết</button>{categories.data?.map((category) => <button key={category.id} className={categoryId === category.id ? 'active' : ''} onClick={() => selectCategory(category.id)}>{category.name}</button>)}</aside>
          <section className="feed-column" aria-live="polite">
            <div className="feed-heading"><div><h2>Mới trong cộng đồng</h2><p>{posts.data?.meta.total || 0} cuộc thảo luận đang chờ bạn</p></div><span className="live-pill">● Mới nhất</span></div>
            {posts.isLoading && <div className="feed-state">Đang tải những cuộc trò chuyện mới…</div>}
            {posts.error && <div className="feed-state error-state">Không thể tải bài viết. Vui lòng thử lại.</div>}
            {posts.data?.data.map((post) => <PostCard key={post.id} post={post} />)}
            {!posts.isLoading && posts.data?.data.length === 0 && <div className="feed-state empty-state"><Sparkles size={28} /><h3>Hãy mở đầu cuộc trò chuyện</h3><p>Chưa có bài viết trong chủ đề này.</p><Link to="/posts/new">Tạo bài viết đầu tiên</Link></div>}
            {posts.data && posts.data.meta.totalPages > 1 && <div className="pagination"><button disabled={page === 1} onClick={() => setPage((value) => value - 1)}><ArrowLeft size={16} /> Trước</button><span>Trang {page} / {posts.data.meta.totalPages}</span><button disabled={page === posts.data.meta.totalPages} onClick={() => setPage((value) => value + 1)}>Sau <ArrowRight size={16} /></button></div>}
          </section>
        </div>
      </main>
    </div>
  );
}
