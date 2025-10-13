// src/components/layout/Sidebar.tsx

import { NavLink, useNavigate } from "react-router-dom";
import { Home, Users, BookUser, ShieldCheck, LogOut, UserCircle, ClipboardList, ClipboardCheck } from "lucide-react";
import { logoutRequest } from "../../services/authService";
import { useAuth, type Role } from "../../store/auth";
import Button from "../ui/Button";
import { useQueryClient } from "@tanstack/react-query";

export default function Sidebar() {
  const navigate = useNavigate();
  const { session, clearSession } = useAuth();
  const queryClient = useQueryClient();


  const handleLogout = async () => {
    try {
      await logoutRequest();
      queryClient.clear();
      clearSession();
      navigate("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const getNavLinks = (role: Role | undefined) => {
    const baseLinks = [{ to: "/", label: "Início", icon: Home }];

    const staffLinks = [
      ...baseLinks,
      { to: "/alunos", label: "Alunos", icon: Users },
      { to: "/atendimentos", label: "Atendimentos", icon: ClipboardList },
      { to: "/acompanhamentos", label: "Acompanhamentos", icon: ClipboardCheck },

    ];

    switch (role) {
      case 'COORDENACAO_CNAPNE':
        return [
          ...staffLinks,
          { to: "/professionals", label: "Profissionais", icon: BookUser },
          { to: "/admin/config", label: "Admin", icon: ShieldCheck },
        ];

      case 'EQUIPE_ACOMPANHAMENTO':
      case 'EQUIPE_AEE':
        return staffLinks;

      case 'ESTUDANTE':
        return [
          { to: "/aluno", label: "Meu Perfil e Histórico", icon: UserCircle },];
      default:
        return baseLinks;
    }
  };

  const navLinks = getNavLinks(session?.role);
  const isStudent = session?.role === 'ESTUDANTE';

  return (
    <aside className="fixed left-0 top-0 h-full w-64 border-r bg-white flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-ifpr-green">CNAPNE</h1>
        <p className="text-sm text-gray-500">
          {isStudent ? 'Painel do Estudante' : 'Painel de Controle'}
        </p>
      </div>
      <nav className="flex flex-col p-4 flex-grow">
        {navLinks.map((link) => (
          <NavLink key={link.to} to={link.to} end className={({ isActive }) => `flex items-center rounded-md px-4 py-3 text-gray-700 transition hover:bg-green-50 hover:text-ifpr-green ${isActive ? "bg-green-100 font-semibold text-ifpr-green" : ""}`}>
            <link.icon className="mr-3 h-5 w-5" />
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t">
        <div className="mb-4 text-center">
          <p className="text-sm font-medium text-gray-800" title={session?.email}>
            {session?.email}
          </p>
        </div>
        <Button onClick={handleLogout} className="flex w-full items-center rounded-md px-4 py-3 text-gray-700 transition hover:bg-red-50 hover:text-red-600">
          <LogOut className="mr-3 h-5 w-5" />
          Sair
        </Button>
      </div>
    </aside>
  );
}