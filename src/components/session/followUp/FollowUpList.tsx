import type { ReadFollowUp } from '../../../types/followUp';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

interface AcompanhamentoListProps {
    acompanhamentos: ReadFollowUp[] | undefined;
}

export default function AcompanhamentoList({ acompanhamentos }: AcompanhamentoListProps) {
    const navigate = useNavigate();

    if (!acompanhamentos || acompanhamentos.length === 0) {
        return <p className="text-center text-gray-500 mt-8">Nenhum acompanhamento encontrado.</p>;
    }

    const handleRowClick = (id: string) => {
        navigate(`/acompanhamentos/${id}`);
    };

    return (
        <div className="rounded-lg border bg-white shadow-sm mt-6 overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-xs text-gray-600 uppercase">
                    <tr>
                        <th className="px-6 py-3">Aluno</th>
                        <th className="px-6 py-3">Profissionais</th>
                        <th className="px-6 py-3">Data</th>
                        <th className="px-6 py-3">Descrição</th>
                        <th className="px-6 py-3">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {acompanhamentos.map(item => (
                        <tr
                            key={item.sessionId}
                            className="hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleRowClick(item.sessionId)}
                        >
                            <td className="px-6 py-4 font-medium">{item.student.completeName}</td>
                            <td className="px-6 py-4 text-gray-600">{item.professionals.map(p => p.fullName).join(', ')}</td>
                            <td className="px-6 py-4">{format(parseISO(item.sessionDate), "dd/MM/yyyy", { locale: ptBR })}</td>
                            <td className="px-6 py-4 truncate max-w-xs">{item.description}</td>
                            <td className="px-6 py-4">{item.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}