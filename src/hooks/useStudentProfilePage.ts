// src/hooks/useStudentProfilePage.ts
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStudentById, deleteStudent } from "../services/studentService";
import type { Student } from "../types/student";

export function useStudentProfilePage() {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    data: student,
    isLoading,
    isError,
    error,
  } = useQuery<Student, Error>({
    queryKey: ["student", studentId],
    queryFn: () => getStudentById(studentId!),
    enabled: !!studentId,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      navigate("/alunos");
    },
    onError: (err: any) => {
      alert(`Erro ao deletar estudante: ${err.message}`);
    },
  });

  const handleDelete = () => {
    if (
      window.confirm(
        `Tem certeza que deseja deletar o estudante ${student?.completeName}?`
      )
    ) {
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
    handleDelete,
    isDeleting: deleteMutation.isPending,
  };
}
