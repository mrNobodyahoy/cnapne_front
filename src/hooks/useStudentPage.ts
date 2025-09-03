// src/hooks/useStudentsPage.ts
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { getAllStudents, deleteStudent, searchStudents, getStudentsByStatus } from '../services/studentService';
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
      if (statusFilter !== 'ALL') {
        const students = await getStudentsByStatus(statusFilter);
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          return students.filter(s =>
            s.completeName.toLowerCase().startsWith(q) ||
            s.registration.toLowerCase().startsWith(q)
          );
        }
        return students;
      }

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const students = await searchStudents(searchTerm); // se esse já vem do backend, pode estar usando includes
        return students.filter(s =>
          s.completeName.toLowerCase().startsWith(q) ||
          s.registration.toLowerCase().startsWith(q)
        );
      }

      const fullStudents = await getAllStudents();
      return fullStudents.map(student => ({
        id: student.id,
        completeName: student.completeName,
        registration: student.registration,
        team: student.team,
        status: student.status,
      }));

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
