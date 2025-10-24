import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401 && location.pathname !== "/login") {
      toast.error("Sua sessão expirou. Por favor, faça login novamente.");
      sessionStorage.removeItem("cnapne-session");
      location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const setToken = (token: string) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const removeToken = () => {
  delete api.defaults.headers.common["Authorization"];
};

export default api;
