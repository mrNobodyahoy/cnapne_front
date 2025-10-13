import { Search } from 'lucide-react';
import Select from '../ui/Select';
import { statusOptions } from '../../lib/constants';


interface SessionPageHeaderProps {
    title: string;
    subtitle: string;
    searchTerm: string;
    onSearchChange: (value: string) => void;
    statusFilter: string;
    onStatusChange: (value: string) => void;
}

export default function SessionPageHeader({
    title,
    subtitle,
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusChange,
}: SessionPageHeaderProps) {

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
            </div>
        </div>
    );
}