import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAcompanhamentoById } from '../../../services/followUpService';
import { LoaderCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
import FollowUpEditForm from '../../../components/session/followUp/FollowUpEditForm';

export default function EditAcompanhamentoPage() {
    const { acompanhamentoId } = useParams<{ acompanhamentoId: string }>();

    const { data: acompanhamento, isLoading, isError } = useQuery({
        queryKey: ['acompanhamento', acompanhamentoId],
        queryFn: () => getAcompanhamentoById(acompanhamentoId!),
        enabled: !!acompanhamentoId,
    });

    if (isLoading) {
        return <div className="flex justify-center p-8"><LoaderCircle className="animate-spin text-ifpr-green h-8 w-8" /></div>;
    }

    if (isError || !acompanhamento) {
        return <div className="text-red-600 p-8"><AlertTriangle /> Erro ao carregar dados do acompanhamento.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Link to={`/acompanhamentos/${acompanhamentoId}`} className="inline-flex items-center gap-2 text-ifpr-green hover:underline mb-6">
                <ArrowLeft className="h-5 w-5" />
                Voltar para os detalhes
            </Link>

            <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h1 className="text-2xl font-bold text-gray-900">Editando Acompanhamento de</h1>
                <p className="mt-1 text-xl text-gray-600">{acompanhamento.student.completeName}</p>
            </div>

            <FollowUpEditForm followUp={acompanhamento} />
        </div>
    );
}