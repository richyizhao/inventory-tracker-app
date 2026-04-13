/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { ApiError } from "@/lib/http";
import {
  getCurrentUser,
  login as loginRequest,
  updateProfile as updateProfileRequest,
} from "@/lib/auth/auth-api";
import type {
  AuthResponse,
  AuthUser,
  UpdateProfileInput,
} from "@/lib/auth/types";

type StoredAuth = {
  token: string;
  expiresAtUtc: string;
  user: AuthUser;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isReady: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (input: UpdateProfileInput) => Promise<void>;
};

const AUTH_STORAGE_KEY = "inventory-tracker.auth";

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredAuth() {
  const rawValue = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as StoredAuth;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

function storeAuth(payload: AuthResponse) {
  const authState: StoredAuth = {
    token: payload.token,
    expiresAtUtc: payload.expiresAtUtc,
    user: payload.user,
  };

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
  return authState;
}

function clearStoredAuth() {
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function AuthProvider({ children }: PropsWithChildren) {
  const storedAuth = useMemo(() => readStoredAuth(), []);
  const [user, setUser] = useState<AuthUser | null>(storedAuth?.user ?? null);
  const [token, setToken] = useState<string | null>(storedAuth?.token ?? null);
  const [isReady, setIsReady] = useState(!storedAuth?.token);

  useEffect(() => {
    let isMounted = true;

    if (!storedAuth?.token) {
      return;
    }

    getCurrentUser(storedAuth.token)
      .then((currentUser) => {
        if (!isMounted) {
          return;
        }

        const refreshedAuth: StoredAuth = {
          ...storedAuth,
          user: currentUser,
        };

        window.localStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify(refreshedAuth),
        );
        setUser(currentUser);
      })
      .catch((error) => {
        if (!isMounted) {
          return;
        }

        if (error instanceof ApiError) {
          clearStoredAuth();
          setToken(null);
          setUser(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsReady(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [storedAuth]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      isReady,
      async login(email, password) {
        const response = await loginRequest(email, password);
        const storedAuth = storeAuth(response);

        setToken(storedAuth.token);
        setUser(storedAuth.user);
      },
      logout() {
        clearStoredAuth();
        setToken(null);
        setUser(null);
      },
      async updateProfile(input) {
        if (!token) {
          throw new ApiError(
            "You need to log in before updating your profile.",
            401,
          );
        }

        const response = await updateProfileRequest(token, input);
        const storedAuth = storeAuth(response);

        setToken(storedAuth.token);
        setUser(storedAuth.user);
      },
    }),
    [isReady, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
