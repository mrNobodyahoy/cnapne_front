// src/hooks/useStudentsPage.ts

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { getAllStudents, deleteStudent, searchStudents } from '../services/studentService';
// 1. Importe tanto Student quanto StudentSummary
import type { Student, StudentSummary } from '../types/student';

export function useStudentsPage() {
  // ... (os useStates continuam os mesmos)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [isDocumentsModalOpen, setIsDocumentsModalOpen] = useState(false);
  const [studentForDocs, setStudentForDocs] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const queryClient = useQueryClient();

  // 2. ALTERAÇÃO PRINCIPAL: A query agora é tipada para retornar StudentSummary[]
  const { data: students, isLoading, isError, error } = useQuery<StudentSummary[], Error>({
    queryKey: ['students', searchTerm],
    queryFn: async () => {
      // Se não houver busca, busca todos e CONVERTE para o formato de sumário
      if (!searchTerm.trim()) {
        const fullStudents = await getAllStudents();
        // 3. Converte cada Student para StudentSummary
        return fullStudents.map(student => ({
          id: student.id,
          completeName: student.completeName,
          registration: student.registration,
          team: student.team,
          status: student.status,
        }));
      }
      // Se houver busca, a função searchStudents já retorna o formato correto (StudentSummary[])
      return searchStudents(searchTerm);
    },
    placeholderData: keepPreviousData,
  });

  // ... (o restante do hook, como deleteMutation e os handlers, continua o mesmo)
  const deleteMutation = useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
    onError: (err: any) => {
      alert('Erro ao deletar estudante: ' + err.message);
    },
  });

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

  return {
    students, // Este agora é do tipo StudentSummary[] | undefined
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