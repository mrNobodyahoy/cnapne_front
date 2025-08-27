// src/pages/AlunosPage.tsx
import { LoaderCircle, AlertTriangle, Plus } from 'lucide-react';
import { useStudentsPage } from '../hooks/useStudentPage';

import StudentPageHeader from '../components/student/StudentPageHeader';
import StudentTable from '../components/student/StudentTable';
import StudentForm from '../components/student/StudentForm';
import StudentEditForm from '../components/student/StudentEditForm';
import { useState } from 'react';
import Button from '../components/ui/Button';
import StudentDocumentsModal from '../components/document/StudentDocumentsModal';

export default function AlunosPage() {
  const {
    students,
    isLoading,
    isError,
    error,
    searchTerm,
    setSearchTerm,
    studentToEdit,
    studentForDocs,
    isCreateModalOpen,
    isEditModalOpen,
    isDocumentsModalOpen,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    openDocumentsModal,
    closeDocumentsModal,
    handleDeleteStudent,
    deleteMutation,
  } = useStudentsPage();

  if (isLoading) {
    return <div className="flex items-center justify-center p-8"><LoaderCircle className="h-8 w-8 animate-spin text-ifpr-green" /><p className="ml-2 text-gray-600">Carregando estudantes...</p></div>;
  }

  if (isError) {
    return <div className="rounded-md border border-red-300 bg-red-50 p-4 text-red-700"><div className="flex items-center"><AlertTriangle className="h-6 w-6 mr-2" /><p><strong>Erro:</strong> Não foi possível buscar os estudantes. {error.message}</p></div></div>;
  }

  return (
    <div className="w-full">
      <div className="max-w-5xl mx-auto">
        <StudentPageHeader searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        <StudentTable 
          students={students}
          onOpenDocuments={openDocumentsModal}
          onEdit={openEditModal}
          onDelete={handleDeleteStudent}
          deleteMutation={deleteMutation}
        />

        <div className="flex justify-end mb-6 mt-4">
          <Button onClick={openCreateModal} className="flex items-center gap-2 px-5 py-2 rounded-lg bg-ifpr-green text-white shadow hover:bg-green-700 transition">
            <Plus className="h-5 w-5" /> Adicionar Estudante
          </Button>
        </div>
      </div>

      {/* Modais */}
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
            <StudentEditForm onClose={closeEditModal} student={studentToEdit!} />
          </div>
        </div>
      )}

      {/* Modal de documentos */}
      {isDocumentsModalOpen && studentForDocs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <StudentDocumentsModal student={studentForDocs!} onClose={closeDocumentsModal} />
        </div>
      )}
    </div>
  );
}
