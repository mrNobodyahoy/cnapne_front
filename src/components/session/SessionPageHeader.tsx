import { Search, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import Select from '../ui/Select';
import { statusOptions } from '../../lib/constants';


interface SessionPageHeaderProps {
    title: string;
    subtitle: string;
    addItemPath: string;
    addItemLabel: string;
    searchTerm: string;
    onSearchChange: (value: string) => void;
    statusFilter: string;
    onStatusChange: (value: string) => void;
}

export default function SessionPageHeader({
    title,
    subtitle,
    addItemPath,
    addItemLabel,
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusChange,
}: SessionPageHeaderProps) {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                <p className="mt-1 text-gray-600">{subtitle}</p>
            </div>

            <div className="flex w-full flex-col sm:w-auto sm:flex-row sm:items-center gap-3">
                <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm bg-white focus-within:ring-2 focus-within:ring-ifpr-green focus-within:border-ifpr-green">
                    <Search className="h-5 w-5 text-gray-500 mr-2" />
                    <input
                        id="search-session"
                        type="text"
                        placeholder="Buscar por nome do aluno..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="outline-none border-none focus:ring-0 bg-transparent w-full sm:w-56"
                    />
                </div>

                <Select
                    id="status-filter"
                    label=""
                    className="w-full sm:w-48"
                    options={statusOptions}
                    value={statusFilter}
                    onChange={(e) => onStatusChange(e.target.value)}
                />

                <Button
                    onClick={() => navigate(addItemPath)}
                    className="flex items-center justify-center gap-2 whitespace-nowrap"
                >
                    <Plus className="h-5 w-5" /> {addItemLabel}
                </Button>
            </div>
        </div>
    );
}