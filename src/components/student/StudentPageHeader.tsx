// src/components/student/StudentPageHeader.tsx
import { Search, Plus } from 'lucide-react';
import Button from '../ui/Button';

interface StudentPageHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  onAddStudent: () => void; // 🔹 novo prop para acionar modal
}

export default function StudentPageHeader({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  onAddStudent,
}: StudentPageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      {/* Título */}
      <div>
        <h1 className="text-3xl font-bold text-ifpr-black">Lista de Estudantes</h1>
        <p className="mt-1 text-gray-600">Gerencie os estudantes cadastrados no sistema.</p>
      </div>

      {/* Busca + Filtro + Botão */}
      <div className="flex items-center gap-3">
        {/* Campo de busca */}
        <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm bg-white">
          <Search className="h-5 w-5 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Buscar por nome ou matrícula..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="outline-none border-none focus:ring-0"
          />
        </div>

        {/* Filtro de status */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="border rounded-lg px-3 py-2 shadow-sm bg-white text-gray-700 focus:ring-ifpr-green focus:border-ifpr-green"
        >
          <option value="ALL">Todos</option>
          <option value="ATIVO">Ativos</option>
          <option value="INATIVO">Inativos</option>
        </select>

        {/* Botão Adicionar Estudante */}
        <Button
          onClick={onAddStudent}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-ifpr-green text-white shadow-md hover:bg-green-700 transition font-medium"
        >
          <Plus className="h-5 w-5" /> Adicionar
        </Button>
      </div>
    </div>
  );
}
