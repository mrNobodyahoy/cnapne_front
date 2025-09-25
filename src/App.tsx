// src/App.tsx

import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { useAuth } from "./store/auth";
import { router } from "./router";
import { Toaster } from 'react-hot-toast';

export default function App() {
  const { initializeSession } = useAuth();

  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

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