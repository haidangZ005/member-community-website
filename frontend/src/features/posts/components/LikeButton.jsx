import { Heart } from 'lucide-react';
import { useToggleLike } from '../hooks/usePosts';

export default function LikeButton({ post, compact = false }) {
  const toggle = useToggleLike(post);
  return (
    <button
      className={`reaction-button ${post.likedByCurrentUser ? 'liked' : ''} ${compact ? 'compact' : ''}`}
      type="button"
      disabled={toggle.isPending}
      aria-pressed={post.likedByCurrentUser}
      onClick={(event) => { event.preventDefault(); toggle.mutate(); }}
    >
      <Heart size={compact ? 16 : 18} fill={post.likedByCurrentUser ? 'currentColor' : 'none'} />
      <span>{post.likeCount}</span><span className="reaction-label">{post.likedByCurrentUser ? 'Đã thích' : 'Thích'}</span>
    </button>
  );
}
