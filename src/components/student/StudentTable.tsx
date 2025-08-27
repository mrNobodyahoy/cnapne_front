// src/components/student/StudentTable.tsx
import type { Student } from '../../types/student';
import type { UseMutationResult } from '@tanstack/react-query';
import { FileArchive, Edit, Trash, LoaderCircle } from 'lucide-react';
import Button from '../ui/Button';

interface StudentTableProps {
  students: Student[] | undefined;
  onOpenDocuments: (student: Student) => void;
  onEdit: (student: Student) => void;
  onDelete: (id: string, name: string) => void;
  deleteMutation: UseMutationResult<void, Error, string, unknown>;
}

export default function StudentTable({ students, onOpenDocuments, onEdit, onDelete, deleteMutation }: StudentTableProps) {
  if (!students || students.length === 0) {
    return <div className="p-8 text-center text-gray-500">Nenhum estudante encontrado.</div>;
  }

  return (
    <div className="rounded-lg border bg-white shadow-sm overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        {/* ... seu thead ... */}
        <thead className="bg-gray-100 border-b-2 border-gray-300">
            {/*...cabeçalho da tabela...*/}
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {students.map((student, idx) => (
            <tr key={student.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{student.completeName}</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{student.registration}</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{student.email}</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${student.status === 'ATIVO' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {student.status}
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-medium flex justify-center gap-2">
                <Button onClick={() => onOpenDocuments(student)} className="text-blue-500 hover:text-blue-700 transition" title="Gerenciar Documentos">
                  <FileArchive className="h-4 w-4" />
                </Button>
                <Button onClick={() => onEdit(student)} className="text-ifpr-green hover:text-green-700 transition" title="Editar Estudante">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button onClick={() => onDelete(student.id, student.completeName)} className="text-red-500 hover:text-red-700 transition" title="Deletar Estudante" disabled={deleteMutation.isPending}>
                  {deleteMutation.isPending && deleteMutation.variables === student.id ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Trash className="h-4 w-4" />}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}