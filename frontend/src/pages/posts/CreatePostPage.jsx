import { Navigate, useSearchParams } from 'react-router-dom';
import { useCategories } from '../../features/posts/hooks/usePosts';
import PostEditorPage from './PostEditorPage';

export default function CreatePostPage() {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('categoryId');
  const categories = useCategories({ id: categoryId }, Boolean(categoryId));

  if (categories.isLoading) return <div className="page-loader">Đang mở chủ đề…</div>;
  const category = categories.data?.[0];
  return category ? <PostEditorPage category={category} /> : <Navigate to="/posts" replace />;
}
