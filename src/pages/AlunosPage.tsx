import { useQuery } from '@tanstack/react-query';
import { getAllStudents } from '../services/studentService';
import { AlertTriangle, LoaderCircle } from 'lucide-react';
import type { Student } from '../types/student';

export default function AlunosPage() {
  const { data: students, isLoading, isError, error } = useQuery<Student[], Error>({
    queryKey: ['students'],
    queryFn: getAllStudents,
  });

  console.log('Status da Query:', { isLoading, isError, students, error });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoaderCircle className="h-8 w-8 animate-spin text-ifpr-green" />
        <p className="ml-2 text-gray-600">Carregando estudantes...</p>
      </div>
    );
  }

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

  return (
    <div className="w-full">
      {/* Container alinhado com a tabela */}
      <div className="max-w-5xl mx-auto">
        
        {/* Cabeçalho centralizado acima da tabela */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-ifpr-black">Lista de Estudantes</h1>
          <p className="mt-1 text-gray-600">
            Gerencie os estudantes cadastrados no sistema.
          </p>
        </div>

        {/* Tabela */}
        <div className="rounded-lg border bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Cabeçalho */} 
            <thead className="bg-gray-100 border-b-2 border-gray-300">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide text-gray-700">
                  Nome Completo
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide text-gray-700">
                  Matrícula
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide text-gray-700">
                  E-mail
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide text-gray-700">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wide text-gray-700">
                  Ações
                </th>
              </tr>
            </thead>

            {/* Corpo */}
            <tbody className="divide-y divide-gray-200 bg-white">
              {students?.map((student, idx) => (
                <tr
                  key={student.id}
                  className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}
                >
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {student.completeName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                    {student.registration}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                    {student.email}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        student.status === 'ATIVO'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-medium">
                    <a href="#" className="text-ifpr-green hover:underline">Editar</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Caso não existam estudantes */}
          {(!students || students.length === 0) && (
            <div className="p-8 text-center text-gray-500">
              Nenhum estudante encontrado.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
