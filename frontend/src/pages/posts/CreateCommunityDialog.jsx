import { useEffect, useRef, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useCreateCategory } from '../../features/posts/hooks/usePosts';
import CommunityAvatar from '../../components/ui/CommunityAvatar';
import { prepareCommunityAvatar } from '../../utils/communityAvatar';

export default function CreateCommunityDialog({ onClose }) {
  const dialogRef = useRef(null);
  const nameRef = useRef(null);
  const create = useCreateCategory();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [imageError, setImageError] = useState('');
  const [readingImage, setReadingImage] = useState(false);

  const chooseImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImageError('');
    setReadingImage(true);
    try { setAvatarUrl(await prepareCommunityAvatar(file)); }
    catch (error) { setImageError(error.message); }
    finally { setReadingImage(false); }
    event.target.value = '';
  };

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (!dialogRef.current.open) dialogRef.current.showModal();
    nameRef.current.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      document.querySelector('a[href="/communities/new"]')?.focus();
    };
  }, []);

  const submit = (event) => {
    event.preventDefault();
    if (create.isPending || readingImage || name.trim().length < 2) return;
    create.mutate({ name: name.trim(), description: description.trim() || null, avatarUrl });
  };
  const close = () => dialogRef.current.close();

  return (
    <dialog ref={dialogRef} className="create-community-dialog" aria-labelledby="community-dialog-title" aria-describedby="community-dialog-description" onClose={onClose} onCancel={(event) => { if (create.isPending) event.preventDefault(); }}>
      <header className="community-dialog-heading">
        <div><h1 id="community-dialog-title">Bắt đầu một cộng đồng</h1><p id="community-dialog-description">Đặt tên và viết đôi dòng để mọi người biết nơi này dành cho điều gì.</p></div>
        <button type="button" className="community-dialog-close" aria-label="Đóng cửa sổ" disabled={create.isPending} onClick={close}><X size={22} /></button>
      </header>
      <form onSubmit={submit} aria-busy={create.isPending}>
        {create.error && <div role="alert" className="alert error">{create.error.response?.data?.error?.message || 'Không thể tạo cộng đồng. Vui lòng thử lại.'}</div>}
        <div className="community-dialog-body">
          <div className="community-dialog-fields">
            <label className="editor-field"><span>Ảnh đại diện cộng đồng</span><input type="file" accept="image/jpeg,image/png,image/webp" disabled={create.isPending || readingImage} onChange={chooseImage} aria-describedby="community-image-help" /><span id="community-image-help" className="community-image-help">JPG, PNG hoặc WebP, tối đa 5 MB. Ảnh được cắt vuông ở giữa và thu nhỏ còn 256 × 256.</span></label>
            {readingImage && <p role="status">Đang xử lý ảnh…</p>}
            {imageError && <p role="alert" className="field-error">{imageError}</p>}
            {avatarUrl && <button className="text-button community-remove-image" type="button" disabled={create.isPending || readingImage} onClick={() => setAvatarUrl(null)}>Bỏ ảnh đã chọn</button>}
            <label className="editor-field"><span>Tên cộng đồng <span aria-hidden="true">*</span></span><input ref={nameRef} required minLength={2} maxLength={100} value={name} disabled={create.isPending} onChange={(event) => setName(event.target.value)} placeholder="Ví dụ: Công nghệ Việt" /><span className="community-field-count" aria-hidden="true">{name.length}/100</span></label>
            <label className="editor-field"><span>Mô tả</span><textarea rows={6} maxLength={500} value={description} disabled={create.isPending} onChange={(event) => setDescription(event.target.value)} placeholder="Cộng đồng này dành cho những cuộc trò chuyện nào?" /><span className="community-field-count" aria-hidden="true">{description.length}/500</span></label>
          </div>
          <aside className="community-preview" aria-label="Xem trước cộng đồng">
            <p className="community-preview-label">Xem trước</p>
            <div className="community-preview-banner" />
            <div className="community-preview-content">
              <CommunityAvatar avatarUrl={avatarUrl} />
              <h2>{name.trim() || 'Tên cộng đồng'}</h2>
              <p>{description.trim() || 'Mô tả cộng đồng của bạn sẽ xuất hiện tại đây.'}</p>
            </div>
          </aside>
        </div>
        <footer className="community-dialog-actions"><button className="text-button" type="button" disabled={create.isPending} onClick={close}>Hủy</button><button className="primary-button editor-submit" type="submit" disabled={create.isPending || readingImage || name.trim().length < 2}><Plus size={18} />{create.isPending ? 'Đang tạo…' : 'Tạo cộng đồng'}</button></footer>
      </form>
    </dialog>
  );
}
