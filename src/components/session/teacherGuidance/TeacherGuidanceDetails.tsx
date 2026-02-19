import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ClipboardPenLine, FileText, CheckCircle, Calendar, MapPin, User, Award } from 'lucide-react';
import type { ReadTeacherGuidance } from '../../../types/teacherGuidance';


const InfoField = ({ icon: Icon, label, value, className = '' }: { icon: any, label: string, value: string | undefined | null, className?: string }) => (
    <div className={className}>
        <div className="flex items-center text-sm font-medium text-gray-500">
            <Icon className="h-4 w-4 mr-2" />
            <span>{label}</span>
        </div>
        <p className="mt-1 text-base text-gray-800 break-words">{value || 'Não informado'}</p>
    </div>
);

interface Props {
    guidance: ReadTeacherGuidance;
}

export default function TeacherGuidanceDetails({ guidance }: Props) {
    return (
        <div className="space-y-6">
            <div className="flex items-center border-b pb-3 mb-4">
                <ClipboardPenLine className="h-6 w-6 text-ifpr-green mr-3" />
                <h2 className="text-xl font-bold text-gray-800">Detalhes da Orientação Pedagógica</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <InfoField
                    icon={User}
                    label="Autor(a)"
                    value={guidance.author?.fullName || 'N/A'}
                />
                <InfoField
                    icon={MapPin}
                    label="Local"
                    value={guidance.domiciliar ? 'Domiciliar' : 'Sala de Aula'}
                />
                <InfoField
                    icon={Calendar}
                    label="Data do Registro"
                    value={format(parseISO(guidance.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                />
                <InfoField
                    icon={Award}
                    label="Especialidade do Autor"
                    value={guidance.author?.specialty || 'N/A'}
                />
            </div>

            <div className="space-y-6">
                <InfoField
                    icon={FileText}
                    label="Detalhes da Orientação"
                    value={guidance.guidanceDetails}
                    className="col-span-1 md:col-span-2"
                />
                <InfoField
                    icon={CheckCircle}
                    label="Recomendações / Encaminhamentos"
                    value={guidance.recommendations}
                    className="col-span-1 md:col-span-2"
                />
            </div>

        </div>
    );
}