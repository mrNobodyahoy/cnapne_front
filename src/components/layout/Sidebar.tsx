import { NavLink } from "react-router-dom";
import { Home, Users, Settings } from "lucide-react";

const navLinks = [
  { to: "/", label: "Início", icon: Home },
  { to: "/alunos", label: "Alunos", icon: Users },
  { to: "/configuracoes", label: "Configurações", icon: Settings },
];

// 👇 A palavra-chave 'default' é a correção.
export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 border-r bg-white">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-ifpr-green">CNAPNE</h1>
        <p className="text-sm text-gray-500">Painel de Controle</p>
      </div>
      <nav className="flex flex-col p-4">
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
    </aside>
  );
}