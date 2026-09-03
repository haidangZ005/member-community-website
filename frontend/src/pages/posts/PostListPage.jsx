import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Home, PenLine, Plus, Sparkles, TrendingUp } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import CommunityHeader from '../../components/layout/CommunityHeader';
import PostCard from '../../features/posts/components/PostCard';
import { useCategories, usePosts } from '../../features/posts/hooks/usePosts';

export default function PostListPage() {
  const [page, setPage] = useState(1);
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('categoryId') || '';
  const sort = searchParams.get('sort') === 'popular' ? 'popular' : 'latest';
  const posts = usePosts({ page, limit: 8, categoryId: categoryId || undefined, sort });
  const category = useCategories({ id: categoryId }, Boolean(categoryId));
  const selectedCategory = category.data?.[0];
  const createPostUrl = selectedCategory ? `/posts/new?categoryId=${encodeURIComponent(selectedCategory.id)}` : null;

  useEffect(() => {
    setPage(1);
  }, [categoryId, sort]);

  return (
    <div className="community-page"><CommunityHeader />
      <div className="community-shell">
        <aside className="community-sidebar">
          <nav aria-label="Điều hướng diễn đàn">
            <Link className={!categoryId && sort === 'latest' ? 'active' : ''} to="/posts"><Home size={19} /> Trang chủ</Link>
            <Link className={!categoryId && sort === 'popular' ? 'active' : ''} to="/posts?sort=popular"><TrendingUp size={19} /> Phổ biến</Link>
            <Link to="/communities/new"><Plus size={20} /> Bắt đầu một cộng đồng</Link>
          </nav>
        </aside>
        <main className="community-main">
        {selectedCategory && <section className="topic-hero"><div><h1>{selectedCategory.name}</h1><p>{selectedCategory.description}</p></div>{createPostUrl && <Link className="primary-button create-button" to={createPostUrl}><PenLine size={18} /> Tạo bài đăng</Link>}</section>}
        <section className="feed-column" aria-live="polite">
          <div className="feed-heading"><div><h2>{selectedCategory ? `Bài đăng trong ${selectedCategory.name}` : sort === 'popular' ? 'Phổ biến trên VRUM' : 'Bài đăng mới nhất'}</h2><p>{posts.data?.meta.total || 0} bài đăng</p></div><span className="live-pill">● {sort === 'popular' ? 'Nổi bật' : 'Mới nhất'}</span></div>
          {posts.isLoading && <div className="feed-state">Đang tải những cuộc trò chuyện mới…</div>}
          {posts.error && <div className="feed-state error-state">Không thể tải bài viết. Vui lòng thử lại.</div>}
          {posts.data?.data.map((post) => <PostCard key={post.id} post={post} />)}
          {!posts.isLoading && posts.data?.data.length === 0 && <div className="feed-state empty-state"><Sparkles size={28} /><h3>Chưa có bài đăng</h3><p>{selectedCategory ? 'Hãy là người đầu tiên chia sẻ trong chủ đề này.' : 'Bài đăng mới sẽ xuất hiện tại đây.'}</p>{createPostUrl && <Link to={createPostUrl}>Tạo bài đăng đầu tiên</Link>}</div>}
          {posts.data && posts.data.meta.totalPages > 1 && <div className="pagination"><button disabled={page === 1} onClick={() => setPage((value) => value - 1)}><ArrowLeft size={16} /> Trước</button><span>Trang {page} / {posts.data.meta.totalPages}</span><button disabled={page === posts.data.meta.totalPages} onClick={() => setPage((value) => value + 1)}>Sau <ArrowRight size={16} /></button></div>}
        </section>
        </main>
      </div>
    </div>
  );
}
