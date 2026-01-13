import type { ReadTeacherGuidance } from '../../../types/teacherGuidance';
import GuidanceTableRow from './GuidanceTableRow';

interface Props {
    guidances: ReadTeacherGuidance[] | undefined;
    onViewDetails: (guidance: ReadTeacherGuidance) => void;
    onShowDetails: (guidance: ReadTeacherGuidance) => void;
    onEdit: (guidance: ReadTeacherGuidance) => void;
    onPdfDownload: (e: React.MouseEvent, guidance: ReadTeacherGuidance) => void;
}

export default function GuidanceTable({
    guidances,
    onViewDetails,
    onShowDetails,
    onEdit,
    onPdfDownload,
}: Props) {
    if (!guidances || guidances.length === 0) {
        return (
            <p className="text-center text-gray-500 mt-8">
                Nenhuma orientação encontrada.
            </p>
        );
    }

    return (
        <div className="flex justify-center mt-6">
            <div className="rounded-lg border bg-white shadow-sm overflow-x-auto max-w-7xl w-full">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-xs text-gray-600 uppercase">
                        <tr>
                            <th scope="col" className="px-6 py-3">Aluno</th>
                            <th scope="col" className="px-6 py-3">Autor(a)</th>
                            <th scope="col" className="px-6 py-3">Data</th>
                            <th scope="col" className="px-6 py-3">Local</th>
                            <th scope="col" className="px-6 py-3 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {guidances.map((guidance) => (
                            <GuidanceTableRow
                                key={guidance.id}
                                guidance={guidance}
                                onViewDetails={onViewDetails}
                                onShowDetails={onShowDetails}
                                onEdit={onEdit}
                                onPdfDownload={onPdfDownload}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
