// src/components/student/StudentPageHeader.tsx
import { Search } from 'lucide-react';

interface StudentPageHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function StudentPageHeader({ searchTerm, onSearchChange }: StudentPageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-ifpr-black">Lista de Estudantes</h1>
        <p className="mt-1 text-gray-600">Gerencie os estudantes cadastrados no sistema.</p>
      </div>
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
    </div>
  );
}