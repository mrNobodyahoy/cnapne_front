import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { createAcompanhamento } from '../../../services/followUpService';
import { useProfessionalSearch } from '../../../hooks/professional/useProfessionalSearch';
import type { CreateFollowUp } from '../../../types/followUp';

import Button from '../../ui/Button';
import Textarea from '../../ui/Textarea';
import Input from '../../ui/Input';
import ProfessionalSelect from '../../professional/ProfessionalSelect';

const createFollowUpSchema = z.object({
    sessionDate: z.string().min(1, 'Data é obrigatória.'),
    sessionTime: z.string().min(1, 'Horário é obrigatório.'),
    sessionLocation: z.string().min(1, 'Local é obrigatório.'),
    description: z.string().min(1, 'Descrição é obrigatória.'),
    tasks: z.string().min(1, 'Tarefas/Encaminhamentos são obrigatórias.'),
    professionalIds: z.array(z.string()).min(1, 'Selecione ao menos um profissional.'),
    areasCovered: z.string().optional(),
});

type FormData = z.infer<typeof createFollowUpSchema>;

interface FollowUpFormProps {
    studentId: string;
}

export default function FollowUpForm({ studentId }: FollowUpFormProps) {
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
        onError: (err: any) => {
            toast.error(`Erro ao criar acompanhamento: ${err.message}`);
            console.error("Erro detalhado da mutation:", err);
        }
    });

    const onSubmit = (data: FormData) => {
        const formattedTime = data.sessionTime.length === 5 ? `${data.sessionTime}:00` : data.sessionTime;
        const payload: CreateFollowUp = {
            ...data,
            sessionTime: formattedTime,
            status: 'AGENDADO',
            studentId
        };
        createMutation.mutate(payload);
    };

    return (
        <form key={formKey} onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
                    Registros do Acompanhamento
                </legend>
                <Textarea id='description' label="Descrição do Acompanhamento" {...register('description')} error={errors.description?.message} />
                <Input id='areasCovered' label="Áreas Abordadas (Opcional)" {...register('areasCovered')} error={errors.areasCovered?.message} />
                <Textarea id="tasks" label="Tarefas / Encaminhamentos" {...register('tasks')} error={errors.tasks?.message} />
            </fieldset>

            {/* --- BOTÕES DE AÇÃO --- */}
            <div className="flex justify-end pt-4 gap-4">
                <Button type="button" variant="secondary" onClick={handleCancel} disabled={isSubmitting || createMutation.isPending}>
                    Limpar
                </Button>
                <Button type="submit" loading={isSubmitting || createMutation.isPending}>
                    Salvar Acompanhamento
                </Button>
            </div>
        </form>
    );
}