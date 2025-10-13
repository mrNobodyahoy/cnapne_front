import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAtendimentoById } from '../../../services/atendimentoService';
import { LoaderCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
import AtendimentoEditForm from '../../../components/session/atendimento/AtendimentoEditForm';

export default function EditAtendimentoPage() {
    const { atendimentoId } = useParams<{ atendimentoId: string }>();

    const { data: atendimento, isLoading, isError } = useQuery({
        queryKey: ['atendimento', atendimentoId],
        queryFn: () => getAtendimentoById(atendimentoId!),
        enabled: !!atendimentoId,
    });

    if (isLoading) {
        return <div className="flex justify-center p-8"><LoaderCircle className="animate-spin text-ifpr-green h-8 w-8" /></div>;
    }

    if (isError || !atendimento) {
        return <div className="text-red-600 p-8"><AlertTriangle /> Erro ao carregar dados do atendimento.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Link to={`/atendimentos/${atendimentoId}`} className="inline-flex items-center gap-2 text-ifpr-green hover:underline mb-6">
                <ArrowLeft className="h-5 w-5" />
                Voltar para os detalhes
            </Link>

            <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h1 className="text-2xl font-bold text-gray-900">Editando Atendimento de</h1>
                <p className="mt-1 text-xl text-gray-600">{atendimento.student.completeName}</p>
            </div>

            <AtendimentoEditForm atendimento={atendimento} />
        </div>
    );
}