import { Plus, Search } from 'lucide-react';
import Button from '../ui/Button';
import Select from '../ui/Select';
import { roleOptions } from './ProfessionalOptions';

interface Props {
    isFetching: boolean;
    searchTerm: string;
    onSearchChange: (value: string) => void;
    roleFilter: string;
    onRoleChange: (value: string) => void;
    statusFilter: string;
    onStatusChange: (value: string) => void;
    onAddProfessional: () => void;
}

export default function ProfessionalPageHeader({
    isFetching,
    searchTerm,
    onSearchChange,
    roleFilter,
    onRoleChange,
    statusFilter,
    onStatusChange,
    onAddProfessional,
}: Props) {
    return (
        <div className='mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
            <div>
                <h1 className="text-3xl font-bold text-ifpr-black">Lista de Profissionais</h1>
                <p className="mt-1 text-gray-600">Gerencie os profissionais cadastrados no sistema.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nome"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10 pr-3 py-2 border rounded-lg shadow-sm w-full sm:w-auto focus:ring-ifpr-green focus:border-ifpr-green"
                    />

                </div>

                <Select
                    id="roleFilter"
                    label=""
                    value={roleFilter}
                    onChange={(e) => onRoleChange(e.target.value)}
                    options={roleOptions}
                    placeholder="Todas as Funções"
                    className="min-w-[200px]"
                />

                <Select
                    id="statusFilter"
                    label=""
                    value={statusFilter}
                    onChange={(e) => onStatusChange(e.target.value)}
                    options={[
                        { value: 'ACTIVE', label: 'Ativos' },
                        { value: 'INACTIVE', label: 'Inativos' },
                    ]}
                    placeholder="Todos os Status"
                    className="min-w-[150px]"
                />

                <Button onClick={onAddProfessional} disabled={isFetching} className="flex items-center gap-2">
                    <Plus className="h-5 w-5" /> Adicionar
                </Button>
            </div>
        </div>
    );
}