import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import { apiClient } from "@/lib/api/client";

// ==================== Types ====================

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  expiresAt: number | null;
}

type AuthAction =
  | { type: "AUTH_LOADING" }
  | {
      type: "AUTH_SUCCESS";
      payload: { authenticated: boolean; expiresAt: number | null };
    }
  | { type: "AUTH_ERROR" }
  | { type: "AUTH_LOGOUT" };

interface AuthContextType extends AuthState {
  login: () => void;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  checkSession: () => Promise<boolean>;
}

// ==================== Reducer ====================

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "AUTH_LOADING":
      return { ...state, isLoading: true };

    case "AUTH_SUCCESS":
      return {
        isLoading: false,
        isAuthenticated: action.payload.authenticated,
        expiresAt: action.payload.expiresAt,
      };

    case "AUTH_ERROR":
      return {
        isLoading: false,
        isAuthenticated: false,
        expiresAt: null,
      };

    case "AUTH_LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        expiresAt: null,
      };

    default:
      return state;
  }
}

// ==================== Context ====================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, {
    isAuthenticated: false,
    isLoading: true,
    expiresAt: null,
  });

  // Refresh promise queue (prevent duplicate refreshes)
  const refreshPromiseRef = useRef<Promise<boolean> | null>(null);

  /**
   * Check session - stable reference (no dependencies)
   */
  const checkSession = useCallback(async (): Promise<boolean> => {
    dispatch({ type: "AUTH_LOADING" });

    try {
      const response = await apiClient.request<{
        authenticated: boolean;
        expiresAt: number;
      }>({
        endpoint: "/auth/session",
      });

      dispatch({
        type: "AUTH_SUCCESS",
        payload: {
          authenticated: response.authenticated,
          expiresAt: response.expiresAt,
        },
      });

      return response.authenticated;
    } catch (error) {
      console.error("[Auth] Session check failed:", error);
      dispatch({ type: "AUTH_ERROR" });
      return false;
    }
  }, []); // ✅ No dependencies = stable

  /**
   * Refresh token with queue
   */
  const refreshSession = useCallback(async (): Promise<boolean> => {
    // Return existing refresh promise if already in progress
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    const refreshPromise = (async () => {
      try {
        const response = await apiClient.request<{ expiresAt: number }>({
          endpoint: "/auth/refresh",
          method: "POST",
        });

        dispatch({
          type: "AUTH_SUCCESS",
          payload: { authenticated: true, expiresAt: response.expiresAt },
        });

        return true;
      } catch (error) {
        console.error("[Auth] Refresh failed:", error);
        dispatch({ type: "AUTH_ERROR" });
        return false;
      } finally {
        refreshPromiseRef.current = null;
      }
    })();

    refreshPromiseRef.current = refreshPromise;
    return refreshPromise;
  }, []); // ✅ No dependencies = stable

  /**
   * Login - redirect to OAuth
   */
  const login = useCallback(() => {
    window.location.href = "/login";
  }, []);

  /**
   * Logout - clear session
   */
  const logout = useCallback(async () => {
    try {
      await apiClient.request({
        endpoint: "/auth/logout",
        method: "POST",
      });
    } catch (error) {
      console.error("[Auth] Logout error:", error);
    } finally {
      dispatch({ type: "AUTH_LOGOUT" });
    }
  }, []);

  // Check session on mount
  useEffect(() => {
    checkSession();
  }, []); // ✅ Only run once

  // Auto-refresh before token expires
  useEffect(() => {
    if (!(state.expiresAt && state.isAuthenticated)) return;

    const refreshTime = state.expiresAt - Date.now() - 5 * 60 * 1000; // 5 min before

    if (refreshTime <= 0) {
      refreshSession();
      return;
    }

    const timer = setTimeout(() => {
      refreshSession();
    }, refreshTime);

    return () => clearTimeout(timer);
  }, [state.expiresAt, state.isAuthenticated, refreshSession]);

  const value = useMemo(
    () => ({
      ...state,
      login,
      logout,
      refreshSession,
      checkSession,
    }),
    [state, login, logout, refreshSession, checkSession]
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
