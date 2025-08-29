import { useAuth } from "../store/auth";

export default function StudentDashboardPage() {
  const { session } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">
        Bem-vindo(a), {session?.email}!
      </h1>
      <p className="mt-2 text-gray-600">
        Este é o seu painel de estudante.
      </p>
    </div>
  );
}