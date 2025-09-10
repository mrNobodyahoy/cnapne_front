import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { useState } from 'react';

// Imports da refatoração
import { useMinorLogic } from '../../hooks/useMinorLogic';
import FormContainer from '../ui/FormContainer';

import type { CreateStudentDTO } from '../../types/student';
import { createStudent } from '../../services/studentService';

import StudentFields from './StudentFields';
import ResponsibleFormFields from './responsible/ResponsibleFormFields';
import { calculateAge } from '../../lib/utils';


// Schema para um responsável
const responsibleSchema = z.object({
  completeName: z.string().min(1, 'Nome do responsável é obrigatório.'),
  email: z.string().email('E-mail do responsável é inválido.'),
  phone: z.string().min(1, 'Telefone do responsável é obrigatório.'),
  kinship: z.string().min(1, 'Parentesco é obrigatório.'),
});

// Schema principal com validação condicional
const createStudentSchema = z.object({
  email: z.string().email('E-mail inválido.').min(1, 'E-mail é obrigatório.'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres.'),
  completeName: z.string().min(1, 'Nome completo é obrigatório.'),
  registration: z.string()
    .max(11, 'A matrícula deve ter exatamente 11 dígitos.')
    .regex(/^\d+$/, "A matrícula deve conter apenas números."),
  team: z.string().min(1, 'Turma é obrigatória.'),
  birthDate: z.string().min(1, 'Data de nascimento é obrigatória.').refine((date) => !isNaN(new Date(date).getTime()), 'Data inválida.'),
  phone: z.string().min(1, 'Telefone é obrigatório.'),
  gender: z.string().min(1, 'Gênero é obrigatório.'),
  ethnicity: z.string().min(1, 'Etnia é obrigatória.'),
  responsibles: z.array(responsibleSchema).optional(),
}).refine(data => {
  if (!data.birthDate) return true; 
  const age = calculateAge(data.birthDate);
  if (age < 18) {
    return data.responsibles && data.responsibles.length > 0;
  }
  return true;
}, {
  message: 'Para estudantes menores de 18 anos, é obrigatório cadastrar ao menos um responsável.',
  path: ['responsibles'],
});


export type CreateFormData = z.infer<typeof createStudentSchema>;

export default function StudentForm({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateFormData>({
    resolver: zodResolver(createStudentSchema),
    mode: 'onBlur',
    defaultValues: {
      responsibles: [],
    }
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "responsibles",
  });

  // ✅ Toda a lógica de useEffect e useState foi movida para o hook
  const { isMinor } = useMinorLogic({
    watch,
    fieldArray: { fields, append, replace },
  });

  const createMutation = useMutation({
    mutationFn: (newStudent: CreateStudentDTO) => createStudent(newStudent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      reset();
      onClose();
    },
    onError: (err: any) => {
      setApiError(err.response?.data?.message || 'Ocorreu um erro. Tente novamente.');
    },
  });

  const onSubmit = (data: CreateFormData) => {
    setApiError(null);
    const payload: CreateStudentDTO = { ...data };

    // A lógica de remover 'responsibles' continua aqui, pois é parte da submissão
    if (!isMinor) {
      delete (payload as any).responsibles;
    }

    createMutation.mutate(payload);
  };

  return (
    // ✅ O layout do formulário agora é controlado pelo FormContainer
    <FormContainer
      title="Criar Estudante"
      onSubmit={handleSubmit(onSubmit)}
      onClose={onClose}
      isLoading={isSubmitting || createMutation.isPending}
      apiError={apiError}
    >
      {/* ✅ Corrigido para "create" e usando o componente de campos unificado */}
      <StudentFields register={register} control={control} errors={errors} variant="create" />
      
      {/* A lógica condicional de UI permanece no componente */}
      {isMinor && (
        <div className="pt-6 border-t mt-6">
          <ResponsibleFormFields
            control={control}
            register={register}
            errors={errors}
            fields={fields}
            append={append}
            remove={remove}
          />
          {errors.responsibles && (
            <p className="text-sm text-red-600 mt-2">{errors.responsibles.message}</p>
          )}
        </div>
      )}
    </FormContainer>
  );
}