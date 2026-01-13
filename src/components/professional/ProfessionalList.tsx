// components/ProfessionalList.tsx

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
    <div className="rounded-lg border bg-white shadow-sm mt-6 overflow-x-auto">
      {/* 2. Estrutura de Tabela */}
      <table className="w-full text-sm text-left">
        {/* 3. Thead padronizado */}
        <thead className="bg-gray-50 text-xs text-gray-600 uppercase">
          <tr>
            {/* 4. Th padronizado */}
            <th className="px-6 py-3">Nome</th>
            <th className="px-6 py-3">E-mail</th>
            <th className="px-6 py-3">Função</th>
            <th className="px-6 py-3">Especialidade</th>
            <th className="px-6 py-3 text-center">Status</th>
            <th className="px-6 py-3 text-center">Ações</th>
          </tr>
        </thead>
        {/* 5. Tbody padronizado */}
        <tbody className="divide-y">
          {professionals.map((professional) => (
            // 6. Tr padronizada
            <tr key={professional.id} className="hover:bg-gray-50 transition-colors">
              {/* 7. Td padronizada */}
              <td className="px-6 py-4 font-medium text-gray-900 truncate" title={professional.fullName}>
                {professional.fullName}
              </td>
              <td className="px-6 py-4 text-gray-600 truncate" title={professional.email}>
                {professional.email}
              </td>
              <td className="px-6 py-4 text-gray-600 truncate" title={professional.role}>
                {professional.role}
              </td>
              <td className="px-6 py-4 text-gray-600 truncate" title={professional.specialty}>
                {professional.specialty}
              </td>
              {/* Célula de Status (o conteúdo já estava centralizado pelo span) */}
              <td className="px-6 py-4 text-center">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${professional.active
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
                  }`}>
                  {professional.active ? 'ATIVO' : 'INATIVO'}
                </span>
              </td>
              {/* Célula de Ações (mantém flex para alinhar botões) */}
              <td className="px-6 py-4">
                <div className="flex items-center justify-center gap-2">
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}