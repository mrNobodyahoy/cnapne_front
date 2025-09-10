// src/pages/StudentProfilePage.tsx
import { Link } from 'react-router-dom';
import { LoaderCircle, ArrowLeft, Edit, Trash } from 'lucide-react';
import { useStudentProfilePage } from '../../hooks/useStudentProfilePage';

// Componentes
import ResponsibleList from '../../components/student/responsible/ResponsibleList';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import StudentEditForm from '../../components/student/StudentEditForm';
import StudentDocumentsList from "../../components/document/StudentDocumentsList";
import { formatPhone } from '../../lib/formatters';

export default function StudentProfilePage() {
  const {
    student,
    isLoading,
    isError,
    error,
    isEditModalOpen,
    openEditModal,
    closeEditModal,
    handleDelete,
    isDeleting,
  } = useStudentProfilePage();

  // LOADING
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoaderCircle className="h-8 w-8 animate-spin text-ifpr-green" />
      </div>
    );
  }

  // ERROR
  if (isError) {
    return (
      <div className="rounded-md border border-red-300 bg-red-50 p-4 text-red-700">
        <strong>Erro:</strong> {error!.message}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* VOLTAR */}
      <Link
        to="/alunos"
        className="inline-flex items-center gap-2 text-ifpr-green hover:underline mb-6"
      >
        <ArrowLeft className="h-5 w-5" />
        Voltar para a lista de alunos
      </Link>

      <div className="bg-white p-8 rounded-xl shadow-md border space-y-6">
        {/* CABEÇALHO COM AÇÕES */}
        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {student?.completeName}
            </h1>
            <p className="text-gray-500 mt-1">
              Matrícula: {student?.registration}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={openEditModal} variant="outline" title="Editar">
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleDelete}
              variant="danger"
              disabled={isDeleting}
              title="Deletar"
            >
              {isDeleting ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Trash className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="border-t" />

        {/* DETALHES DO ESTUDANTE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <h3 className="font-semibold text-gray-500">Email</h3>
            <p>{student?.email}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-500">Telefone</h3>
            <p>{student?.phone ? formatPhone(student.phone) : 'Não informado'}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-500">Data de Nascimento</h3>
            <p>
              {student?.birthDate
                ? new Date(student.birthDate).toLocaleDateString('pt-BR')
                : 'Não informado'}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-500">Status</h3>
            <p>{student?.status}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-500">Turma</h3>
            <p>{student?.team}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-500">Gênero</h3>
            <p>{student?.gender}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-500">Etnia</h3>
            <p>{student?.ethnicity}</p>
          </div>
        </div>
        <div className="border-t" />
        <StudentDocumentsList student={student!} />

        {/* LISTA DE RESPONSÁVEIS */}
        {student?.responsibles && student.responsibles.length > 0 && (
          <>
            <div className="border-t" />
            <ResponsibleList responsibles={student.responsibles} />
          </>
        )}
      </div>

      {/* MODAL EDITAR */}
      <Modal isOpen={isEditModalOpen} onClose={closeEditModal} title="Editar Estudante">
        {student && (
          <StudentEditForm student={student} onClose={closeEditModal} />
        )}
      </Modal>
    </div>
  );
}
