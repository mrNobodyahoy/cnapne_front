import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getStudentById } from '../../../services/studentService';
import { LoaderCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
import AtendimentoForm from '../../../components/session/atendimento/AtendimentoForm';
import AcompanhamentoForm from '../../../components/session/followUp/FollowUpForm';

export default function StudentSessionsPage() {
    const { studentId } = useParams<{ studentId: string }>();

    const { data: student, isLoading, isError } = useQuery({
        queryKey: ['student', studentId],
        queryFn: () => getStudentById(studentId!),
        enabled: !!studentId,
    });

    if (isLoading) {
        return <div className="flex justify-center p-8"><LoaderCircle className="animate-spin text-ifpr-green h-8 w-8" /></div>;
    }

    if (isError || !student) {
        return <div className="text-red-600 p-8"><AlertTriangle /> Erro ao carregar dados do estudante.</div>;
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <Link to="/alunos" className="inline-flex items-center gap-2 text-ifpr-green hover:underline mb-6">
                <ArrowLeft className="h-5 w-5" />
                Voltar para a lista de alunos
            </Link>

            <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h1 className="text-3xl font-bold text-gray-900">Criar Nova Sessão para</h1>
                <p className="mt-1 text-2xl text-gray-600">{student.completeName}</p>
                <p className="text-gray-500">Matrícula: {student.registration}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Formulário de Atendimentos */}
                <AtendimentoForm studentId={student.id} />

                {/* Formulário de Acompanhamentos */}
                <AcompanhamentoForm studentId={student.id} />
            </div>
        </div>
    );
}