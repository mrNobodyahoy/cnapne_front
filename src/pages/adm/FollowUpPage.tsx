import { useFollowUpPage } from '../../hooks/useFollowUpPage';
import { LoaderCircle, AlertTriangle } from 'lucide-react';
import FollowUpList from '../../components/followUp/FollowUpList';
import Pagination from '../../components/ui/Pagination';

export default function FollowUpPage() {
    const { pageData, isLoading, isError, error, isFetching, page, setPage } = useFollowUpPage();

    if (isLoading) {
        return <div className="flex justify-center p-8"><LoaderCircle className="animate-spin text-ifpr-green h-8 w-8" /></div>;
    }

    if (isError) {
        return <div className="text-red-600 p-8"><AlertTriangle /> Erro ao carregar acompanhamentos: {error?.message}</div>;
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Gerenciar acompanhamentos</h1>
                <p className="mt-1 text-gray-600">Visualize, filtre e gerencie todos os acompanhamentos registrados.</p>
            </div>

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