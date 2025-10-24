// src/pages/ResetPassword.tsx
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPasswordRequest } from "../../services/authService";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import AuthCard from "../../components/auth/AuthCard";
import { toast } from "react-hot-toast";
import { AlertTriangle } from "lucide-react";

const schema = z.object({
    password: z.string().min(6, "A nova senha deve ter pelo menos 6 caracteres."),
    passwordConfirmation: z.string()
}).refine(data => data.password === data.passwordConfirmation, {
    message: "As senhas não coincidem.",
    path: ["passwordConfirmation"],
});
type FormData = z.infer<typeof schema>;

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        if (!token) return;

        try {
            await resetPasswordRequest({ token, password: data.password });
            toast.success('Senha redefinida com sucesso! Você já pode fazer o login.');
            navigate('/login');
        } catch (err: any) {
            const status = err?.response?.status;
            let finalMessage = "Erro ao redefinir a senha.";
            if (status === 400) {
                finalMessage = "Token inválido ou expirado. Por favor, solicite a recuperação novamente.";
            }
            toast.error(finalMessage);
        }
    };

    if (!token) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <AuthCard>
                    <div className="text-center">
                        <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
                        <h1 className="mt-4 text-2xl font-bold text-ifpr-black">Link Inválido</h1>
                        <p className="mt-2 text-gray-600">
                            O link para redefinição de senha é inválido ou está faltando. Por favor, solicite a recuperação novamente a partir da página de login.
                        </p>
                        <Button onClick={() => navigate('/login')} className="mt-6">
                            Voltar para o Login
                        </Button>
                    </div>
                </AuthCard>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 p-4">
            <AuthCard>
                <h1 className="mb-8 text-center text-3xl font-bold text-ifpr-black">
                    Redefinir Senha
                </h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        label="Nova Senha"
                        {...register("password")}
                        error={errors.password?.message}
                    />
                    <Input
                        id="passwordConfirmation"
                        type="password"
                        placeholder="••••••••"
                        label="Confirme a Nova Senha"
                        {...register("passwordConfirmation")}
                        error={errors.passwordConfirmation?.message}
                    />
                    <Button type="submit" loading={isSubmitting}>
                        Salvar Nova Senha
                    </Button>
                </form>
            </AuthCard>
        </div>
    );
}