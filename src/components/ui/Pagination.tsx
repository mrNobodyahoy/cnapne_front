import Button from './Button';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    isFetching: boolean;
}

export default function Pagination({ currentPage, totalPages, onPageChange, isFetching }: PaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between mt-6">
            <Button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 0 || isFetching}>
                Anterior
            </Button>
            <span className="text-sm text-gray-700">
                Página {currentPage + 1} de {totalPages}
            </span>
            <Button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage + 1 >= totalPages || isFetching}>
                Próxima
            </Button>
        </div>
    );
}