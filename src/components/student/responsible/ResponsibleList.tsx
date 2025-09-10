// src/components/student/ResponsibleList.tsx
import type { ResponsibleDTO } from '../../../types/student';
import { UserSquare } from 'lucide-react';

interface ResponsibleListProps {
  responsibles: ResponsibleDTO[];
}

export default function ResponsibleList({ responsibles }: ResponsibleListProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
        Responsáveis Cadastrados
      </h2>
      <div className="space-y-4">
        {responsibles.map((resp, index) => (
          <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 border">
            <UserSquare className="h-8 w-8 text-ifpr-green mt-1" />
            <div>
              <p className="font-bold text-gray-900">{resp.completeName}</p>
              <span className="text-sm font-medium text-gray-600 bg-gray-200 px-2 py-0.5 rounded">
                {resp.kinship}
              </span>
              <div className="text-sm text-gray-500 mt-2 space-y-1">
                <p><strong>Email:</strong> {resp.email || 'Não informado'}</p>
                <p><strong>Telefone:</strong> {resp.phone}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}