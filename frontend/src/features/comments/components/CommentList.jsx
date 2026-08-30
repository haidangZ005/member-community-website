import { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { useComments, useCreateComment } from '../hooks/useComments';

const dateFormatter = new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' });

export default function CommentList({ postId }) {
  const comments = useComments(postId);
  const createComment = useCreateComment(postId);
  const [content, setContent] = useState('');

  const submit = (event) => {
    event.preventDefault();
    const normalized = content.trim();
    if (normalized.length < 2) return;
    createComment.mutate(normalized, { onSuccess: () => setContent('') });
  };

  return (
    <section className="comments-section" id="comments">
      <div className="section-title"><div><p className="eyebrow">Cuộc trò chuyện</p><h2><MessageSquare size={23} /> {comments.data?.length || 0} bình luận</h2></div></div>
      <form className="comment-composer" onSubmit={submit}><textarea value={content} onChange={(event) => setContent(event.target.value)} rows="3" maxLength="2000" placeholder="Đóng góp góc nhìn của bạn…" aria-label="Nội dung bình luận" /><button type="submit" disabled={createComment.isPending || content.trim().length < 2}><Send size={17} /> {createComment.isPending ? 'Đang gửi…' : 'Gửi bình luận'}</button></form>
      {createComment.error && <div className="alert error">{createComment.error.response?.data?.error?.message || 'Không thể gửi bình luận.'}</div>}
      <div className="comment-list">
        {comments.isLoading && <p className="muted-copy">Đang tải bình luận…</p>}
        {comments.data?.map((comment) => {
          const name = comment.author?.fullName || comment.author?.username || 'Thành viên';
          return <article className="comment-item" key={comment.id}><div className="mini-avatar small">{name.slice(0, 1).toUpperCase()}</div><div><div className="comment-meta"><strong>{name}</strong><time>{dateFormatter.format(new Date(comment.createdAt))}</time></div><p>{comment.content}</p></div></article>;
        })}
        {!comments.isLoading && comments.data?.length === 0 && <div className="empty-comments">Chưa có bình luận. Hãy là người mở đầu cuộc trò chuyện.</div>}
      </div>
    </section>
  );
}
