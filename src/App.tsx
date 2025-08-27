  import { BrowserRouter, Routes, Route } from "react-router-dom";

  // Páginas e componentes de rota
  import Login from "./pages/Login";
  import ProtectedRoute from "./routes/protectedRoutes";
  import AppLayout from "./layouts/AppLayout";
  import HomePage from "./pages/HomePage";
  import AlunosPage from "./pages/AlunosPage"; 
  import ProfissionaisPage from "./pages/ProfessionalsPage";


  export default function App() {
    return (
      <BrowserRouter>
        <Routes>
          {/* Rota pública: a página de login não tem a sidebar */}
          <Route path="/login" element={<Login />} />

          {/* Grupo de rotas protegidas que usarão o layout principal */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            {/* A rota "index" é a página padrão a ser exibida em "/" */}
            <Route index element={<HomePage />} />

            {/* Outras páginas filhas também herdarão o AppLayout */}
            <Route path="alunos" element={<AlunosPage />} />
            
            {/* Exemplo: <Route path="configuracoes" element={<SuaPaginaDeConfig />} /> */}
            <Route path="professionals" element={<ProfissionaisPage/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  }