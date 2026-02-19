import { Link } from 'react-router-dom';
import { useState } from 'react';
import {
  LoaderCircle,
  ArrowLeft,
  Edit,
  Trash,
  User,
  FileText,
  CalendarClock,
  AlertTriangle,
} from 'lucide-react';
import { useStudentProfilePage } from '../../../hooks/student/useStudentProfilePage';
import { cn, getErrorMessage } from '../../../lib/utils';
import ResponsibleList from '../../../components/student/responsible/ResponsibleList';
import StudentDocumentsList from '../../../components/document/StudentDocumentsList';
import StudentTimeline from '../../../components/student/StudentTimeline';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import StudentEditForm from '../../../components/student/StudentEditForm';
import { formatPhone, formatGender } from '../../../lib/constants';

type Tab = 'perfil' | 'documentos' | 'timeline';

const ProfileDetails = ({
  student,
}: {
  student: NonNullable<ReturnType<typeof useStudentProfilePage>['student']>;
}) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      <div>
        <h3 className="font-semibold text-gray-500">Email</h3>
        <p>{student.email}</p>
      </div>
      <div>
        <h3 className="font-semibold text-gray-500">Telefone</h3>
        <p>{formatPhone(student.phone)}</p>
      </div>
      <div>
        <h3 className="font-semibold text-gray-500">Data de Nascimento</h3>
        <p>{new Date(student.birthDate).toLocaleDateString('pt-BR')}</p>
      </div>
      <div>
        <h3 className="font-semibold text-gray-500">Status</h3>
        <p>{student.status}</p>
      </div>
      <div>
        <h3 className="font-semibold text-gray-500">Turma</h3>
        <p>{student.team}</p>
      </div>
      <div>
        <h3 className="font-semibold text-gray-500">Gênero</h3>
        <p>{formatGender(student.gender)}</p>
      </div>
      <div>
        <h3 className="font-semibold text-gray-500">Etnia</h3>
        <p>{student.ethnicity}</p>
      </div>
    </div>

    {student.responsibles && student.responsibles.length > 0 && (
      <>
        <div className="border-t" />
        <ResponsibleList responsibles={student.responsibles} />
      </>
    )}
  </div>
);

export default function StudentProfilePage() {
  const {
    student,
    isLoading,
    isError,
    isEditModalOpen,
    openEditModal,
    closeEditModal,
    handleDelete,
    isDeleting,
  } = useStudentProfilePage();

  const [activeTab, setActiveTab] = useState<Tab>('perfil');

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'perfil', label: 'Perfil', icon: User },
    { id: 'documentos', label: 'Documentos', icon: FileText },
    { id: 'timeline', label: 'Linha do Tempo', icon: CalendarClock },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoaderCircle className="h-8 w-8 animate-spin text-ifpr-green" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-md border border-red-300 bg-red-50 p-4 text-red-700">
        <div className="flex items-center gap-2">
          <AlertTriangle size={20} />
          <strong>Erro:</strong> {getErrorMessage(isError)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Link
        to="/alunos"
        className="inline-flex items-center gap-2 text-ifpr-green hover:underline"
      >
        <ArrowLeft className="h-5 w-5" />
        Voltar para a lista de alunos
      </Link>

      <div className="bg-white p-6 rounded-xl shadow-md border flex justify-between items-start">
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

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'inline-flex items-center gap-2 whitespace-nowrap border-b-2 py-3 px-1 text-base font-medium',
                activeTab === tab.id
                  ? 'border-ifpr-green text-ifpr-green'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              )}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-md border">
        {student && (
          <>
            {activeTab === 'perfil' && <ProfileDetails student={student} />}
            {activeTab === 'documentos' && (
              <StudentDocumentsList student={student} />
            )}
            {activeTab === 'timeline' && (
              <StudentTimeline studentId={student.id} />
            )}
          </>
        )}
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        title="Editar Estudante"
      >
        {student && (
          <StudentEditForm student={student} onClose={closeEditModal} />
        )}
      </Modal>
    </div>
  );
}