import { useStudentTimeline } from '../../hooks/student/useStudentTimeline';
import { LoaderCircle, AlertTriangle } from 'lucide-react';
import TimelineCard from './TimelineCard';

export default function StudentTimeline({ studentId }: { studentId: string }) {
    const { groupedTimeline, isLoading, isError } = useStudentTimeline(studentId);

    if (isLoading) {
        return <div className="flex justify-center p-8"><LoaderCircle className="animate-spin" /></div>;
    }

    if (isError) {
        return <div className="text-red-600"><AlertTriangle /> Erro ao carregar histórico.</div>;
    }

    const months = Object.keys(groupedTimeline);

    if (months.length === 0) {
        return <p className="text-center text-gray-500 py-8">Nenhum atendimento ou acompanhamento registrado para este aluno.</p>;
    }

    return (
        <div className="relative">
            {months.map((month, index) => (
                <div key={month} className="relative pl-8 pb-8">

                    {index !== months.length - 1 && (
                        <div className="absolute left-4 top-5 h-full w-px bg-gray-200"></div>
                    )}
                    <div className="absolute left-4 top-2 -ml-[5px] h-3 w-3 rounded-full bg-ifpr-green ring-4 ring-white"></div>

                    <div>
                        <h3 className="font-bold text-lg text-gray-700 mb-4">{month}</h3>
                        <div className="space-y-4">
                            {groupedTimeline[month].map(item => (
                                <TimelineCard key={item.id} item={item} />
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}