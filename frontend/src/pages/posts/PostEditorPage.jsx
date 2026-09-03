import { useParams } from 'react-router-dom';
import { PenLine } from 'lucide-react';
import CommunityHeader from '../../components/layout/CommunityHeader';
import PostForm from '../../features/posts/components/PostForm';
import { useCreatePost, usePost, useUpdatePost } from '../../features/posts/hooks/usePosts';
import { useAuthStore } from '../../store/authStore';

export default function PostEditorPage({ category = null }) {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const post = usePost(id);
  const create = useCreatePost();
  const update = useUpdatePost();
  const user = useAuthStore((state) => state.user);
  const mutation = isEditing ? update : create;

  if (isEditing && post.isLoading) return <div className="page-loader">Đang tải bản nháp…</div>;
  if (isEditing && (post.error || post.data?.authorId !== user?.id)) return <div className="community-page"><CommunityHeader /><div className="detail-state"><h1>Bạn không thể sửa bài viết này</h1></div></div>;
  return (
    <div className="community-page"><CommunityHeader />
      <main className="editor-main">
        <section className="editor-heading"><p className="eyebrow"><PenLine size={15} /> {isEditing ? 'Chỉnh sửa bài viết' : category.name}</p><h1>{isEditing ? 'Làm rõ điều bạn muốn chia sẻ.' : `Tạo bài đăng trong ${category.name}.`}</h1><p>Viết chân thành, cung cấp đủ bối cảnh và để lại khoảng trống cho những góc nhìn khác.</p></section>
        {mutation.error && <div className="alert error editor-alert">{mutation.error.response?.data?.error?.message || 'Không thể lưu bài viết.'}</div>}
        <PostForm initialValues={post.data} fixedCategory={isEditing ? null : category} isPending={mutation.isPending} submitLabel={isEditing ? 'Lưu thay đổi' : 'Tạo bài đăng'} onSubmit={(values) => mutation.mutate(isEditing ? { id, ...values } : values)} />
      </main>
    </div>
  );
}
