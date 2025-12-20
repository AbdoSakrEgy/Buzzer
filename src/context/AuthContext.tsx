"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { API_BASE_URL } from "@/src/lib/config";

interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  isActive: boolean;
  profileImage_public_id: string | null;
  pricingPlan: string;
  availableCredits: number;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null; // accessToken for API calls
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (tokens: AuthTokens) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ACCESS_TOKEN_KEY = "buzzer_access_token";
const REFRESH_TOKEN_KEY = "buzzer_refresh_token";
const AUTH_USER_KEY = "buzzer_auth_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile using token
  const fetchProfile = useCallback(
    async (token: string): Promise<User | null> => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          return data.data.user;
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
      return null;
    },
    []
  );

  // Refresh access token using refresh token
  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
    const storedRefresh =
      refreshToken || localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!storedRefresh) return false;

    try {
      const res = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        headers: { Authorization: `Bearer ${storedRefresh}` },
      });
      if (res.ok) {
        const data = await res.json();
        const newAccessToken = data.data.accessToken;
        setAccessToken(newAccessToken);
        localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
        return true;
      }
    } catch (error) {
      console.error("Failed to refresh token:", error);
    }
    return false;
  }, [refreshToken]);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const loadAuth = async () => {
      try {
        const storedAccessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
        const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        const storedUser = localStorage.getItem(AUTH_USER_KEY);

        if (storedAccessToken && storedRefreshToken) {
          setAccessToken(storedAccessToken);
          setRefreshToken(storedRefreshToken);

          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            // Fetch profile if not cached
            const profile = await fetchProfile(storedAccessToken);
            if (profile) {
              setUser(profile);
              localStorage.setItem(AUTH_USER_KEY, JSON.stringify(profile));
            }
          }
        }
      } catch (error) {
        console.error("Failed to load auth state:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAuth();
  }, [fetchProfile]);

  // Login: store tokens and fetch profile
  const login = async (tokens: AuthTokens) => {
    setAccessToken(tokens.accessToken);
    setRefreshToken(tokens.refreshToken);
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);

    // Fetch and store user profile
    const profile = await fetchProfile(tokens.accessToken);
    if (profile) {
      setUser(profile);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(profile));
    }
  };

  // Logout: clear all tokens and user data
  const logout = async () => {
    try {
      // Call logout API (optional, fire and forget)
      if (accessToken) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ type: user ? "customer" : "admin" }),
        }).catch(() => {}); // Ignore errors
      }
    } finally {
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token: accessToken,
        isAuthenticated: !!accessToken,
        isLoading,
        login,
        logout,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
