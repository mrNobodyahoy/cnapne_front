// src/router.tsx

import { createBrowserRouter } from "react-router-dom";

// Layouts e Páginas
import AppLayout from "./layouts/AppLayout";
import Login from "./pages/common/Login";
import ProtectedRoute from "./routes/protectedRoutes";
import HomePage from "./pages/adm/HomePage";
import AlunosPage from "./pages/adm/AlunosPage";
import ProfissionaisPage from "./pages/adm/ProfessionalsPage";
import StudentProfilePage from "./pages/adm/StudentProfilePage";
import StudentDashboardPage from "./pages/student/StudentDashboardPage";

import StudentOwnProfilePage from "./pages/student/StudentOwnProfilePage";
import StudentDocumentsPage from "./pages/student/StudentDocumentsPage";

const AdminConfigPage = () => <h1 className="text-3xl font-bold">Página de Admin</h1>;

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
        element: <AppLayout />,
        children: [
          { index: true, element: <StudentDashboardPage /> },
          { path: "perfil", element: <StudentOwnProfilePage /> },
          { path: "documentos", element: <StudentDocumentsPage /> },

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