import { AlertTriangle, LoaderCircle } from 'lucide-react';
import { useProfessionalsPage } from '../../hooks/useProfessionalsPage';

import Modal from '../../components/ui/Modal';
import ProfessionalList from '../../components/professional/ProfessionalList';
import ProfessionalForm from '../../components/professional/ProfessionalForm';
import ProfessionalEditForm from '../../components/professional/ProfessionalEditForm';
import ProfessionalPageHeader from '../../components/professional/ProfessionalPageHeader';

export default function ProfissionaisPage() {
  const {
    professionals,
    isLoading, // Para o carregamento inicial
    isFetching, // Para as atualizações
    isError,
    error,
    deleteMutation,
    modalState,
    filters,
    handlers,
  } = useProfessionalsPage();

  // Usa 'isLoading' para o carregamento de tela cheia, que acontece só na primeira vez.
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoaderCircle className="h-8 w-8 animate-spin text-ifpr-green" />
        <p className="ml-2 text-gray-600">Carregando...</p>
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
        <ProfessionalPageHeader
          isFetching={isFetching}
          searchTerm={filters.searchInput} // ✅ pega o searchInput
          onSearchChange={handlers.handleSearchChange}
          roleFilter={filters.roleFilter}
          onRoleChange={handlers.handleRoleChange}
          statusFilter={filters.statusFilter}
          onStatusChange={handlers.handleStatusChange}
          onAddProfessional={handlers.handleOpenCreateModal}
        />

        {/* ✅ A lista fica com opacidade reduzida enquanto novos dados são buscados */}
        <div className={`transition-opacity duration-200 ${isFetching ? 'opacity-50' : 'opacity-100'}`}>
          <ProfessionalList
            professionals={professionals}
            onEdit={handlers.handleOpenEditModal}
            onDelete={handlers.handleDeleteProfessional}
            deleteMutation={deleteMutation}
          />
        </div>
      </div>

      <Modal
        isOpen={modalState.mode !== 'closed'}
        onClose={handlers.handleCloseModal}
        title={modalState.mode === 'create' ? 'Criar Novo Profissional' : 'Editar Profissional'}
      >
        {modalState.mode === 'create' && <ProfessionalForm onClose={handlers.handleCloseModal} />}
        {modalState.mode === 'edit' && modalState.data && (
          <ProfessionalEditForm onClose={handlers.handleCloseModal} professional={modalState.data} />
        )}
      </Modal>
    </div>
  );
}