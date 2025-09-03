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
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const { setSession } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      const sessionData = await loginRequest(data);
      setSession(sessionData);

      const userRole: Role = sessionData.role;

      if (userRole === 'ESTUDANTE') {
        navigate("/dashboard");
      } else {
        navigate("/");
      }

    } catch (err: any) {
      const status = err?.response?.status;
      const message =
        status === 400 || status === 403
          ? "Credenciais inválidas."
          : "Erro ao autenticar. Tente novamente.";
      setError("password", { message });
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
      </AuthCard>
    </div>
  );
}