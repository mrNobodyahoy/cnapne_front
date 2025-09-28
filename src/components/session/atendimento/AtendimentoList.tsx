import type { ReadService } from '../../../types/atendimento';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

interface AtendimentoListProps {
    atendimentos: ReadService[] | undefined;
}

export default function AtendimentoList({ atendimentos }: AtendimentoListProps) {
    const navigate = useNavigate();

    if (!atendimentos || atendimentos.length === 0) {
        return <p className="text-center text-gray-500 mt-8">Nenhum atendimento encontrado.</p>;
    }

    const handleRowClick = (id: string) => {
        navigate(`/atendimentos/${id}`);
    };

    return (
        <div className="rounded-lg border bg-white shadow-sm mt-6 overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-xs text-gray-600 uppercase">
                    <tr>
                        <th className="px-6 py-3">Aluno</th>
                        <th className="px-6 py-3">Profissionais</th>
                        <th className="px-6 py-3">Data</th>
                        <th className="px-6 py-3">Tipo</th>
                        <th className="px-6 py-3">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {atendimentos.map(atendimento => (
                        <tr
                            key={atendimento.sessionId}
                            className="hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleRowClick(atendimento.sessionId)}
                        >
                            <td className="px-6 py-4 font-medium">{atendimento.student.completeName}</td>
                            <td className="px-6 py-4 text-gray-600">{atendimento.professionals.map(p => p.fullName).join(', ')}</td>
                            <td className="px-6 py-4">{format(parseISO(atendimento.sessionDate), "dd/MM/yyyy", { locale: ptBR })}</td>
                            <td className="px-6 py-4">{atendimento.typeService}</td>
                            <td className="px-6 py-4">{atendimento.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}