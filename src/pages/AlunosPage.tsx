import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  getAllStudents,
  deleteStudent,
  searchStudentsByName,
  searchStudentsByRegistration,
} from '../services/studentService';
import {
  AlertTriangle,
  LoaderCircle,
  Plus,
  Edit,
  Trash,
  FileArchive,
  Search,
} from 'lucide-react';
import type { Student } from '../types/student';
import StudentForm from '../components/student/StudentForm';
import StudentEditForm from '../components/student/StudentEditForm';
import { useState } from 'react';
import Button from '../components/ui/Button';
import StudentDocumentsModal from '../components/document/StudentDocumentsModal';

export default function AlunosPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [isDocumentsModalOpen, setIsDocumentsModalOpen] = useState(false);
  const [studentForDocs, setStudentForDocs] = useState<Student | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'name' | 'registration'>('name');

  const queryClient = useQueryClient();

  const { data: students, isLoading, isError, error } = useQuery<Student[], Error>({
    queryKey: ['students', searchTerm, searchType],
    queryFn: async () => {
      if (!searchTerm.trim()) return getAllStudents();
      if (searchType === 'name') return searchStudentsByName(searchTerm);
      return searchStudentsByRegistration(searchTerm);
    },
    placeholderData: keepPreviousData, // ✅ substitui o antigo keepPreviousData
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteStudent(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['students'] }),
    onError: (err: any) =>
      alert('Erro ao deletar estudante: ' + err.message),
  });

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const openEditModal = (student: Student) => {
    setStudentToEdit(student);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setStudentToEdit(null);
    setIsEditModalOpen(false);
  };

  const openDocumentsModal = (student: Student) => {
    setStudentForDocs(student);
    setIsDocumentsModalOpen(true);
  };
  const closeDocumentsModal = () => {
    setStudentForDocs(null);
    setIsDocumentsModalOpen(false);
  };

  const handleDeleteStudent = (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja deletar o estudante ${name}?`)) {
      deleteMutation.mutate(id);
    }
  };

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
          <p>
            <strong>Erro:</strong> Não foi possível buscar os estudantes.{' '}
            {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="max-w-5xl mx-auto">
        {/* Cabeçalho */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-ifpr-black">
              Lista de Estudantes
            </h1>
            <p className="mt-1 text-gray-600">
              Gerencie os estudantes cadastrados no sistema.
            </p>
          </div>

          {/* Barra de busca */}
          <div className="flex items-center gap-2">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as 'name' | 'registration')}
              className="rounded-lg border-gray-300 text-sm focus:border-ifpr-green focus:ring-ifpr-green"
            >
              <option value="name">Nome</option>
              <option value="registration">Matrícula</option>
            </select>
            <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm bg-white">
              <Search className="h-5 w-5 text-gray-500 mr-2" />
              <input
                type="text"
                placeholder={
                  searchType === 'name'
                    ? 'Buscar por nome...'
                    : 'Buscar por matrícula...'
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="outline-none border-none focus:ring-0"
              />
            </div>
          </div>
        </div>

        {/* Tabela de estudantes */}
        <div className="rounded-lg border bg-white shadow-sm overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
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
            <tbody className="divide-y divide-gray-200 bg-white">
              {students?.map((student, idx) => (
                <tr
                  key={student.id}
                  className={`${
                    idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } hover:bg-gray-100`}
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
                  <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-medium flex justify-center gap-2">
                    <Button
                      onClick={() => openDocumentsModal(student)}
                      className="text-blue-500 hover:text-blue-700 transition"
                      title="Gerenciar Documentos"
                    >
                      <FileArchive className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => openEditModal(student)}
                      className="text-ifpr-green hover:text-green-700 transition"
                      title="Editar Estudante"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() =>
                        handleDeleteStudent(student.id, student.completeName)
                      }
                      className="text-red-500 hover:text-red-700 transition"
                      title="Deletar Estudante"
                      disabled={deleteMutation.isPending}
                    >
                      {deleteMutation.isPending &&
                      deleteMutation.variables === student.id ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash className="h-4 w-4" />
                      )}
                    </Button>
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

        {/* Botão de Adicionar */}
        <div className="flex justify-end mb-6 mt-4">
          <Button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-ifpr-green text-white shadow hover:bg-green-700 transition"
          >
            <Plus className="h-5 w-5" />
            Adicionar Estudante
          </Button>
        </div>
      </div>

      {/* Modal de criação */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-8 shadow-2xl w-full max-w-2xl">
            <StudentForm onClose={closeCreateModal} />
          </div>
        </div>
      )}

      {/* Modal de edição */}
      {isEditModalOpen && studentToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-8 shadow-2xl w-full max-w-2xl">
            <StudentEditForm onClose={closeEditModal} student={studentToEdit} />
          </div>
        </div>
      )}

      {/* Modal de documentos */}
      {isDocumentsModalOpen && studentForDocs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <StudentDocumentsModal
            student={studentForDocs}
            onClose={closeDocumentsModal}
          />
        </div>
      )}
    </div>
  );
}
