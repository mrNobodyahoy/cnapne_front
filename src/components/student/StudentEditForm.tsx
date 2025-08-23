// src/components/student/StudentEditForm.tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Button from '../ui/Button';
import { updateStudent } from '../../services/studentService';
import type { UpdateStudentDTO, Student } from '../../types/student';

import StudentEditFormFields from './StudentEditFields';

const updateStudentSchema = z.object({
  email: z.string().email('E-mail inválido.').min(1, 'E-mail é obrigatório.'),
  completeName: z.string().min(1, 'Nome completo é obrigatório.'),
  registration: z.string().min(1, 'Matrícula é obrigatória.'),
  team: z.string().min(1, 'Turma é obrigatória.'),
  birthDate: z.string().refine((date) => !isNaN(new Date(date).getTime()), 'Data inválida.'),
  phone: z.string().min(1, 'Telefone é obrigatório.'),
  gender: z.string().min(1, 'Gênero é obrigatório.'),
  ethnicity: z.string().min(1, 'Etnia é obrigatória.'),
});

export type UpdateFormData = z.infer<typeof updateStudentSchema>;

export default function StudentEditForm({ 
  onClose, 
  student 
}: { 
  onClose: () => void; 
  student: Student 
}) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<UpdateFormData>({
    resolver: zodResolver(updateStudentSchema),
    mode: 'onBlur',
    defaultValues: {
      ...student,
      // ajusta data para formato YYYY-MM-DD aceito pelo <input type="date" />
      birthDate: student.birthDate ? student.birthDate.split('T')[0] : "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: (updatedStudent: UpdateStudentDTO) => updateStudent(student.id, updatedStudent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      onClose();
    },
    onError: (err: any) => {
      console.error('Erro ao atualizar estudante:', err);
    },
  });

  const onSubmit = (data: UpdateFormData) => {
    updateMutation.mutate(data);
  };

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className="space-y-6 bg-white p-6 rounded-2xl shadow-md"
    >
      <h2 className="text-2xl font-bold text-ifpr-black">
        Editar Estudante
      </h2>
      
      <StudentEditFormFields register={register} control={control} errors={errors} />

      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button 
          type="button" 
          onClick={onClose} 
          className="bg-gray-300 hover:bg-gray-400 text-gray-800"
        >
          Cancelar
        </Button>
        <Button type="submit" loading={isSubmitting || updateMutation.isPending}>
          Salvar Alterações
        </Button>
      </div>
    </form>
  );
}
