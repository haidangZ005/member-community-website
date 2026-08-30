import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { postSchema } from '../schema/postSchema';
import { useCategories } from '../hooks/usePosts';

export default function PostForm({ initialValues, onSubmit, isPending, submitLabel }) {
  const categories = useCategories();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: { title: '', content: '', categoryId: '' },
  });

  useEffect(() => {
    if (initialValues) reset({ title: initialValues.title, content: initialValues.content, categoryId: initialValues.categoryId || '' });
  }, [initialValues, reset]);

  return (
    <form className="editor-card" onSubmit={handleSubmit((values) => onSubmit({ ...values, categoryId: values.categoryId || null }))} noValidate>
      <label className="editor-field"><span>Chuyên mục</span><select {...register('categoryId')}><option value="">Thảo luận chung</option>{categories.data?.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
      <label className="editor-field"><span>Tiêu đề</span><input autoFocus placeholder="Một tiêu đề rõ ràng giúp mọi người dễ tham gia…" {...register('title')} />{errors.title && <small>{errors.title.message}</small>}</label>
      <label className="editor-field"><span>Nội dung</span><textarea rows="12" placeholder="Chia sẻ bối cảnh, góc nhìn hoặc câu hỏi của bạn…" {...register('content')} />{errors.content && <small>{errors.content.message}</small>}</label>
      <div className="editor-actions"><Link className="text-button" to={initialValues ? `/posts/${initialValues.id}` : '/posts'}><ArrowLeft size={17} /> Quay lại</Link><button className="primary-button editor-submit" type="submit" disabled={isPending}><Send size={17} /> {isPending ? 'Đang lưu…' : submitLabel}</button></div>
    </form>
  );
}
