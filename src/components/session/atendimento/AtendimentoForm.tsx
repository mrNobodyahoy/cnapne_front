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
import ProfessionalSelect from '../../professional/ProfessionalSelect';
import { useProfessionalSearch } from '../../../hooks/professional/useProfessionalSearch';

const createServiceSchema = z.object({
    sessionDate: z.string().min(1, 'Data é obrigatória.'),
    sessionTime: z.string().min(1, 'Horário é obrigatório.'),
    sessionLocation: z.string().min(1, 'Local é obrigatório.'),
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

    const [_, setFormKey] = useState(Date.now());
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
        const payload: CreateService = { ...data, status: 'AGENDADO', sessionTime: formattedTime, studentId };
        createMutation.mutate(payload);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* --- SEÇÃO DE AGENDAMENTO --- */}
            <fieldset className="space-y-4 rounded-lg border border-gray-200 p-6 relative shadow-sm">
                <legend className="absolute -top-3.5 left-4 bg-white px-2 text-base font-semibold text-ifpr-green">
                    Agendamento
                </legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input id="sessionDate" label="Data" type="date" {...register('sessionDate')} error={errors.sessionDate?.message} />
                    <Input id="sessionTime" label="Horário" type="time" {...register('sessionTime')} error={errors.sessionTime?.message} />
                    <div className="md:col-span-2">
                        <Input id="sessionLocation" label="Local" {...register('sessionLocation')} error={errors.sessionLocation?.message} />
                    </div>
                </div>
            </fieldset>

            {/* --- SEÇÃO DE EQUIPE --- */}
            <fieldset className="space-y-4 rounded-lg border border-gray-200 p-6 relative shadow-sm">
                <legend className="absolute -top-3.5 left-4 bg-white px-2 text-base font-semibold text-ifpr-green">
                    Equipe
                </legend>
                <ProfessionalSelect
                    control={control}
                    error={errors.professionalIds?.message as string}
                    isLoading={professionalSearchIsLoading}
                    searchedOptions={searchedOptions}
                    onSearchChange={setSearchTerm}
                />
            </fieldset>

            {/* --- SEÇÃO DE REGISTROS --- */}
            <fieldset className="space-y-4 rounded-lg border border-gray-200 p-6 relative shadow-sm">
                <legend className="absolute -top-3.5 left-4 bg-white px-2 text-base font-semibold text-ifpr-green">
                    Registros do Atendimento
                </legend>
                <Input id='typeService' label="Tipo do Atendimento" {...register('typeService')} error={errors.typeService?.message} />
                <Textarea id='descriptionService' label="Descrição do Atendimento" {...register('descriptionService')} error={errors.descriptionService?.message} />
                <Textarea id='objectives' label="Objetivos da Sessão (Opcional)" {...register('objectives')} error={errors.objectives?.message} />
                <Textarea id="tasks" label="Tarefas / Encaminhamentos" {...register('tasks')} error={errors.tasks?.message} />
            </fieldset>

            {/* --- BOTÕES DE AÇÃO --- */}
            <div className="flex justify-end pt-4 gap-4">
                <Button type="button" variant="secondary" onClick={handleCancel} disabled={isSubmitting || createMutation.isPending}>
                    Limpar
                </Button>
                <Button type="submit" loading={isSubmitting || createMutation.isPending}>
                    Salvar Atendimento
                </Button>
            </div>
        </form>
    );
}