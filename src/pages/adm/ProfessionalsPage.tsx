import { AlertTriangle, LoaderCircle, Plus } from 'lucide-react';
import { useProfessionalsPage } from '../../hooks/useProfessionalsPage';

import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import ProfessionalList from '../../components/professional/ProfessionalList';
import ProfessionalForm from '../../components/professional/ProfessionalForm';
import ProfessionalEditForm from '../../components/professional/ProfessionalEditForm';

export default function ProfissionaisPage() {
  // O componente agora consome o hook, recebendo todo o estado e lógica prontos
  const {
    professionals,
    isLoading,
    isError,
    error,
    deleteMutation,
    modalState,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleCloseModal,
    handleDeleteProfessional,
  } = useProfessionalsPage();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoaderCircle className="h-8 w-8 animate-spin text-ifpr-green" />
        <p className="ml-2 text-gray-600">Carregando profissionais...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-md border border-red-300 bg-red-50 p-4 text-red-700">
        <div className="flex items-center">
          <AlertTriangle className="h-6 w-6 mr-2" />
          <p><strong>Erro:</strong> {error?.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ifpr-black">Lista de Profissionais</h1>
            <p className="mt-1 text-gray-600">Gerencie os profissionais cadastrados no sistema.</p>
          </div>
          <Button onClick={handleOpenCreateModal} className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Adicionar Profissional
          </Button>
        </div>

        <ProfessionalList
          professionals={professionals}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteProfessional}
          deleteMutation={deleteMutation}
        />
      </div>

      {/* Usando o componente Modal genérico */}
      <Modal isOpen={modalState.mode !== 'closed'} onClose={handleCloseModal}>
        title={modalState.mode === 'create' ? 'Criar Novo Profissional' : 'Editar Profissional'}
        {modalState.mode === 'create' && <ProfessionalForm onClose={handleCloseModal} />}
        {modalState.mode === 'edit' && modalState.data && (
          <ProfessionalEditForm onClose={handleCloseModal} professional={modalState.data} />
        )}
      </Modal>
    </div>
  );
}