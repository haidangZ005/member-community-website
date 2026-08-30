import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from '../../pages/auth/LoginPage';
import RegisterPage from '../../pages/auth/RegisterPage';
import ForgotPasswordPage from '../../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../../pages/auth/ResetPasswordPage';
import ProfilePage from '../../pages/profile/ProfilePage';
import ProtectedRoute from './ProtectedRoute';
import PostListPage from '../../pages/posts/PostListPage';
import PostDetailPage from '../../pages/posts/PostDetailPage';
import PostEditorPage from '../../pages/posts/PostEditorPage';
import CreatePostPage from '../../pages/posts/CreatePostPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/posts" element={<ProtectedRoute><PostListPage /></ProtectedRoute>} />
      <Route path="/posts/new" element={<ProtectedRoute><CreatePostPage /></ProtectedRoute>} />
      <Route path="/posts/:id" element={<ProtectedRoute><PostDetailPage /></ProtectedRoute>} />
      <Route path="/posts/:id/edit" element={<ProtectedRoute><PostEditorPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/posts" replace />} />
    </Routes>
  );
}
