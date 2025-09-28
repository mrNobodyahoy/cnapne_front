import { createBrowserRouter } from "react-router-dom";

import AppLayout from "./layouts/AppLayout";
import Login from "./pages/common/Login";
import ProtectedRoute from "./routes/protectedRoutes";
import HomePage from "./pages/adm/HomePage";
import AlunosPage from "./pages/adm/student/AlunosPage";
import ProfissionaisPage from "./pages/adm/professional/ProfessionalsPage";
import StudentProfilePage from "./pages/adm/student/StudentProfilePage";
import StudentDashboardPage from "./pages/student/StudentDashboardPage";

import StudentOwnProfilePage from "./pages/student/StudentOwnProfilePage";
import StudentDocumentsPage from "./pages/student/StudentDocumentsPage";

import NewAtendimentoPage from "./pages/adm/servicesAtendimento/NewAtendimentoPage";
import NewAcompanhamentoPage from "./pages/adm/followUp/NewAcompanhamentoPage";
import AtendimentosPage from "./pages/adm/servicesAtendimento/AtendimentosPage";
import FollowUpPage from "./pages/adm/followUp/FollowUpPage";
import AtendimentoProfilePage from "./pages/adm/servicesAtendimento/AtendimentoProfilePage";
import FollowUpProfilePage from "./pages/adm/followUp/FollowUpProfilePage";



const AdminConfigPage = () => <h1 className="text-3xl font-bold">Página de Admin</h1>;

const routes = [
  { path: "/login", element: <Login /> },
  { path: "/unauthorized", element: <h1>Acesso Não Autorizado</h1> },
  {
    // PAINEL ADMINISTRATIVO
    element: (
      <ProtectedRoute
        allowedRoles={[
          "COORDENACAO_CNAPNE",
          "EQUIPE_ACOMPANHAMENTO",
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
              { path: ":studentId/novo-atendimento", element: <NewAtendimentoPage /> },
              { path: ":studentId/novo-acompanhamento", element: <NewAcompanhamentoPage /> },
            ],

          },
          { path: "professionals", element: <ProfissionaisPage /> },

          {
            path: "atendimentos",
            children: [
              { index: true, element: <AtendimentosPage /> },
              { path: ":atendimentoId", element: <AtendimentoProfilePage /> },
            ]
          },

          {
            path: "acompanhamentos",
            children: [
              { index: true, element: <FollowUpPage /> },
              { path: ":acompanhamentoId", element: <FollowUpProfilePage /> },
            ]
          },

          { path: "atendimentos", element: <AtendimentosPage /> },
          { path: "acompanhamentos", element: <FollowUpPage /> },
          { path: "admin/config", element: <AdminConfigPage /> },

        ],
      },
    ],
  },
  {
    // PAINEL DO ESTUDANTE
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

export const router = createBrowserRouter(routes, {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
});