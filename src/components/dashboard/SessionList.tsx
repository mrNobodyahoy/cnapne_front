import { Link } from 'react-router-dom';
import { type LucideIcon } from 'lucide-react';
import { type ReadService } from '../../types/atendimento';
import { type ReadFollowUp } from '../../types/followUp';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, UserCircle, Users } from 'lucide-react';


type Session = ReadService | ReadFollowUp;

interface SessionListProps {
    title: string;
    sessions: Session[] | undefined;
    icon: LucideIcon;
    isLoading: boolean;
    basePath: 'atendimentos' | 'acompanhamentos';
}

const SessionListSkeleton = () => (
    <div className="space-y-3 animate-pulse">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-gray-100 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
            </div>
        ))}
    </div>
);

export default function SessionList({ title, sessions, icon: Icon, isLoading, basePath }: SessionListProps) {
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center border-b pb-3 mb-4">
                <Icon className="h-6 w-6 text-ifpr-green mr-3" />
                <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            </div>

            {isLoading ? (
                <SessionListSkeleton />
            ) : !sessions || sessions.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Nenhum registro encontrado.</p>
            ) : (
                <ul className="space-y-2 divide-y divide-gray-100">
                    {sessions.slice(0, 5).map((session) => (
                        <li key={session.sessionId}>
                            <Link
                                to={`/${basePath}/${session.sessionId}`}
                                className="block p-4 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="space-y-2">
                                    {/* TÍTULO */}
                                    <h3 className="font-bold text-gray-800">
                                        {'typeService' in session ? session.typeService : session.description}
                                    </h3>

                                    <div className="flex items-center text-sm text-gray-600">
                                        <UserCircle className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                                        <span className="font-semibold mr-1.5">Aluno:</span>
                                        <span className="truncate">{session.student.completeName}</span>
                                    </div>

                                    <div className="flex items-center text-sm text-gray-600">
                                        <Users className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                                        <span className="font-semibold mr-1.5">Profissional(ais):</span>
                                        <span className="truncate">{session.professionals.map(p => p.fullName).join(', ')}</span>
                                    </div>

                                    {/* DATA E STATUS */}
                                    <div className="flex items-center gap-4 text-xs text-gray-500 pt-2">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="h-4 w-4" />
                                            <span>{format(parseISO(session.sessionDate), "dd/MM/yyyy", { locale: ptBR })}</span>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded-full font-medium ${session.status === 'Agendado' ? 'bg-blue-100 text-blue-700' :
                                            session.status === 'Realizado' || session.status === 'Concluído' ? 'bg-green-100 text-green-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {session.status}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}