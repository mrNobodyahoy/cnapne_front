// src/components/student/TimelineCard.tsx
import type { TimelineItem } from '../../types/student';
import { useNavigate } from 'react-router-dom';
import {
    ClipboardList,
    ClipboardCheck,
    MessageSquare,
    Users,
    Calendar,
    User,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '../../store/auth';
import toast from 'react-hot-toast';

interface TimelineCardProps {
    item: TimelineItem;
}

export default function TimelineCard({ item }: TimelineCardProps) {
    const navigate = useNavigate();
    const { session } = useAuth();
    const isStudent = session?.role === 'ESTUDANTE';

    if (item.type === 'ORIENTACAO') {
        const typeInfo = {
            label: 'Orientação',
            icon: MessageSquare,
            bgColor: 'bg-gray-100',
            textColor: 'text-gray-600',
            borderColor: 'bg-gray-400',
        };

        const handleClick = () => {
            if (item.serviceId) {
                navigate(`/atendimentos/${item.serviceId}`);
            }
            else if (item.followUpId) {
                navigate(`/acompanhamentos/${item.followUpId}`);
            }
            else {
                toast.error('Esta orientação não está vinculada a nenhuma sessão.');
                console.error(
                    'Orientação sem serviceId ou followUpId:',
                    item.id
                );
            }
        };

        return (
            <div
                onClick={handleClick}
                className="group flex gap-4 rounded-xl border bg-white shadow-sm cursor-pointer hover:border-ifpr-green hover:shadow-lg transition-all duration-200"
            >
                <div
                    className={cn('w-2 rounded-l-xl transition-colors', typeInfo.borderColor)}
                />
                <div className="flex flex-1 items-start gap-4 p-4">
                    <div
                        className={cn(
                            'p-3 rounded-full',
                            typeInfo.bgColor,
                            typeInfo.textColor
                        )}
                    >
                        <typeInfo.icon size={24} />
                    </div>
                    <div className="flex-1 space-y-1.5 min-w-0">
                        <p
                            className={cn(
                                'text-xs font-bold uppercase tracking-wider',
                                typeInfo.textColor
                            )}
                        >
                            {typeInfo.label}
                        </p>
                        <p className="text-gray-800 text-base line-clamp-2 break-all">
                            {item.guidanceDetails}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <User size={14} />
                            <span className="truncate">{item.authorName}</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 text-right">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Calendar size={14} />
                            <span>{format(parseISO(item.date), 'dd/MM/yyyy', { locale: ptBR })}</span>
                        </div>
                        <span
                            className={cn(
                                'px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap',
                                'bg-green-100 text-green-800'
                            )}
                        >
                            {item.status}
                        </span>
                    </div>
                </div>
            </div>
        );
    }


    const isService = item.type === 'ATENDIMENTO';
    const basePath = isStudent
        ? isService
            ? '/aluno/atendimentos'
            : '/aluno/acompanhamentos'
        : isService
            ? '/atendimentos'
            : '/acompanhamentos';

    const typeInfo = {
        label: isService ? 'Atendimento' : 'Acompanhamento',
        icon: isService ? ClipboardList : ClipboardCheck,
        bgColor: isService ? 'bg-blue-100' : 'bg-green-100',
        textColor: isService ? 'text-blue-600' : 'text-green-600',
        borderColor: isService ? 'bg-blue-400' : 'bg-green-400',
    };

    return (
        <div
            onClick={() => navigate(`${basePath}/${item.id}`)}
            className="group flex gap-4 rounded-xl border bg-white shadow-sm cursor-pointer hover:border-ifpr-green hover:shadow-lg transition-all duration-200"
        >
            <div className={cn('w-2 rounded-l-xl transition-colors', typeInfo.borderColor)} />
            <div className="flex flex-1 items-start gap-4 p-4">
                <div
                    className={cn('p-3 rounded-full', typeInfo.bgColor, typeInfo.textColor)}
                >
                    <typeInfo.icon size={24} />
                </div>
                <div className="flex-1 space-y-1.5 min-w-0">
                    <p
                        className={cn(
                            'text-xs font-bold uppercase tracking-wider',
                            typeInfo.textColor
                        )}
                    >
                        {typeInfo.label}
                    </p>
                    <p className="font-bold text-gray-800 text-base group-hover:text-ifpr-green transition-colors truncate">
                        {item.title}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Users size={14} />
                        <span className="truncate">{item.professionalNames.join(', ')}</span>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2 text-right">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Calendar size={14} />
                        <span>{format(parseISO(item.date), 'dd/MM/yyyy', { locale: ptBR })}</span>
                    </div>
                    <span
                        className={cn(
                            'px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap',
                            item.status === 'AGENDADO'
                                ? 'bg-blue-100 text-blue-800'
                                : item.status === 'REALIZADO'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                        )}
                    >
                        {item.status}
                    </span>
                </div>
            </div>
        </div>
    );
}