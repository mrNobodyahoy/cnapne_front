// src/router.tsx

import { createBrowserRouter } from "react-router-dom";

// Layouts, Páginas e Placeholders...
import AppLayout from "./layouts/AppLayout";
import StudentLayout from "./layouts/StudentLayout";
import Login from "./pages/Login";
import ProtectedRoute from "./routes/protectedRoutes";
import HomePage from "./pages/HomePage";
import AlunosPage from "./pages/AlunosPage";
import ProfissionaisPage from "./pages/ProfessionalsPage";
import StudentProfilePage from "./pages/StudentProfilePage";
import StudentDashboardPage from "./pages/StudentDashboardPage";

// Componentes placeholder que você já tinha
const AdminConfigPage = () => <h1 className="text-3xl font-bold">Página de Admin</h1>;
const StudentDocumentsPage = () => <h1 className="text-3xl font-bold">Meus Documentos</h1>;
const StudentOwnProfilePage = () => <h1 className="text-3xl font-bold">Meu Perfil</h1>;

// Definindo as rotas como um array de objetos
const routes = [
  { path: "/login", element: <Login /> },
  { path: "/unauthorized", element: <h1>Acesso Não Autorizado</h1> },
  {
    // GRUPO DE ROTAS 1: PAINEL ADMINISTRATIVO
    element: (
      <ProtectedRoute
        allowedRoles={[
          "COORDENACAO_CNAPNE",
          "EQUIPE_MULTIDISCIPLINAR",
          "EQUIPE_AEE",
        ]}
      />
    ),
    children: [
      {
        path: "/",
        element: <AppLayout />,
        children: [
          { index: true, element: <HomePage /> },
          {
            path: "alunos",
            children: [
              { index: true, element: <AlunosPage /> },
              { path: ":studentId", element: <StudentProfilePage /> },
            ],
          },
          { path: "professionals", element: <ProfissionaisPage /> },
          { path: "admin/config", element: <AdminConfigPage /> },
        ],
      },
    ],
  },
  {
    // GRUPO DE ROTAS 2: PAINEL DO ESTUDANTE
    element: <ProtectedRoute allowedRoles={["ESTUDANTE"]} />,
    children: [
      {
        path: "/dashboard",
        element: <StudentLayout />,
        children: [
          { index: true, element: <StudentDashboardPage /> },
          { path: "documentos", element: <StudentDocumentsPage /> },
          { path: "perfil", element: <StudentOwnProfilePage /> },
        ],
      },
    ],
  },
];

// Criando o roteador e passando as flags na configuração
export const router = createBrowserRouter(routes, {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
});