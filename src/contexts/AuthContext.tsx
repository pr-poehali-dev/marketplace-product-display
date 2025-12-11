import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  email: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isAdmin: boolean;
  login: (email: string, password: string) => boolean;
  register: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = 'SharaShopSage';
const ADMIN_PASSWORD = '495812sss041124';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const register = (email: string, password: string): boolean => {
    if (!email || !password || password.length < 6) {
      return false;
    }

    const users = JSON.parse(localStorage.getItem('users') || '{}');
    
    if (users[email]) {
      return false;
    }

    users[email] = { password, role: 'user' };
    localStorage.setItem('users', JSON.stringify(users));

    const newUser: User = { email, role: 'user' };
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    return true;
  };

  const login = (email: string, password: string): boolean => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser: User = { email: ADMIN_EMAIL, role: 'admin' };
      setUser(adminUser);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      return true;
    }

    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const userData = users[email];

    if (userData && userData.password === password) {
      const loggedUser: User = { email, role: userData.role };
      setUser(loggedUser);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(loggedUser));
      return true;
    }

    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      isAdmin: user?.role === 'admin',
      login, 
      register,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};