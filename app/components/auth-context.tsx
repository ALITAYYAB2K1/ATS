import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { account } from "~/lib/appwrite";

type AuthContextValue = {
  user: any | null;
  loading: boolean; // initial loading
  refreshing: boolean; // explicit refresh in progress
  refreshUser: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<any | null>>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const me = await account.get();
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Optional: listen for cross-tab auth changes
  useEffect(() => {
    const bc =
      typeof window !== "undefined" ? new BroadcastChannel("auth") : null;
    if (bc) {
      bc.onmessage = (ev) => {
        if (ev.data === "auth-changed") {
          // silent refresh
          refreshUser();
        }
      };
    }
    return () => {
      bc?.close();
    };
  }, []);

  const refreshUser = useCallback(async () => {
    setRefreshing(true);
    try {
      const me = await account.get();
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Expose a global helper to broadcast session changes
  const broadcast = () => {
    try {
      const bc = new BroadcastChannel("auth");
      bc.postMessage("auth-changed");
      bc.close();
    } catch {
      /* ignore */
    }
  };

  // Attach to window for imperative use if needed
  if (typeof window !== "undefined") {
    (window as any).__authRefresh = () => {
      broadcast();
      return refreshUser();
    };
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, refreshing, refreshUser, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
