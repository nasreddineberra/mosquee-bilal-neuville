'use client';

import { useState, createContext, useContext } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (email: string, _password: string) => {
    // Connexion simulée - accept n'importe quel email/mot de passe
    if (email && _password) {
      setIsAuthenticated(true);
      document.cookie = 'admin-session=1; path=/; max-age=86400; SameSite=Strict';
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    document.cookie = 'admin-session=; path=/; max-age=0';
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
