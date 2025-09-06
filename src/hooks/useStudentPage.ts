// src/hooks/useStudentsPage.ts
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { getAllStudents, deleteStudent, getStudentsByStatus } from '../services/studentService';
import type { Student, StudentSummary } from '../types/student';

export function useStudentsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [isDocumentsModalOpen, setIsDocumentsModalOpen] = useState(false);
  const [studentForDocs, setStudentForDocs] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ATIVO' | 'INATIVO'>('ALL');

  const queryClient = useQueryClient();
  const q = searchTerm.trim().toLowerCase();

  const { data: students, isLoading, isError, error } = useQuery<StudentSummary[], Error>({
    queryKey: ['students', q, statusFilter],
    queryFn: async () => {
      let baseStudentList: StudentSummary[];

      // 1. Primeiro, sempre buscamos a lista base de acordo com o filtro de status
      if (statusFilter === 'ATIVO' || statusFilter === 'INATIVO') {
        baseStudentList = await getStudentsByStatus(statusFilter);
      } else {
        // Para "Todos", usamos a chamada confiável `getAllStudents`
        const fullStudents = await getAllStudents();
        baseStudentList = fullStudents.map(student => ({
          id: student.id,
          completeName: student.completeName,
          registration: student.registration,
          team: student.team,
          status: student.status,
        }));
      }

      // 2. Se houver um termo de busca, aplicamos o filtro na lista que acabamos de buscar
      if (searchTerm.trim()) {
        const lowercasedQuery = searchTerm.toLowerCase();
        return baseStudentList.filter(s =>
          s.completeName.toLowerCase().startsWith(lowercasedQuery) ||
          s.registration.toLowerCase().startsWith(lowercasedQuery)
        );
      }

      // 3. Se não houver busca, apenas retornamos a lista base
      return baseStudentList;
    },
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['students'] }),
    onError: (err: any) => alert('Erro ao deletar estudante: ' + err.message),
  });

  const handleDeleteStudent = (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja deletar o estudante ${name}?`)) {
      deleteMutation.mutate(id);
    }
  };

  const openEditModal = (student: Student) => { setStudentToEdit(student); setIsEditModalOpen(true); };
  const closeEditModal = () => setIsEditModalOpen(false);
  const openDocumentsModal = (student: Student) => { setStudentForDocs(student); setIsDocumentsModalOpen(true); };
  const closeDocumentsModal = () => setIsDocumentsModalOpen(false);
  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  return {
    students,
    isLoading,
    isError,
    error,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
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