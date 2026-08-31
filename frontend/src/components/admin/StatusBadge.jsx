const labels = { active: 'Hoạt động', locked: 'Đã khóa', published: 'Đang hiển thị', visible: 'Đang hiển thị', removed: 'Đã gỡ' };

export default function StatusBadge({ status }) {
  return <span className={`admin-status ${status}`}>{labels[status] || status}</span>;
}
