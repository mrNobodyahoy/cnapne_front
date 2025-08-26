import { NavLink, useNavigate } from "react-router-dom";
import { Home, Users, LogOut } from "lucide-react";
import { logoutRequest } from "../../services/authService";
import Button from "../ui/Button";

const navLinks = [
  { to: "/", label: "Início", icon: Home },
  { to: "/alunos", label: "Alunos", icon: Users },
  { to: "/professionals", label: "Profissionais", icon: Users },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutRequest();
      navigate("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      alert("Não foi possível fazer o logout. Tente novamente.");
    }
  };

  return (
    // ✅ CORREÇÃO: Adicionado 'flex' e 'flex-col' para um layout de coluna.
    <aside className="fixed left-0 top-0 h-full w-64 border-r bg-white flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-ifpr-green">CNAPNE</h1>
        <p className="text-sm text-gray-500">Painel de Controle</p>
      </div>
      {/* ✅ CORREÇÃO: 'flex-grow' faz o 'nav' ocupar todo o espaço vertical disponível, empurrando o botão para baixo. */}
      <nav className="flex flex-col p-4 flex-grow">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end
            className={({ isActive }) =>
              `flex items-center rounded-md px-4 py-3 text-gray-700 transition hover:bg-green-50 hover:text-ifpr-green ${
                isActive ? "bg-green-100 font-semibold text-ifpr-green" : ""
              }`
            }
          >
            <link.icon className="mr-3 h-5 w-5" />
            {link.label}
          </NavLink>
        ))}
      </nav>
      {/* ✅ NOVO: Botão de Logout fora do 'nav' para ser empurrado para o final. */}
      <div className="p-4 border-t">
        <Button
          onClick={handleLogout}
          className="flex w-full items-center rounded-md px-4 py-3 text-gray-700 transition hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sair
        </Button>
      </div>
    </aside>
  );
}