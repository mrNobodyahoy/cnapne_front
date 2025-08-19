// src/pages/Login.tsx
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import AuthCard from "../components/AuthCard";
import { loginRequest, me } from "../services/authService";
import { useAuth } from "../store/auth";

const schema = z.object({
  email: z.string().email("Informe um e-mail válido."),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres."),
});
type FormData = z.infer<typeof schema>;

export default function Login() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const { setSession } = useAuth();

  const onSubmit = async (data: FormData) => {
    try {
      await loginRequest(data);           // cookie é setado aqui
      const meResp = await me();          // confirma sessão e pega email/role
      setSession(meResp);
      window.location.href = "/";         // dashboard
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    <div className="grid min-h-screen place-items-center bg-slate-50 p-4">
      <AuthCard title="Acessar o sistema">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input id="email" type="email" placeholder="seu.email@ifpr.edu.br" label="E-mail" autoComplete="username"
                 {...register("email")} error={errors.email?.message} />
          <Input id="password" type="password" placeholder="••••••••" label="Senha" autoComplete="current-password"
                 {...register("password")} error={errors.password?.message} />
          <Button type="submit" loading={isSubmitting}>Entrar</Button>
        </form>
      </AuthCard>
    </div>
  );
}
