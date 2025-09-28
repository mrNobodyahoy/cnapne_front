import { useState } from 'react';
import { useDebounce } from '../../../hooks/useDebounce';
import { useFollowUpPage } from '../../../hooks/useFollowUpPage';
import { LoaderCircle, AlertTriangle } from 'lucide-react';
import SessionPageHeader from '../../../components/session/SessionPageHeader';
import FollowUpList from '../../../components/session/followUp/FollowUpList';
import Pagination from '../../../components/ui/Pagination';

export default function FollowUpPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const {
        pageData,
        isLoading,
        isError,
        error,
        isFetching,
        page,
        setPage
    } = useFollowUpPage({
        studentName: debouncedSearchTerm,
        status: statusFilter,
    });

    if (isLoading) {
        return <div className="flex justify-center p-8"><LoaderCircle className="animate-spin text-ifpr-green h-8 w-8" /></div>;
    }

    if (isError) {
        return <div className="text-red-600 p-8"><AlertTriangle /> Erro ao carregar acompanhamentos: {error?.message}</div>;
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-6">
            <SessionPageHeader
                title="Gerenciar Acompanhamentos"
                subtitle="Visualize, filtre e gerencie todos os acompanhamentos registrados."
                addItemPath="/acompanhamentos/novo"
                addItemLabel="Adicionar Acompanhamento"
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
            />

            <div className={`transition-opacity duration-300 ${isFetching ? 'opacity-50' : 'opacity-100'}`}>
                <FollowUpList acompanhamentos={pageData?.content} />
                <Pagination
                    currentPage={page}
                    totalPages={pageData?.totalPages ?? 0}
                    onPageChange={setPage}
                    isFetching={isFetching}
                />
            </div>
        </div>
    );
}