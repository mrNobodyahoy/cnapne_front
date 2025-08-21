import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";

export default function AppLayout() {
  return (
    <div className="grid grid-cols-[256px_1fr]">
      {/* Coluna da Sidebar */}
      <Sidebar />

      {/* Coluna do Conteúdo Principal */}
      <main className="ml-64 bg-gray-50 min-h-screen">
        {/* O <Outlet> renderizará a página da rota atual aqui */}
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}