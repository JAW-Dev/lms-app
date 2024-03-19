// hooks/useAuthRedirect.js
import { useEffect } from 'react';
import useAuth from '../context/AuthContext';

export default function useAuthRedirect() {
  const { isLoading, isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      window.location.href = '/v2/users/access';
    }
  }, [isLoading, isLoggedIn]);
}
