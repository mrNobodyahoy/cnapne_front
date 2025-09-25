import type { ReadProfessionalDTO } from '../../types/professional';
import { Edit, Trash, LoaderCircle } from 'lucide-react';
import type { UseMutationResult } from '@tanstack/react-query';

interface ProfessionalListProps {
  professionals: ReadProfessionalDTO[] | undefined;
  onEdit: (professional: ReadProfessionalDTO) => void;
  onDelete: (id: string, name: string) => void;
  deleteMutation: UseMutationResult<void, Error, string, unknown>;
}

export default function ProfessionalList({ professionals, onEdit, onDelete, deleteMutation }: ProfessionalListProps) {
  if (!professionals || professionals.length === 0) {
    return (
      <div className="rounded-lg border bg-white shadow-sm p-6 text-center text-gray-500 mt-6">
        Nenhum profissional encontrado com os filtros selecionados.
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white shadow-sm mt-6">
      <div className="grid grid-cols-12 gap-4 p-4 font-semibold text-sm text-gray-600 border-b bg-gray-50 uppercase tracking-wider">
        <div className="col-span-3">Nome</div>
        <div className="col-span-3">E-mail</div>
        <div className="col-span-2">Função</div>
        <div className="col-span-2">Especialidade</div>
        <div className="col-span-1 text-center">Status</div>
        <div className="col-span-1 text-center">Ações</div>
      </div>

      <ul className="divide-y divide-gray-200">
        {professionals.map((professional) => (
          <li key={professional.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 transition-colors text-sm">
            {/* Coluna 1: Nome */}
            <div className="col-span-3 font-medium text-gray-900 truncate" title={professional.fullName}>
              {professional.fullName}
            </div>
            {/* Coluna 2: E-mail */}
            <div className="col-span-3 text-gray-600 truncate" title={professional.email}>
              {professional.email}
            </div>
            {/* Coluna 3: Função */}
            <div className="col-span-2 text-gray-600 truncate" title={professional.role}>
              {professional.role}
            </div>
            {/* Coluna 4: Especialidade */}
            <div className="col-span-2 text-gray-600 truncate" title={professional.specialty}>
              {professional.specialty}
            </div>
            {/* Coluna 5: Status */}
            <div className="col-span-1 flex justify-center">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${professional.active
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
                }`}>
                {professional.active ? 'ATIVO' : 'INATIVO'}
              </span>
            </div>
            {/* Coluna 6: Ações */}
            <div className="col-span-1 flex items-center justify-center gap-2">
              <button
                onClick={() => onEdit(professional)}
                className="p-2 rounded-full text-ifpr-green hover:bg-green-50 hover:text-green-700 transition"
                title="Editar Profissional"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(professional.id, professional.fullName)}
                className="p-2 rounded-full text-red-500 hover:bg-red-50 hover:text-red-700 transition"
                title="Deletar Profissional"
                disabled={deleteMutation.isPending && deleteMutation.variables === professional.id}
              >
                {deleteMutation.isPending && deleteMutation.variables === professional.id ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash className="h-4 w-4" />
                )}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}