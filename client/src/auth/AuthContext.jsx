import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("bl_token"));

  const value = useMemo(() => {
    return {
      token,
      isAuthed: Boolean(token),
      setToken: (next) => {
        if (next) {
          localStorage.setItem("bl_token", next);
        } else {
          localStorage.removeItem("bl_token");
        }
        setToken(next || null);
      },
      logout: () => {
        localStorage.removeItem("bl_token");
        setToken(null);
      },
    };
  }, [token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

