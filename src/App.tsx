// src/App.tsx

import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { useAuth } from "./store/auth";
import { router } from "./router"; // Importe o roteador que você criou

export default function App() {
  const { initializeSession } = useAuth();

  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  // Renderize apenas o RouterProvider com o roteador configurado
  return <RouterProvider router={router} />;
}