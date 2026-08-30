import { useEffect } from 'react';
import { authApi } from '../../features/auth/api/authApi';
import { useAuthStore } from '../../store/authStore';

export default function AuthProvider({ children }) {
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);
  const setInitialized = useAuthStore((state) => state.setInitialized);

  useEffect(() => {
    let active = true;
    authApi.refresh()
      .then((session) => { if (active) setSession(session); })
      .catch(() => { if (active) clearSession(); })
      .finally(() => { if (active) setInitialized(true); });
    return () => { active = false; };
  }, [clearSession, setInitialized, setSession]);

  return children;
}

