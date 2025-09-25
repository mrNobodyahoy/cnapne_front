// src/pages/Login.tsx
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../../services/authService";
import { useAuth, type Role } from "../../store/auth";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import AuthCard from "../../components/auth/AuthCard";
import logoIfpr from '../../assets/if-vertical.png';
import { toast } from 'react-hot-toast';

import { Globe, Phone } from "lucide-react";

const schema = z.object({
  email: z.string().email("Informe um e-mail válido."),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres."),
});
type FormData = z.infer<typeof schema>;

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const { setSession } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      const sessionData = await loginRequest(data);
      setSession(sessionData);
      toast.success('Login realizado com sucesso!');

      const userRole: Role = sessionData.role;
      if (userRole === 'ESTUDANTE') {
        navigate("/dashboard");
      } else {
        navigate("/");
      }

    } catch (err: any) {

      const status = err?.response?.status;
      const errorMessage = err?.response?.data?.message;

      let finalMessage: string;

      if (status === 403 && errorMessage?.includes("menores de 18 anos")) {
        finalMessage = errorMessage;
      } else if (status === 400 || status === 403) {
        finalMessage = "Credenciais inválidas.";
      } else {
        finalMessage = "Erro no servidor. Tente novamente mais tarde.";
      }

      toast.error(finalMessage);
    }
  };
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 p-4">
      <div className="absolute top-8 left-8">
        <img src={logoIfpr} alt="Logo do IFPR" className="h-20 w-auto" />
      </div>
      <AuthCard>
        <h1 className="mb-8 text-center text-3xl font-bold text-ifpr-black">
          Login
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input id="email" type="email" placeholder="seu.email@ifpr.edu.br" label="E-mail" autoComplete="username" {...register("email")} error={errors.email?.message} />
          <Input id="password" type="password" placeholder="••••••••" label="Senha" autoComplete="current-password" {...register("password")} error={errors.password?.message} />
          <Button type="submit" loading={isSubmitting}>
            Entrar
          </Button>
        </form>

        {/* Contato CNAPNE */}
        <div className="mt-8 border-t pt-4 text-center text-sm text-gray-600">
          <p className="mb-2 font-medium">Contato CNAPNE</p>
          <div className="flex items-center justify-center gap-6">
            <a
              href="https://ifpr.edu.br/irati/cnapne/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-green-700 transition-colors"
            >
              <Globe size={18} />
              <span>Site IFPR</span>
            </a>
            <a
              href="api.whatsapp.com/send/?text=CNAPNE+https%3A%2F%2Fifpr.edu.br%2Firati%2Fcnapne%2F&type=custom_url&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-green-700 transition-colors"
            >
              <Phone size={18} />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </AuthCard>
    </div>
  );
}
