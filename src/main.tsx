import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
// 1. Importe o QueryClient e o QueryClientProvider
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 2. Crie uma instância do cliente
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 3. Envolva toda a sua aplicação com o Provider, passando o cliente */}
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);