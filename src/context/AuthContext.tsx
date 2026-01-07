import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  expiresAt: number | null;
  login: () => void;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  checkSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);

  /**
   * Check if user has valid session (cookies are HTTP-only, so we ask backend)
   */
  const checkSession = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch("/auth/session", {
        credentials: "include",
      });

      if (!response.ok) {
        setIsAuthenticated(false);
        setExpiresAt(null);
        return false;
      }

      const data = await response.json();
      setIsAuthenticated(data.authenticated);
      setExpiresAt(data.expiresAt || null);
      return data.authenticated;
    } catch (error) {
      console.error("[Auth] Session check failed:", error);
      setIsAuthenticated(false);
      setExpiresAt(null);
      return false;
    }
  }, []);

  /**
   * Refresh the access token
   */
  const refreshSession = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch("/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        setIsAuthenticated(false);
        setExpiresAt(null);
        return false;
      }

      const data = await response.json();
      setExpiresAt(data.expiresAt);
      return true;
    } catch (error) {
      console.error("[Auth] Refresh failed:", error);
      setIsAuthenticated(false);
      return false;
    }
  }, []);

  /**
   * Redirect to login (backend handles PKCE)
   */
  const login = useCallback(() => {
    window.location.href = "/login";
  }, []);

  /**
   * Logout - clear session cookies
   */
  const logout = useCallback(async () => {
    try {
      await fetch("/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("[Auth] Logout error:", error);
    } finally {
      setIsAuthenticated(false);
      setExpiresAt(null);
    }
  }, []);

  // Check session on mount
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await checkSession();
      setIsLoading(false);
    };
    init();
  }, [checkSession]);

  // Set up auto-refresh before token expires
  useEffect(() => {
    if (!(expiresAt && isAuthenticated)) return;

    // Refresh 5 minutes before expiry
    const refreshTime = expiresAt - Date.now() - 5 * 60 * 1000;

    if (refreshTime <= 0) {
      // Token already expired or about to, refresh now
      refreshSession();
      return;
    }

    const timer = setTimeout(() => {
      refreshSession();
    }, refreshTime);

    return () => clearTimeout(timer);
  }, [expiresAt, isAuthenticated, refreshSession]);

  const value = useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      expiresAt,
      login,
      logout,
      refreshSession,
      checkSession,
    }),
    [
      isAuthenticated,
      isLoading,
      expiresAt,
      login,
      logout,
      refreshSession,
      checkSession,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
