import React, { createContext, useContext } from 'react';
import { useQuery } from 'react-query';
import { userAPI } from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { data, isLoading } = useQuery('currentUser', userAPI.getUser);

  return (
    <AuthContext.Provider
      value={{
        userData: data?.user,
        isLoading,
        isLoggedIn: !!data?.user,
        isCarneyTeam: data?.user?.is_carney_team,
        isEmployee : data?.user?.is_employee,
        accessType: data?.user?.profile?.hubspot?.access_type
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Create a custom hook to use the AuthContext, call it useAuth
function useAuth() {
  return useContext(AuthContext);
}

export default useAuth;
