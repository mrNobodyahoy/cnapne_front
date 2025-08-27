// src/hooks/useStudentsPage.ts
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { getAllStudents, deleteStudent, searchStudents } from '../services/studentService';
import type { Student } from '../types/student';

export function useStudentsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [isDocumentsModalOpen, setIsDocumentsModalOpen] = useState(false);
  const [studentForDocs, setStudentForDocs] = useState<Student | null>(null);

  const [searchTerm, setSearchTerm] = useState('');

  const queryClient = useQueryClient();

  // Data fetching com React Query
  const { data: students, isLoading, isError, error } = useQuery<Student[], Error>({
    queryKey: ['students', searchTerm],
    queryFn: () => {
      if (!searchTerm.trim()) return getAllStudents();
      return searchStudents(searchTerm);
    },
    placeholderData: keepPreviousData,
  });

  // Mutação para deletar
  const deleteMutation = useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      // Adicionar notificação de sucesso aqui (ex: toast.success('Estudante deletado!'))
    },
    onError: (err: any) => {
      // Adicionar notificação de erro aqui (ex: toast.error(err.message))
      alert('Erro ao deletar estudante: ' + err.message); // Manter por enquanto
    },
  });

  // Handlers (funções de manipulação)
  const handleDeleteStudent = (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja deletar o estudante ${name}?`)) {
      deleteMutation.mutate(id);
    }
  };

  const openEditModal = (student: Student) => {
    setStudentToEdit(student);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => setIsEditModalOpen(false);

  const openDocumentsModal = (student: Student) => {
    setStudentForDocs(student);
    setIsDocumentsModalOpen(true);
  };
  const closeDocumentsModal = () => setIsDocumentsModalOpen(false);
  
  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  // Retornamos tudo que a UI precisa para renderizar
  return {
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
  };
}