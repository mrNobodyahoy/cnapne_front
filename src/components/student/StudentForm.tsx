// src/components/student/StudentForm.tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Button from '../ui/Button';
import { createStudent } from '../../services/studentService';
import type { CreateStudentDTO } from '../../types/student';

import StudentFormFields from './StudentFormFields'; 

const studentSchema = z.object({
  email: z.string().email('E-mail inválido.').min(1, 'E-mail é obrigatório.'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres.'),
  completeName: z.string().min(1, 'Nome completo é obrigatório.'),
  registration: z.string().min(1, 'Matrícula é obrigatória.'),
  team: z.string().min(1, 'Turma é obrigatória.'),
  birthDate: z.string().refine((date) => !isNaN(new Date(date).getTime()), 'Data inválida.'),
  phone: z.string().min(1, 'Telefone é obrigatório.'),
  gender: z.string().min(1, 'Gênero é obrigatório.'),
  ethnicity: z.string().min(1, 'Etnia é obrigatória.'),
});

export type FormData = z.infer<typeof studentSchema>;

export default function StudentForm({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(studentSchema),
    mode: 'onBlur',
  });

  const mutation = useMutation({
    mutationFn: (newStudent: CreateStudentDTO) => createStudent(newStudent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      reset();
      onClose();
    },
    onError: (err: any) => {
      console.error('Erro ao criar estudante:', err);
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className="space-y-6 bg-white p-6 rounded-2xl shadow-md"
    >
      <h2 className="text-2xl font-bold text-ifpr-black">Criar Estudante</h2>
      
      <StudentFormFields register={register} control={control} errors={errors} />

      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button 
          type="button" 
          onClick={onClose} 
          className="bg-gray-300 hover:bg-gray-400 text-gray-800"
        >
          Cancelar
        </Button>
        <Button type="submit" loading={isSubmitting || mutation.isPending}>
          Salvar
        </Button>
      </div>
    </form>
  );
}
