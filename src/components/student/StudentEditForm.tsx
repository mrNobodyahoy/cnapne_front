import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import FormContainer from '../ui/FormContainer';
import { updateStudent } from '../../services/studentService';
import type { UpdateStudentDTO, Student } from '../../types/student';
import StudentFields from './StudentFields';

const updateStudentSchema = z.object({
  email: z.string().email('E-mail inválido.').min(1, 'E-mail é obrigatório.'),
  completeName: z.string().min(1, 'Nome completo é obrigatório.'),
  registration: z.string()
    .min(1, 'Matrícula é obrigatória')
    .max(11, 'A matrícula deve ter no máximo 11 caracteres.')
    .regex(/^\d+$/, "A matrícula deve conter apenas números."),
  team: z.string().min(1, 'Turma é obrigatória.'),
  birthDate: z.string().refine((date) => !isNaN(new Date(date).getTime()), 'Data inválida.'),
  phone: z.string().min(1, 'Telefone é obrigatório.'),
  gender: z.string().min(1, 'Gênero é obrigatório.'),
  ethnicity: z.string().min(1, 'Etnia é obrigatória.'),
  status: z.enum(["ATIVO", "INATIVO"], {
    required_error: "O status é obrigatório"
  }),
});

// Inferimos o tipo a partir do Schema do Zod
export type UpdateFormData = z.infer<typeof updateStudentSchema>;

export default function StudentEditForm({
  onClose,
  student,
}: {
  onClose: () => void;
  student: Student;
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
      birthDate: student.birthDate
        ? new Date(student.birthDate).toISOString().split('T')[0]
        : '',
      phone: student.phone || '',
      gender: student.gender || '',
      ethnicity: student.ethnicity || '',
      status: (student.status as "ATIVO" | "INATIVO") || "ATIVO",
    },
  });

  const updateMutation = useMutation({
    mutationFn: (updatedStudent: UpdateStudentDTO) =>
      updateStudent(student.id, updatedStudent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student', student.id] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
      onClose();
    },
    onError: (err: any) => {
      console.error('Erro ao atualizar estudante:', err);
      alert('Erro ao atualizar: ' + (err.message || "Erro desconhecido"));
    },
  });

  const onSubmit = (data: UpdateFormData) => {
    // Tratamento de dados antes de enviar
    const payload: UpdateStudentDTO = {
      ...data,
      phone: data.phone.replace(/[^0-9]/g, ''),
      status: data.status as "ATIVO" | "INATIVO" // Casting explícito para garantir o tipo
    };

    // Se o status no form for diferente dos permitidos na DTO, precisamos tratar,
    // mas aqui o Zod já garante que é ATIVO ou INATIVO.

    updateMutation.mutate(payload);
  };

  return (
    <FormContainer
      title="Editar Estudante"
      onSubmit={handleSubmit(onSubmit)}
      onClose={onClose}
      isLoading={isSubmitting || updateMutation.isPending}
    >
      <StudentFields
        register={register}
        control={control}
        errors={errors}
        variant="edit"
      />
    </FormContainer>
  );
}