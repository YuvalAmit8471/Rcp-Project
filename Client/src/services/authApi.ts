/**
 * Authentication API Service
 * Centralized API calls for authentication operations
 */

import api from "@/lib/api";
import type { User } from "@/types/User";

interface AuthResponse {
  success: boolean;
  user?: User;
  message?: string;
}

export const authApi = {
  /**
   * Login user with email and password
   */
  async login(email: string, password: string): Promise<User> {
    const response = await api.post<AuthResponse>("/api/auth/login", {
      email,
      password,
    });

    if (!response.data.success || !response.data.user) {
      throw new Error(response.data.message || "Login failed");
    }

    return response.data.user;
  },

  /**
   * Register new user
   */
  async register(name: string, email: string, password: string): Promise<User> {
    const response = await api.post<AuthResponse>("/api/auth/register", {
      name,
      email,
      password,
    });

    if (!response.data.success || !response.data.user) {
      throw new Error(response.data.message || "Registration failed");
    }

    return response.data.user;
  },

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await api.get<AuthResponse>("/api/auth/me");
      return response.data.user || null;
    } catch (error: unknown) {
      // טיפול מפורט בשגיאות
      const axiosError = error as {
        response?: { status: number; data: unknown };
      };
      console.error(
        "getCurrentUser error:",
        axiosError.response?.status,
        axiosError.response?.data
      );

      // אם זה 401, זה אומר שאין משתמש מחובר - זה תקין
      if (axiosError.response?.status === 401) {
        return null;
      }

      // לשגיאות אחרות, נזרוק את השגיאה כדי שהקונטקסט יוכל לטפל בה
      throw error;
    }
  },

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    try {
      await api.post("/api/auth/logout");
    } catch {
      // Ignore server errors on logout
    }
  },
};
