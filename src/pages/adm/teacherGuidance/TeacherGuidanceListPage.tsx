import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { LoaderCircle, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

import { getAllTeacherGuidances } from '../../../services/teacherGuidanceService';
import type { GetGuidancesParams, ReadTeacherGuidance } from '../../../types/teacherGuidance';
import { generateGuidancePdf } from '../../../lib/pdfGenerator';
import { useDebounce } from '../../../hooks/util/useDebounce';
import SessionPageHeader from '../../../components/session/SessionPageHeader';
import type { Option } from '../../../components/ui/Select';

import GuidanceTable from '../../../components/session/teacherGuidance/GuidanceTable';
import Pagination from '../../../components/ui/Pagination';

import Modal from '../../../components/ui/Modal';
import TeacherGuidanceDetails from '../../../components/session/teacherGuidance/TeacherGuidanceDetails';
import TeacherGuidanceForm from '../../../components/session/teacherGuidance/TeacherGuidanceForm';

const PAGE_SIZE = 10;

const localOptions: Option[] = [
    { value: '', label: 'Todos os Locais' },
    { value: 'false', label: 'Sala de Aula' },
    { value: 'true', label: 'Domiciliar' },
];

export default function TeacherGuidanceListPage() {
    const navigate = useNavigate();
    const [studentNameFilter, setStudentNameFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(0);

    const [localFilter, setLocalFilter] = useState<string>('');

    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedGuidance, setSelectedGuidance] = useState<ReadTeacherGuidance | undefined>(undefined);

    const debouncedStudentName = useDebounce(studentNameFilter, 500);

    const domiciliarValue = localFilter === '' ? undefined : localFilter === 'true';

    const queryParams: GetGuidancesParams = {
        page: currentPage,
        size: PAGE_SIZE,
        studentName: debouncedStudentName || undefined,
        domiciliar: domiciliarValue,
        sort: 'createdAt,desc',
    };

    const { data: pageData, isLoading, isError, error } = useQuery({
        queryKey: ['teacherGuidances', queryParams],
        queryFn: () => getAllTeacherGuidances(queryParams),
        placeholderData: (previousData) => previousData,
    });

    const handleViewDetails = (guidance: ReadTeacherGuidance) => {
        if (guidance.serviceId) {
            navigate(`/atendimentos/${guidance.serviceId}`);
        } else if (guidance.followUpId) {
            navigate(`/acompanhamentos/${guidance.followUpId}`);
        } else {
            toast.error("Esta orientação não está associada a uma sessão.");
            console.error("Orientação sem vínculo:", guidance.id);
        }
    };

    const handlePdfDownload = (e: React.MouseEvent, guidance: ReadTeacherGuidance) => {
        e.stopPropagation();
        const pdfPromise = new Promise<void>((resolve, reject) => {
            try {
                generateGuidancePdf(guidance);
                resolve();
            } catch (error) {
                console.error("Erro ao gerar PDF:", error);
                reject(error);
            }
        });
        toast.promise(
            pdfPromise,
            {
                loading: 'Gerando PDF...',
                success: 'PDF gerado com sucesso!',
                error: (err) => `Erro ao gerar PDF: ${err.message || ''}`,
            }
        );
    };

    const handleShowDetails = (guidance: ReadTeacherGuidance) => {
        setSelectedGuidance(guidance);
        setIsDetailsOpen(true);
    };

    const handleEdit = (guidance: ReadTeacherGuidance) => {
        setSelectedGuidance(guidance);
        setIsFormOpen(true);
    };

    const handleCloseModals = () => {
        setIsDetailsOpen(false);
        setIsFormOpen(false);
        setSelectedGuidance(undefined);
    };

    return (
        <div className="container mx-auto px-4 py-8 space-y-6">
            <SessionPageHeader
                title="Gerenciar Orientações"
                subtitle="Visualize e filtre todas as orientações pedagógicas registradas."
                searchTerm={studentNameFilter}
                onSearchChange={setStudentNameFilter}

                statusFilter={localFilter}
                onStatusChange={setLocalFilter}
                statusOptions={localOptions}
            />

            {isLoading && (
                <div className="flex justify-center items-center py-10">
                    <LoaderCircle className="animate-spin text-ifpr-green h-8 w-8" />
                    <span className="ml-2 text-gray-600">Carregando orientações...</span>
                </div>
            )}

            {isError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold"><AlertTriangle className="inline mr-2 h-5 w-5" />Erro!</strong>
                    <span className="block sm:inline ml-2">{error?.message || 'Não foi possível carregar as orientações.'}</span>
                </div>
            )}

            {!isLoading && !isError && pageData && (
                <GuidanceTable
                    guidances={pageData.content}
                    onViewDetails={handleViewDetails}
                    onPdfDownload={handlePdfDownload}
                    onEdit={handleEdit}
                    onShowDetails={handleShowDetails}
                />
            )}

            {pageData && pageData.totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={pageData.totalPages}
                    onPageChange={setCurrentPage}
                    isFetching={isLoading}
                />
            )}

            <Modal isOpen={isDetailsOpen} onClose={handleCloseModals}>
                {selectedGuidance && (
                    <TeacherGuidanceDetails guidance={selectedGuidance} />
                )}
            </Modal>

            <Modal isOpen={isFormOpen} onClose={handleCloseModals}>
                {selectedGuidance && (
                    <TeacherGuidanceForm
                        existingGuidance={selectedGuidance}
                        onClose={handleCloseModals}
                        serviceId={selectedGuidance.serviceId ?? undefined}
                        followUpId={selectedGuidance.followUpId ?? undefined}
                    />
                )}
            </Modal>
        </div>
    );
}