// src/routes/protectedRoutes.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../store/auth";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { session, isLoading } = useAuth();

  // 1. Enquanto a sessão inicial está sendo verificada, mostramos um loader
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Carregando sessão...</div>;
  }

  // 2. Se não há sessão (verificação concluída), redireciona para login
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // 3. Se há sessão, mas o perfil não está na lista de permitidos, redireciona
  if (!allowedRoles.includes(session.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 4. Se tudo estiver certo, permite o acesso à rota
  return <Outlet />;
}