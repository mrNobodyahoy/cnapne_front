// src/layouts/StudentLayout.tsx
import { Outlet } from "react-router-dom";
import StudentNavbar from "../components/layout/StudentNavbar";

export default function StudentLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <StudentNavbar />
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}