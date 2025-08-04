import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "@/services/authApi";
import type { User } from "@/types/User";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export { AuthContext };

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Initialize auth state by checking if user is already logged in
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentUser = await authApi.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Login user and update auth state
   */
  const login = async (email: string, password: string) => {
    const loggedInUser = await authApi.login(email, password);
    setUser(loggedInUser);
  };

  /**
   * Register new user and update auth state
   */
  const register = async (name: string, email: string, password: string) => {
    const newUser = await authApi.register(name, email, password);
    setUser(newUser);
  };

  /**
   * Logout user and clear auth state
   */
  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
