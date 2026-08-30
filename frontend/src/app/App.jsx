import { BrowserRouter } from 'react-router-dom';
import QueryProvider from './providers/QueryProvider';
import AuthProvider from './providers/AuthProvider';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <QueryProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </QueryProvider>
  );
}

