import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminPagination({ meta, onPageChange }) {
  if (!meta || meta.totalPages <= 1) return null;
  return (
    <div className="admin-pagination">
      <span>Trang {meta.page} / {meta.totalPages} · {meta.total} kết quả</span>
      <div><button disabled={meta.page <= 1} onClick={() => onPageChange(meta.page - 1)} aria-label="Trang trước"><ChevronLeft size={17} /></button><button disabled={meta.page >= meta.totalPages} onClick={() => onPageChange(meta.page + 1)} aria-label="Trang sau"><ChevronRight size={17} /></button></div>
    </div>
  );
}
