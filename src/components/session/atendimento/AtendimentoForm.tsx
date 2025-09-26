// src/components/session/atendimento/AtendimentoForm.tsx
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAtendimento } from '../../../services/atendimentoService';
import type { CreateService } from '../../../types/atendimento';
import toast from 'react-hot-toast';
import { useState } from 'react';

import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Textarea from '../../ui/Textarea';
import SessionFormFields from '../SessionFormFields';
import { useProfessionalSearch } from '../../../hooks/useProfessionalSearch';

const createServiceSchema = z.object({
    sessionDate: z.string().min(1, 'Data é obrigatória.'),
    sessionTime: z.string().min(1, 'Horário é obrigatório.'),
    sessionLocation: z.string().min(1, 'Local é obrigatório.'),
    status: z.string().min(1, 'Status é obrigatório.'),
    typeService: z.string().min(1, 'Tipo do atendimento é obrigatório.'),
    descriptionService: z.string().min(1, 'Descrição é obrigatória.'),
    tasks: z.string().min(1, 'Tarefas/Encaminhamentos são obrigatórias.'),
    professionalIds: z.array(z.string()).min(1, 'Selecione ao menos um profissional.'),
    objectives: z.string().optional(),
});

type FormData = z.infer<typeof createServiceSchema>;

export default function AtendimentoForm({ studentId }: { studentId: string }) {
    const queryClient = useQueryClient();
    const { register, control, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
        resolver: zodResolver(createServiceSchema)
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
        mutationFn: createAtendimento,
        onSuccess: () => {
            toast.success('Atendimento criado com sucesso!');
            queryClient.invalidateQueries({ queryKey: ['atendimentos'] });
            handleCancel();
        },
        onError: (err: any) => {
            toast.error(`Erro ao criar atendimento: ${err.message}`),
                console.error("Erro detalhado da mutation:", err);
        }
    });

    const onSubmit = (data: FormData) => {
        const formattedTime = data.sessionTime.length === 5 ? `${data.sessionTime}:00` : data.sessionTime;
        const payload: CreateService = { ...data, sessionTime: formattedTime, studentId };
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
                    Registros do Atendimento
                </legend>
                <Input id='typeService' label="Tipo do Atendimento" {...register('typeService')} error={errors.typeService?.message} />
                <Textarea id='descriptionService' label="Descrição do Atendimento" {...register('descriptionService')} error={errors.descriptionService?.message} />
                <Textarea id='objectives' label="Objetivos da Sessão" {...register('objectives')} error={errors.objectives?.message} />
                <Textarea id="tasks" label="Tarefas / Encaminhamentos" {...register('tasks' as any)} error={errors.tasks?.message as string} />
            </fieldset>

            <div className="flex justify-end pt-2 gap-4">
                <Button type="button" variant="secondary" onClick={handleCancel}>
                    Cancelar
                </Button>
                <Button type="submit" loading={isSubmitting || createMutation.isPending}>
                    Salvar Atendimento
                </Button>
            </div>
        </form>
    );
}