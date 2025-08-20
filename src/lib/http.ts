// src/lib/http.ts
import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1', // URL DEFINIDA DIRETAMENTE
  timeout: 10000,
  withCredentials: true, // 🔑 envia/recebe o cookie automaticamente
});


// nada de Authorization header (jwt é HttpOnly)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401 && location.pathname !== "/login") {
      // sessão inválida/expirada
      sessionStorage.removeItem("cnapne-session"); // guardamos apenas dados não-sensíveis (role/email)
      location.href = "/login";
    }
    return Promise.reject(err);
  }
);
// Em src/main.tsx ou src/lib/http.ts

console.log("Variável de ambiente VITE_API_URL:", import.meta.env.VITE_API_URL);

// ... resto do código do arquivo
export default api;
