import { useQuery } from '@tanstack/react-query';
import { getAllStudents } from '../services/studentService';
import { AlertTriangle, LoaderCircle } from 'lucide-react';
import type { Student } from '../types/student';

// 👇 A palavra 'default' é a correção.
export default function AlunosPage() {
  const { data: students, isLoading, isError, error } = useQuery<Student[], Error>({
    queryKey: ['students'],
    queryFn: getAllStudents,
  });

  // Estado de carregamento
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoaderCircle className="h-8 w-8 animate-spin text-ifpr-green" />
        <p className="ml-2 text-gray-600">Carregando estudantes...</p>
      </div>
    );
  }

  // Estado de erro
  if (isError) {
    return (
      <div className="rounded-md border border-red-300 bg-red-50 p-4 text-red-700">
        <div className="flex items-center">
          <AlertTriangle className="h-6 w-6 mr-2" />
          <p><strong>Erro:</strong> Não foi possível buscar os estudantes. {error.message}</p>
        </div>
      </div>
    );
  }

  // Estado de sucesso
  return (
    <div>
      <h1 className="text-3xl font-bold text-ifpr-black">Lista de Estudantes</h1>
      <p className="mt-1 text-gray-600">Gerencie os estudantes cadastrados no sistema.</p>

      <div className="mt-8 overflow-hidden rounded-lg border bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Nome Completo</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Matrícula</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">E-mail</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
              <th className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {students?.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{student.completeName}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{student.registration}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{student.email}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${student.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {student.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <a href="#" className="text-ifpr-green hover:underline">Editar</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!students || students.length === 0) && (
            <div className="p-8 text-center text-gray-500">
                Nenhum estudante encontrado.
            </div>
        )}
      </div>
    </div>
  );
}