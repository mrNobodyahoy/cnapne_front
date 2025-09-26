// src/components/session/followUp/FollowUpForm.tsx
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateFollowUp } from '../../../types/followUp';
import toast from 'react-hot-toast';
import { useState } from 'react';

import Button from '../../ui/Button';
import Textarea from '../../ui/Textarea';
import Input from '../../ui/Input';
import SessionFormFields from '../SessionFormFields';
import { useProfessionalSearch } from '../../../hooks/useProfessionalSearch';
import { createAcompanhamento } from '../../../services/followUpService';

const createFollowUpSchema = z.object({
    sessionDate: z.string().min(1, 'Data é obrigatória.'),
    sessionTime: z.string().min(1, 'Horário é obrigatório.'),
    sessionLocation: z.string().min(1, 'Local é obrigatório.'),
    status: z.string().min(1, 'Status é obrigatório.'),
    description: z.string().min(1, 'Descrição é obrigatória.'),
    tasks: z.string().min(1, 'Tarefas são obrigatórias.'),
    professionalIds: z.array(z.string()).min(1, 'Selecione ao menos um profissional.'),
    areasCovered: z.string().optional(),
    nextSteps: z.string().optional(),
});

type FormData = z.infer<typeof createFollowUpSchema>;

export default function AcompanhamentoForm({ studentId }: { studentId: string }) {
    const queryClient = useQueryClient();
    const { register, control, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
        resolver: zodResolver(createFollowUpSchema)
    });

    const [formKey, setFormKey] = useState(Date.now());
    const { setSearchTerm, searchedProfessionals, isLoading: professionalSearchIsLoading } = useProfessionalSearch();
    const searchedOptions = searchedProfessionals?.map(prof => ({ value: prof.id, label: prof.fullName }));

    const handleCancel = () => {
        reset();
        setSearchTerm('');
        setFormKey(Date.now());
    };

    const createMutation = useMutation({
        mutationFn: createAcompanhamento,
        onSuccess: () => {
            toast.success('Acompanhamento criado com sucesso!');
            queryClient.invalidateQueries({ queryKey: ['acompanhamentos'] });
            handleCancel();
        },
        onError: (err: any) => toast.error(`Erro ao criar acompanhamento: ${err.message}`),
    });

    const onSubmit = (data: FormData) => {
        const formattedTime = data.sessionTime.length === 5 ? `${data.sessionTime}:00` : data.sessionTime;
        const payload: CreateFollowUp = { ...data, sessionTime: formattedTime, studentId };
        createMutation.mutate(payload);
    };

    return (
        // ESTILO: Removida a borda daqui para focar nas seções internas
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <SessionFormFields
                key={formKey}
                register={register}
                errors={errors}
                control={control}
                professionalSearchIsLoading={professionalSearchIsLoading}
                searchedOptions={searchedOptions}
                onProfessionalSearchChange={setSearchTerm}
            />

            <fieldset className="space-y-4 rounded-lg border border-gray-200 p-4 pt-6 relative">
                <legend className="absolute -top-3 left-3 bg-white px-2 text-base font-semibold text-ifpr-green">
                    Registros do Acompanhamento
                </legend>
                <Textarea id='description' label="Descrição do Acompanhamento" {...register('description')} error={errors.description?.message} />
                <Input id='areasCovered' label="Áreas Abordadas" {...register('areasCovered')} error={errors.areasCovered?.message} />
                <Textarea id='nextSteps' label="Próximos Passos" {...register('nextSteps')} error={errors.nextSteps?.message} />
                <Textarea id="tasks" label="Tarefas / Encaminhamentos" {...register('tasks' as any)} error={errors.tasks?.message as string} />
            </fieldset>

            <div className="flex justify-end pt-2 gap-4">
                <Button type="button" variant="secondary" onClick={handleCancel}>
                    Cancelar
                </Button>
                <Button type="submit" loading={isSubmitting || createMutation.isPending}>
                    Salvar Acompanhamento
                </Button>
            </div>
        </form>
    );
}