// src/layouts/AppLayout.tsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";

export default function AppLayout() {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      {/* Adiciona margem à esquerda igual à largura da sidebar (w-64 = 16rem = 256px) */}
      <main className="flex-1 ml-64">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}