// src/App.tsx

import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { useAuth } from "./store/auth";
import { router } from "./router";
import { Toaster } from 'react-hot-toast';

export default function App() {
  // 1. Pegue também o 'isLoading' do seu hook
  const { initializeSession, isLoading } = useAuth();

  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  // 2. Adicione a verificação de carregamento inicial AQUI
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        {/* Você pode colocar um spinner/loader mais elaborado aqui se quiser */}
        <p className="text-lg text-gray-600">Carregando aplicação...</p>
      </div>
    );
  }

  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          className: '',
          duration: 5000,
          style: {
            background: '#333',
            color: '#fff',
            fontSize: '15px',
          },
        }}
      />
    </>
  );
}