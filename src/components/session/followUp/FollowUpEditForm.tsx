import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAcompanhamento } from '../../../services/followUpService';
import type { UpdateFollowUp, ReadFollowUp } from '../../../types/followUp';
import { useProfessionalSearch } from '../../../hooks/professional/useProfessionalSearch';
import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import toast from 'react-hot-toast';

import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Textarea from '../../ui/Textarea';
import ReactSelect from 'react-select';
import Select from '../../ui/Select';
import { statusOptions } from '../../../lib/constants';

const updateFollowUpSchema = z.object({
    sessionDate: z.string().min(1, 'Data é obrigatória.'),
    sessionTime: z.string().min(1, 'Horário é obrigatório.'),
    sessionLocation: z.string().min(1, 'Local é obrigatório.'),
    status: z.string().min(1, 'Status é obrigatório.'),
    description: z.string().min(1, 'Descrição é obrigatória.'),
    tasks: z.string().min(1, 'Tarefas/Encaminhamentos são obrigatórias.'),
    professionalIds: z.array(z.string()).min(1, 'Selecione ao menos um profissional.'),
    areasCovered: z.string().optional(),
    nextSteps: z.string().optional(),
});

type FormData = z.infer<typeof updateFollowUpSchema>;

interface FollowUpEditFormProps {
    followUp: ReadFollowUp;
}

export default function FollowUpEditForm({ followUp }: FollowUpEditFormProps) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(updateFollowUpSchema),
        defaultValues: {
            ...followUp,
            sessionDate: followUp.sessionDate.split('T')[0],
            professionalIds: followUp.professionals.map(p => p.id),
        }
    });

    const { setSearchTerm, searchedProfessionals, isLoading: professionalSearchIsLoading } = useProfessionalSearch();

    const [selectedOptions, setSelectedOptions] = useState(() =>
        followUp.professionals.map(p => ({ value: p.id, label: p.fullName }))
    );

    const allOptions = useMemo(() => {
        const optionsMap = new Map();
        selectedOptions.forEach(option => optionsMap.set(option.value, option));
        searchedProfessionals?.forEach(prof => optionsMap.set(prof.id, { value: prof.id, label: prof.fullName }));
        return Array.from(optionsMap.values());
    }, [selectedOptions, searchedProfessionals]);

    const updateMutation = useMutation({
        mutationFn: (data: UpdateFollowUp) => updateAcompanhamento(followUp.sessionId, data),
        onSuccess: () => {
            toast.success('Acompanhamento atualizado com sucesso!');
            queryClient.invalidateQueries({ queryKey: ['acompanhamentos'] });
            queryClient.invalidateQueries({ queryKey: ['acompanhamento', followUp.sessionId] });
            navigate(`/acompanhamentos/${followUp.sessionId}`);
        },
        onError: (err: any) => toast.error(`Erro ao atualizar: ${err.message}`),
    });

    const onSubmit = (data: FormData) => {
        const payload: UpdateFollowUp = { ...data, studentId: followUp.student.id };
        updateMutation.mutate(payload);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <fieldset className="space-y-4 rounded-lg border border-gray-200 p-6 relative shadow-sm">
                <legend className="absolute -top-3.5 left-4 bg-white px-2 text-base font-semibold text-ifpr-green">
                    Agendamento e Status
                </legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input id="sessionDate" label="Data" type="date" {...register('sessionDate')} error={errors.sessionDate?.message} />
                    <Input id="sessionTime" label="Horário" type="time" {...register('sessionTime')} error={errors.sessionTime?.message} />
                    <Input id="sessionLocation" label="Local" {...register('sessionLocation')} error={errors.sessionLocation?.message} className="md:col-span-2" />
                    <Select id="status" label="Status" options={statusOptions} {...register('status')} error={errors.status?.message} className="md:col-span-2" />
                </div>
            </fieldset>

            <fieldset className="space-y-4 rounded-lg border border-gray-200 p-6 relative shadow-sm">
                <legend className="absolute -top-3.5 left-4 bg-white px-2 text-base font-semibold text-ifpr-green">
                    Equipe
                </legend>
                <div className="md:col-span-2 space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Profissionais Envolvidos
                    </label>
                    <Controller
                        name="professionalIds"
                        control={control}
                        render={({ field }) => (
                            <ReactSelect
                                value={selectedOptions}
                                isMulti
                                placeholder="Digite para buscar um profissional..."
                                isLoading={professionalSearchIsLoading}
                                options={allOptions}
                                onInputChange={(value) => setSearchTerm(value)}
                                noOptionsMessage={({ inputValue }) =>
                                    !inputValue ? 'Digite para buscar...' : 'Nenhum profissional encontrado'
                                }
                                onChange={(currentSelection) => {
                                    const newSelectedOptions = currentSelection as { value: string, label: string }[];
                                    setSelectedOptions(newSelectedOptions);
                                    field.onChange(newSelectedOptions.map(option => option.value));
                                }}
                            />
                        )}
                    />
                    {errors.professionalIds && <p className="text-sm text-red-600 mt-1">{errors.professionalIds.message}</p>}
                </div>
            </fieldset>

            <fieldset className="space-y-4 rounded-lg border border-gray-200 p-6 relative shadow-sm">
                <legend className="absolute -top-3.5 left-4 bg-white px-2 text-base font-semibold text-ifpr-green">
                    Registros do Acompanhamento
                </legend>
                <Textarea id='description' label="Descrição" {...register('description')} error={errors.description?.message} />
                <Input id='areasCovered' label="Áreas Abordadas (Opcional)" {...register('areasCovered')} error={errors.areasCovered?.message} />
                <Textarea id='nextSteps' label="Próximos Passos (Opcional)" {...register('nextSteps')} error={errors.nextSteps?.message} />
                <Textarea id="tasks" label="Tarefas / Encaminhamentos" {...register('tasks')} error={errors.tasks?.message} />
            </fieldset>

            <div className="flex justify-end pt-4 gap-4">
                <Button type="button" variant="secondary" onClick={() => navigate(`/acompanhamentos/${followUp.sessionId}`)} disabled={updateMutation.isPending}>
                    Cancelar
                </Button>
                <Button type="submit" loading={isSubmitting || updateMutation.isPending}>
                    Salvar Alterações
                </Button>
            </div>
        </form>
    );
}