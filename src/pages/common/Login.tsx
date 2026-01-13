// src/pages/Login.tsx

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { loginRequest, forgotPasswordRequest } from "../../services/authService";
import { useAuth } from "../../store/auth";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import AuthCard from "../../components/auth/AuthCard";
import logoIfpr from '../../assets/if-vertical.png';
import { toast } from 'react-hot-toast';
import { Globe, Mail } from "lucide-react";
import Modal from "../../components/ui/Modal";

const loginSchema = z.object({
  email: z.string().email("Informe um e-mail válido."),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres."),
});
type LoginFormData = z.infer<typeof loginSchema>;

const forgotPasswordSchema = z.object({
  email: z.string().email("Informe um e-mail válido para a recuperação."),
});
type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;


export default function Login() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: errorsLogin, isSubmitting: isSubmittingLogin },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: registerForgot,
    handleSubmit: handleSubmitForgot,
    formState: { errors: errorsForgot, isSubmitting: isSubmittingForgot },
    reset: resetForgotForm,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const { setSession } = useAuth();
  const navigate = useNavigate();

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      const sessionData = await loginRequest(data);
      setSession(sessionData);
      toast.success('Login realizado com sucesso!');

      if (sessionData.role === 'ESTUDANTE') {
        navigate('/aluno');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      const status = err?.response?.status;
      let finalMessage = "Erro no servidor. Tente novamente mais tarde.";
      if (status === 400 || status === 403) {
        finalMessage = "Credenciais inválidas.";
      }
      toast.error(finalMessage);
    }
  };

  const onForgotPasswordSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPasswordRequest(data);
      toast.success('Se um usuário com este e-mail existir, um link de recuperação foi enviado.');
      setIsModalOpen(false);
      resetForgotForm();
    } catch (err) {
      toast.error("Erro ao solicitar a recuperação. Tente novamente.");
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
        {/* Formulário de Login */}
        <form onSubmit={handleSubmitLogin(onLoginSubmit)} className="space-y-6">
          <Input id="email" type="email" placeholder="seu.email@ifpr.edu.br" label="E-mail" autoComplete="username" {...registerLogin("email")} error={errorsLogin.email?.message} />
          <Input id="password" type="password" placeholder="••••••••" label="Senha" autoComplete="current-password" {...registerLogin("password")} error={errorsLogin.password?.message} />

          <div className="text-right text-sm">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="font-medium text-ifpr-green hover:underline focus:outline-none"
            >
              Esqueceu sua senha?
            </button>
          </div>

          <Button type="submit" loading={isSubmittingLogin}>
            Entrar
          </Button>
        </form>

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
              href="mailto:cnapne.irati@ifpr.edu.br"
              className="flex items-center gap-2 hover:text-green-700 transition-colors"
            >
              <Mail size={18} />
              <span>cnapne.irati@ifpr.edu.br</span>
            </a>
          </div>
        </div>
      </AuthCard>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Recuperar Senha"
      >
        <form onSubmit={handleSubmitForgot(onForgotPasswordSubmit)} className="space-y-6">
          <p className="text-sm text-gray-600">
            Digite seu e-mail abaixo e enviaremos um link para você redefinir sua senha.
          </p>
          <Input
            id="forgot-email"
            type="email"
            placeholder="seu.email@ifpr.edu.br"
            label="E-mail de recuperação"
            {...registerForgot("email")}
            error={errorsForgot.email?.message}
          />
          <Button type="submit" loading={isSubmittingForgot}>
            Enviar Link de Recuperação
          </Button>
        </form>
      </Modal>
    </div>
  );
}