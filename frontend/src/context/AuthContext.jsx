import { createContext, useContext, useState } from "react";
import { request } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("session") || "null");
    } catch {
      return null;
    }
  });

  const authenticate = async (path, payload) => {
    const next = await request(path, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (!next?.token) {
      throw new Error("Invalid authentication response");
    }
    setSession(next);
    localStorage.setItem("session", JSON.stringify(next));
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem("session");
  };

  return (
    <AuthContext.Provider value={{ session, authenticate, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
