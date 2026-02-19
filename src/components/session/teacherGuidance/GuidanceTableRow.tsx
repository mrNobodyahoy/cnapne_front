import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Eye, Edit, FileDown } from 'lucide-react';
import type { ReadTeacherGuidance } from '../../../types/teacherGuidance';
import Button from '../../ui/Button';

interface Props {
    guidance: ReadTeacherGuidance;
    onViewDetails: (guidance: ReadTeacherGuidance) => void;
    onShowDetails: (guidance: ReadTeacherGuidance) => void;
    onEdit: (guidance: ReadTeacherGuidance) => void;
    onPdfDownload: (e: React.MouseEvent, guidance: ReadTeacherGuidance) => void;
}

export default function GuidanceTableRow({
    guidance,
    onViewDetails,
    onShowDetails,
    onEdit,
    onPdfDownload,
}: Props) {
    return (
        <tr
            key={guidance.id}
            className="hover:bg-gray-100 cursor-pointer"
            onClick={() => onShowDetails(guidance)}
        >
            <td className="px-6 py-4 font-medium text-gray-900 truncate max-w-xs">
                {guidance.student.completeName}
            </td>

            <td className="px-6 py-4 text-gray-600 truncate max-w-xs">
                {guidance.author?.fullName || 'N/A'}
            </td>

            <td className="px-6 py-4 text-gray-600">
                {format(parseISO(guidance.createdAt), "dd/MM/yyyy", { locale: ptBR })}
            </td>
            <td className="px-6 py-4 text-gray-600">
                {guidance.domiciliar ? 'Domiciliar' : 'Sala de Aula'}
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center justify-center gap-2">
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            onViewDetails(guidance);
                        }}
                        variant="outline"
                        className="p-1 h-auto"
                        title="Ver Atendimento/Acompanhamento"
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(guidance);
                        }}
                        variant="outline"
                        className="p-1 h-auto text-ifpr-green hover:text-ifpr-green"
                        title="Editar"
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            onPdfDownload(e, guidance);
                        }}
                        variant="outline"
                        className="p-1 h-auto"
                        title="Gerar PDF"
                    >
                        <FileDown className="h-4 w-4" />
                    </Button>
                </div>
            </td>
        </tr>
    );
}