// src/hooks/useStudentProfilePage.ts
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStudentById, deleteStudent } from '../services/studentService';
import type { Student } from '../types/student';

export function useStudentProfilePage() {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Estado para os modais
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDocumentsModalOpen, setIsDocumentsModalOpen] = useState(false);

  // Busca os dados do estudante
  const { data: student, isLoading, isError, error } = useQuery<Student, Error>({
    queryKey: ['student', studentId],
    queryFn: () => getStudentById(studentId!),
    enabled: !!studentId,
  });

  // Mutação para deletar o estudante
  const deleteMutation = useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      // Invalida a lista de alunos para que ela seja atualizada
      queryClient.invalidateQueries({ queryKey: ['students'] });
      // Navega de volta para a lista de alunos após o sucesso
      navigate('/alunos');
    },
    onError: (err: any) => {
      alert(`Erro ao deletar estudante: ${err.message}`);
    },
  });

  const handleDelete = () => {
    if (window.confirm(`Tem certeza que deseja deletar o estudante ${student?.completeName}?`)) {
      deleteMutation.mutate(studentId!);
    }
  };

  return {
    student,
    isLoading,
    isError,
    error,
    isEditModalOpen,
    openEditModal: () => setIsEditModalOpen(true),
    closeEditModal: () => setIsEditModalOpen(false),
    isDocumentsModalOpen,
    openDocumentsModal: () => setIsDocumentsModalOpen(true),
    closeDocumentsModal: () => setIsDocumentsModalOpen(false),
    handleDelete,
    isDeleting: deleteMutation.isPending,
  };
}