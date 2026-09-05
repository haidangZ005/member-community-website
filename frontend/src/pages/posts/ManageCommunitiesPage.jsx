import { useState } from 'react';
import { ArrowLeft, Search, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import CommunityHeader from '../../components/layout/CommunityHeader';
import CommunitySidebar from '../../components/layout/CommunitySidebar';
import CommunityAvatar from '../../components/ui/CommunityAvatar';
import { useCategories, useCommunityActions } from '../../features/posts/hooks/usePosts';

export default function ManageCommunitiesPage() {
  const [search, setSearch] = useState('');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const categories = useCategories({ joined: 'true', favorites: favoritesOnly ? 'true' : undefined, search: search.trim() || undefined });
  const actions = useCommunityActions();

  return (
    <div className="community-page"><CommunityHeader />
      <div className="community-shell">
        <CommunitySidebar />
        <main className="community-main community-manager-main">
          <Link className="back-to-feed" to="/posts"><ArrowLeft size={17} /> Trở lại bảng tin</Link>
          <header className="community-manager-heading"><div><h1>Quản lý cộng đồng</h1><p>Xem các cộng đồng bạn đã tham gia và đánh dấu những nơi bạn yêu thích.</p></div></header>
          <div className="community-manager-toolbar">
            <label className="manager-search"><Search size={18} /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Lọc cộng đồng của bạn" aria-label="Lọc cộng đồng của bạn" /></label>
            <div className="community-filter-tabs" aria-label="Bộ lọc cộng đồng"><button className={!favoritesOnly ? 'active' : ''} type="button" aria-pressed={!favoritesOnly} onClick={() => setFavoritesOnly(false)}>Tất cả cộng đồng</button><button className={favoritesOnly ? 'active' : ''} type="button" aria-pressed={favoritesOnly} onClick={() => setFavoritesOnly(true)}>Mục yêu thích</button></div>
          </div>
          {(actions.favorite.error || actions.membership.error) && <div className="alert error community-action-error">Không thể cập nhật cộng đồng. Vui lòng thử lại.</div>}
          {categories.isLoading && <div className="feed-state">Đang tải cộng đồng đã tham gia…</div>}
          {categories.error && <div className="feed-state error-state">Không thể tải cộng đồng. Vui lòng thử lại.</div>}
          {!categories.isLoading && categories.data?.length === 0 && <div className="feed-state empty-state"><h3>{favoritesOnly ? 'Chưa có cộng đồng yêu thích' : 'Bạn chưa tham gia cộng đồng nào'}</h3><p>{favoritesOnly ? 'Nhấn biểu tượng ngôi sao để đưa một cộng đồng vào mục yêu thích.' : 'Tìm một cộng đồng phù hợp rồi nhấn Tham gia.'}</p><Link to="/posts">Khám phá cộng đồng</Link></div>}
          {categories.data?.length > 0 && <section className="managed-community-list" aria-label="Cộng đồng đã tham gia">
            {categories.data.map((category) => <article className="managed-community-row" key={category.id}>
              <CommunityAvatar avatarUrl={category.avatarUrl} large />
              <div><h2><Link to={`/posts?categoryId=${encodeURIComponent(category.id)}`}>{category.name}</Link></h2><p>{category.description || 'Chưa có mô tả.'}</p></div>
              <div className="managed-community-actions"><button className={`favorite-button ${category.favoriteByCurrentUser ? 'active' : ''}`} type="button" title={category.favoriteByCurrentUser ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'} aria-label={category.favoriteByCurrentUser ? `Bỏ yêu thích ${category.name}` : `Yêu thích ${category.name}`} aria-pressed={category.favoriteByCurrentUser} disabled={actions.favorite.isPending} onClick={() => actions.favorite.mutate({ id: category.id, favorite: !category.favoriteByCurrentUser })}><Star size={19} fill={category.favoriteByCurrentUser ? 'currentColor' : 'none'} /></button><button className="membership-button joined" type="button" disabled={actions.membership.isPending} onClick={() => actions.membership.mutate({ id: category.id, joined: false })}>Đã tham gia</button></div>
            </article>)}
          </section>}
        </main>
      </div>
    </div>
  );
}
