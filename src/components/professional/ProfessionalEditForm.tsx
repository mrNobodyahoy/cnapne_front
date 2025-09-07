// src/components/professional/ProfessionalEditForm.tsx

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import Button from '../ui/Button';
import { updateProfessional } from '../../services/professionalService';
import type { UpdateProfessionalDTO, ReadProfessionalDTO } from '../../types/professional';
import ProfessionalFormFields from './ProfessionalFormFields';
import { toast } from 'react-toastify';

const updateProfessionalSchema = z.object({
  email: z.string().email('E-mail inválido.').min(1, 'E-mail é obrigatório.'),
  fullName: z.string().min(1, 'Nome completo é obrigatório.'),
  specialty: z.string().min(1, 'Especialidade é obrigatória.'),
  role: z.string().min(1, 'Função é obrigatória.'),
  active: z.boolean().default(true),
});

export type UpdateFormData = z.infer<typeof updateProfessionalSchema>;

interface ProfessionalEditFormProps {
  onClose: () => void;
  professional: ReadProfessionalDTO;
}

export default function ProfessionalEditForm({
  onClose,
  professional
}: ProfessionalEditFormProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<UpdateFormData>({
    mode: 'onBlur',
    defaultValues: {
      ...professional,
    },
  });

  const updateMutation = useMutation({
    mutationFn: (updatedData: UpdateProfessionalDTO) =>
      updateProfessional(professional.id, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professionals'] });
      onClose();
    },
    onError: (err: any) => {
      console.error('Erro ao atualizar profissional:', err);
      toast("'Erro ao atualizar profissional");
    },
  });

  const onSubmit = (data: UpdateFormData) => {
    updateMutation.mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 bg-white p-6 rounded-2xl shadow-md">

      <ProfessionalFormFields register={register} control={control} errors={errors} variant="edit" />

      {/* Botões de ação do formulário */}
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