// src/routes/protectedRoutes.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../store/auth";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Carregando sessão...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(session.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}