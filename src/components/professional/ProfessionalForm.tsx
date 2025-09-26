import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import Button from '../ui/Button';
import { createProfessional } from '../../services/professionalService';
import type { CreateProfessionalDTO } from '../../types/professional';
import ProfessionalFormFields from './ProfessionalFormFields';

const createProfessionalSchema = z.object({
    email: z.string().email('E-mail inválido.').min(1, 'E-mail é obrigatório.'),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres.'),
    fullName: z.string().min(1, 'Nome completo é obrigatório.'),
    specialty: z.string().min(1, 'Especialidade é obrigatória.'),
    role: z.string().min(1, 'Função é obrigatória.'),
    active: z.boolean().default(true),
});

export type CreateFormData = z.infer<typeof createProfessionalSchema>;

export default function ProfessionalForm({ onClose }: { onClose: () => void }) {
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<CreateFormData>({
        mode: 'onBlur',
    });

    const createMutation = useMutation({
        mutationFn: (newProfessional: CreateProfessionalDTO) => createProfessional(newProfessional),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['professionals'] });
            reset();
            onClose();
        },
        onError: (err: any) => {
            console.error('Erro ao criar profissional:', err);
        },
    });

    const onSubmit = (data: CreateFormData) => {
        createMutation.mutate(data);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 bg-white p-6 rounded-2xl shadow-md"
        >

            <ProfessionalFormFields register={register} control={control} errors={errors} variant="create" />

            <div className="flex justify-end gap-4 pt-4 border-t">
                <Button
                    type="button"
                    onClick={onClose}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800"
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
