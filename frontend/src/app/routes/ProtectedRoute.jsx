import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated, isInitialized } = useAuthStore();
  if (!isInitialized) return <div className="page-loader">Đang khôi phục phiên đăng nhập...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}

