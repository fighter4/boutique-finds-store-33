
import { createContext, useContext } from 'react';
import { useAuthState } from './useAuthState';

const AuthContext = createContext<ReturnType<typeof useAuthState> | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuthState();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
