// src/components/layout/StudentNavbar.tsx
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, FileText, UserCircle, LogOut } from "lucide-react";
import { useAuth } from "../../store/auth";
import { logoutRequest } from "../../services/authService";
import Button from "../ui/Button";

// Links de navegação específicos para o estudante
const navLinks = [
  { to: "/dashboard", label: "Meu Painel", icon: LayoutDashboard },
  { to: "/dashboard/documentos", label: "Documentos", icon: FileText },
  { to: "/dashboard/perfil", label: "Meu Perfil", icon: UserCircle },
];

export default function StudentNavbar() {
  const navigate = useNavigate();
  const { session, clearSession } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutRequest();
      clearSession();
      navigate("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      // Opcional: Adicionar uma notificação de erro para o usuário
    }
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm px-6 py-3 flex justify-between items-center sticky top-0 z-40">
      {/* Lado Esquerdo: Logo/Branding */}
      <div>
        <h1 className="text-xl font-bold text-ifpr-green">Painel do Estudante</h1>
      </div>

      {/* Centro: Links de Navegação */}
      <nav className="flex items-center gap-8">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end // Garante que a classe ativa só se aplique à rota exata
            className={({ isActive }) =>
              `flex items-center gap-2 text-gray-600 transition-colors duration-200 hover:text-ifpr-green ${
                isActive ? 'font-semibold text-ifpr-green' : ''
              }`
            }
          >
            <link.icon className="h-5 w-5" />
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Lado Direito: Informações do Usuário e Logout */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-700" title={session?.email}>
          {session?.email}
        </span>
        <Button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-600 rounded-md py-2 px-3 transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
          title="Sair da conta"
        >
          <LogOut className="h-5 w-5" />
          Sair
        </Button>
      </div>
    </header>
  );
}