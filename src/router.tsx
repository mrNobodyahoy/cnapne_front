import { createBrowserRouter } from "react-router-dom";

import AppLayout from "./layouts/AppLayout";
import Login from "./pages/common/Login";
import ProtectedRoute from "./routes/protectedRoutes";

// Páginas do ADM
import HomePage from "./pages/adm/HomePage";
import AlunosPage from "./pages/adm/student/AlunosPage";
import ProfissionaisPage from "./pages/adm/professional/ProfessionalsPage";
import StudentProfilePage from "./pages/adm/student/StudentProfilePage";
import NewAtendimentoPage from "./pages/adm/servicesAtendimento/NewAtendimentoPage";
import NewAcompanhamentoPage from "./pages/adm/followUp/NewAcompanhamentoPage";
import AtendimentosPage from "./pages/adm/servicesAtendimento/AtendimentosPage";
import FollowUpPage from "./pages/adm/followUp/FollowUpPage";
import AtendimentoProfilePage from "./pages/adm/servicesAtendimento/AtendimentoProfilePage";
import FollowUpProfilePage from "./pages/adm/followUp/FollowUpProfilePage";
import EditFollowUpPage from "./pages/adm/followUp/EditFollowUpPage";
import EditAtendimentoPage from "./pages/adm/servicesAtendimento/EditAtendimentoPage";
import TeacherGuidanceListPage from "./pages/adm/teacherGuidance/TeacherGuidanceListPage";
import AdminPage from "./pages/adm/AdminPage";

// Páginas do Estudante
import StudentHomePage from "./pages/student/StudentHomePage";

import ResetPassword from "./pages/common/ResetPassword";



const routes = [
  { path: "/login", element: <Login /> },
  { path: "/resetar-senha", element: <ResetPassword /> },
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
          { path: "", element: <HomePage /> },
          {
            path: "alunos",
            children: [
              { path: "", element: <AlunosPage /> },
              { path: ":studentId", element: <StudentProfilePage /> },
              { path: ":studentId/novo-atendimento", element: <NewAtendimentoPage /> },
              { path: ":studentId/novo-acompanhamento", element: <NewAcompanhamentoPage /> },
            ],
          },
          { path: "professionals", element: <ProfissionaisPage /> },
          {
            path: "atendimentos",
            children: [
              { path: "", element: <AtendimentosPage /> },
              { path: ":atendimentoId", element: <AtendimentoProfilePage /> },
              { path: ":atendimentoId/edit", element: <EditAtendimentoPage /> },
            ],
          },
          {
            path: "orientacoes",
            element: <TeacherGuidanceListPage />
          },
          { path: "admin/config", element: <AdminPage /> },
          {
            path: "acompanhamentos",
            children: [
              { path: "", element: <FollowUpPage /> },
              { path: ":acompanhamentoId", element: <FollowUpProfilePage /> },
              { path: ":acompanhamentoId/edit", element: <EditFollowUpPage /> },
            ],
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={["ESTUDANTE"]} />,
    children: [
      {
        path: "/aluno",
        element: <AppLayout />,
        children: [
          { path: "", element: <StudentHomePage /> },
          { path: "atendimentos/:atendimentoId", element: <AtendimentoProfilePage /> },
          { path: "acompanhamentos/:acompanhamentoId", element: <FollowUpProfilePage /> },
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