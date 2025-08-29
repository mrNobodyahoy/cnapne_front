// src/components/student/StudentEditForm.tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Button from '../ui/Button';
import { updateStudent } from '../../services/studentService';
import type { UpdateStudentDTO, Student } from '../../types/student';

import StudentEditFields from './StudentEditFields'; // Verifique o nome deste arquivo

// O schema de validação continua o mesmo
const updateStudentSchema = z.object({
  email: z.string().email('E-mail inválido.').min(1, 'E-mail é obrigatório.'),
  completeName: z.string().min(1, 'Nome completo é obrigatório.'),
  registration: z.string()
    .max(11, 'A matrícula deve ter exatamente 11 dígitos.')
    .regex(/^\d+$/, "A matrícula deve conter apenas números."),
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
      completeName: student.completeName || '',
      email: student.email || '',
      registration: student.registration || '',
      team: student.team || '',
      birthDate: student.birthDate ? new Date(student.birthDate).toISOString().split('T')[0] : "",
      phone: student.phone || '',
      gender: student.gender || '',
      ethnicity: student.ethnicity || '',
    },
  });

  const updateMutation = useMutation({
    mutationFn: (updatedStudent: UpdateStudentDTO) => updateStudent(student.id, updatedStudent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student', student.id] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
      onClose();
    },
    onError: (err: any) => {
      console.error('Erro ao atualizar estudante:', err);
    },
  });

  const onSubmit = (data: UpdateFormData) => {
    const payload = {...data, phone: data.phone.replace(/[^0-9]/g, ''),
    };
    updateMutation.mutate(payload);
  };

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className="space-y-6"
    >
      
      <StudentEditFields register={register} control={control} errors={errors} />

      <div className="flex justify-end gap-4 pt-4 mt-6 border-t">
        <Button 
          type="button" 
          onClick={onClose} 
          variant="secondary" 
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