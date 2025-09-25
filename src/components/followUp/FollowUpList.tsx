import type { ReadFollowUp } from '../../types/followUp';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { Edit, Trash } from 'lucide-react';

interface AcompanhamentoListProps {
    acompanhamentos: ReadFollowUp[] | undefined;
}

export default function AcompanhamentoList({ acompanhamentos }: AcompanhamentoListProps) {
    if (!acompanhamentos || acompanhamentos.length === 0) {
        return <p className="text-center text-gray-500 mt-8">Nenhum acompanhamento encontrado.</p>;
    }

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
                        <th className="px-6 py-3 text-center">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {acompanhamentos.map(item => (
                        <tr key={item.sessionId} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium">{item.student.completeName}</td>
                            <td className="px-6 py-4 text-gray-600">{item.professionals.map(p => p.fullName).join(', ')}</td>
                            <td className="px-6 py-4">{format(parseISO(item.sessionDate), "dd/MM/yyyy", { locale: ptBR })}</td>
                            <td className="px-6 py-4">{item.description}</td>
                            <td className="px-6 py-4">{item.status}</td>
                            <td className="px-6 py-4">
                                <div className="flex justify-center gap-2">
                                    <Link to={`/acompanhamentos/${item.sessionId}`} className="text-blue-600 hover:text-blue-800 p-2"><Edit size={16} /></Link>
                                    <button className="text-red-600 hover:text-red-800 p-2"><Trash size={16} /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}