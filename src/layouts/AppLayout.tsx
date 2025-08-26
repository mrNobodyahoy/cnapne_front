import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";

export default function AppLayout() {
  return (
    // ✅ CORREÇÃO: Adicionado o container flexível que alinha a sidebar e o conteúdo principal.
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-gray-50 min-h-screen">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}