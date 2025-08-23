import { useQuery } from '@tanstack/react-query';
import { getAllStudents } from '../services/studentService';
import { AlertTriangle, LoaderCircle, Plus } from 'lucide-react';
import type { Student } from '../types/student';
import StudentForm from '../components/student/StudentForm';
import { useState } from 'react';
import Button from '../components/ui/Button';

export default function AlunosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: students, isLoading, isError, error } = useQuery<Student[], Error>({
    queryKey: ['students'],
    queryFn: getAllStudents,
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
      <div className="max-w-5xl mx-auto">
        
        {/* Cabeçalho */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-ifpr-black">Lista de Estudantes</h1>
          <p className="mt-1 text-gray-600">Gerencie os estudantes cadastrados no sistema.</p>
        </div>

        {/* Tabela de estudantes */}
        <div className="rounded-lg border bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100 border-b-2 border-gray-300">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide text-gray-700">Nome Completo</th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide text-gray-700">Matrícula</th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide text-gray-700">E-mail</th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide text-gray-700">Status</th>
                <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wide text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {students?.map((student, idx) => (
                <tr key={student.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{student.completeName}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{student.registration}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{student.email}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${student.status === 'ATIVO' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
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

          {(!students || students.length === 0) && (
            <div className="p-8 text-center text-gray-500">
              Nenhum estudante encontrado.
            </div>
          )}
        </div>

        {/* Botão embaixo no canto direito */}
        <div className="flex justify-end mt-4">
          <Button onClick={openModal} className="flex items-center gap-2 px-5 py-2 rounded-lg bg-ifpr-green text-white shadow hover:bg-green-700 transition">
            <Plus className="h-5 w-5" />
            Adicionar Estudante
          </Button>
        </div>
      </div>

      {/* Modal de criação */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-8 shadow-2xl w-full max-w-2xl">
            <StudentForm onClose={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
}
