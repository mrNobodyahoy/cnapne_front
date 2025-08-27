import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { useEffect, useState } from 'react';

import type { CreateStudentDTO } from '../../types/student';
import { createStudent } from '../../services/studentService';

import StudentFormFields from './StudentFormFields';
import ResponsibleFormFields from './ResponsibleFormFields';
import Button from '../ui/Button'; // Assumindo que este é o caminho para seu botão

// Função para calcular a idade
const calculateAge = (birthDate: string | Date): number => {
  if (!birthDate) return 0;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

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
  registration: z.string().min(1, 'Matrícula é obrigatória.'),
  team: z.string().min(1, 'Turma é obrigatória.'),
  birthDate: z.string().min(1, 'Data de nascimento é obrigatória.').refine((date) => !isNaN(new Date(date).getTime()), 'Data inválida.'),
  phone: z.string().min(1, 'Telefone é obrigatório.'),
  gender: z.string().min(1, 'Gênero é obrigatório.'),
  ethnicity: z.string().min(1, 'Etnia é obrigatória.'),
  responsibles: z.array(responsibleSchema).optional(),
}).refine(data => {
  if (!data.birthDate) return true; // Não valida se a data ainda não foi preenchida
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
  const [isMinor, setIsMinor] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null); // Estado para erro da API

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

  // Lógica de mutação para criar o estudante
  const createMutation = useMutation({
    mutationFn: (newStudent: CreateStudentDTO) => createStudent(newStudent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      reset();
      onClose();
    },
    onError: (err: any) => {
      // Define a mensagem de erro para ser exibida no formulário
      setApiError(err.response?.data?.message || 'Ocorreu um erro. Tente novamente.');
    },
  });

  const birthDate = watch('birthDate');

  useEffect(() => {
    if (!birthDate) {
      setIsMinor(false);
      return;
    };

    const age = calculateAge(birthDate);
    const isNowMinor = age < 18;
    setIsMinor(isNowMinor);

    if (isNowMinor && fields.length === 0) {
      append({ completeName: '', email: '', phone: '', kinship: '' });
    } else if (!isNowMinor && fields.length > 0) {
      replace([]);
    }
  }, [birthDate, fields.length, append, replace]);

  const onSubmit = (data: CreateFormData) => {
    setApiError(null); // Limpa erros anteriores
    const payload: CreateStudentDTO = { ...data };

    if (!isMinor) {
      delete (payload as any).responsibles;
    }
    
    createMutation.mutate(payload);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 bg-white p-6 rounded-2xl shadow-md max-h-[90vh] overflow-y-auto"
    >
      <h2 className="text-2xl font-bold text-ifpr-black">
        Criar Estudante
      </h2>

      <StudentFormFields register={register} control={control} errors={errors} />

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

      {/* Exibição do erro da API */}
      {apiError && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          <strong>Erro:</strong> {apiError}
        </div>
      )}

      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button
          type="button"
          onClick={onClose}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800"
          disabled={createMutation.isPending}
        >
          Cancelar
        </Button>
        <Button type="submit" loading={isSubmitting || createMutation.isPending}>
          Salvar
        </Button>
      </div>
    </form>
  );
}