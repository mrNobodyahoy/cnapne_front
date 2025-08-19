// src/routes/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useEffect, useState, type JSX } from "react";
import { me } from "../services/authService";
import { useAuth } from "../store/auth";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const [ok, setOk] = useState<boolean | null>(null);
  const { setSession } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const info = await me(); // se 401 cai no catch
        setSession(info);
        setOk(true);
      } catch {
        setOk(false);
      }
    })();
  }, [setSession]);

  if (ok === null) return <div className="p-6">Carregando…</div>;
  if (!ok) return <Navigate to="/login" replace />;
  return children;
}
