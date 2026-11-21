import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

function clearStoredSession() {
  localStorage.removeItem("taskflow_token");
  localStorage.removeItem("taskflow_user");
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("taskflow_user")) || null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("taskflow_token");
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then(({ data }) => {
        setUser(data.user);
        localStorage.setItem("taskflow_user", JSON.stringify(data.user));
      })
      .catch(() => {
        clearStoredSession();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (form) => {
    const { data } = await api.post("/auth/login", form);
    localStorage.setItem("taskflow_token", data.token);
    localStorage.setItem("taskflow_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const register = async (form) => {
    const { data } = await api.post("/auth/register", form);
    localStorage.setItem("taskflow_token", data.token);
    localStorage.setItem("taskflow_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    clearStoredSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
