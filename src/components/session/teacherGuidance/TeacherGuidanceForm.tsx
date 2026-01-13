import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
    createTeacherGuidanceSchema,
    type CreateTeacherGuidanceFormData,
} from './teacherGuidanceSchema';
import { createTeacherGuidance, updateTeacherGuidance } from '../../../services/teacherGuidanceService';
import type { CreateTeacherGuidance, ReadTeacherGuidance, UpdateTeacherGuidance } from '../../../types/teacherGuidance';
import FormContainer from '../../ui/FormContainer';
import Textarea from '../../ui/Textarea';
import { useState, useEffect } from 'react';
import Select from '../../ui/Select';
import type { ReadService } from '../../../types/atendimento';
import type { ReadFollowUp } from '../../../types/followUp';
const localOptions = [
    { value: 'false', label: 'Sala de Aula' },
    { value: 'true', label: 'Domiciliar' },
];
interface Props {
    onClose: () => void;
    serviceId?: string;
    followUpId?: string;
    existingGuidance?: ReadTeacherGuidance;
}

export default function TeacherGuidanceForm({
    onClose,
    serviceId,
    followUpId,
    existingGuidance,
}: Props) {
    const queryClient = useQueryClient();
    const [apiError, setApiError] = useState<string | null>(null);

    const isEditMode = !!existingGuidance;
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<CreateTeacherGuidanceFormData>({
        resolver: zodResolver(createTeacherGuidanceSchema),
        defaultValues: {
            guidanceDetails: existingGuidance?.guidanceDetails || '',
            recommendations: existingGuidance?.recommendations || '',
            domiciliar: existingGuidance?.domiciliar || false,
        },
    });
    useEffect(() => {
        if (existingGuidance) {
            reset({
                guidanceDetails: existingGuidance.guidanceDetails,
                recommendations: existingGuidance.recommendations,
                domiciliar: existingGuidance.domiciliar,
            });
        } else {
            reset({
                guidanceDetails: '',
                recommendations: '',
                domiciliar: false,
            });
        }
    }, [existingGuidance, reset]);

    const createMutation = useMutation({
        mutationFn: (data: CreateTeacherGuidance) => createTeacherGuidance(data),
        onSuccess: () => {
            toast.success('Orientação Pedagógica criada com sucesso!');
            if (serviceId) queryClient.invalidateQueries({ queryKey: ['atendimento', serviceId] });
            if (followUpId) queryClient.invalidateQueries({ queryKey: ['acompanhamento', followUpId] });
            onClose();
        },
        onError: (err: any) => {
            const message = err.response?.data?.message || 'Erro ao criar orientação.';
            setApiError(message);
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: UpdateTeacherGuidance) =>
            updateTeacherGuidance(existingGuidance!.id, data),
        onSuccess: (updatedGuidanceData) => {
            toast.success('Orientação atualizada com sucesso!');

            if (serviceId) {
                const queryKey = ['atendimento', serviceId];
                queryClient.setQueryData<ReadService>(queryKey, (oldData) => {
                    if (!oldData) return oldData;
                    return { ...oldData, teacherGuidance: updatedGuidanceData };
                });
            }

            if (followUpId) {
                const queryKey = ['acompanhamento', followUpId];
                queryClient.setQueryData<ReadFollowUp>(queryKey, (oldData) => {
                    if (!oldData) return oldData;
                    return { ...oldData, teacherGuidance: updatedGuidanceData };
                });
            }

            onClose();
        },
        onError: (err: any) => {
            const message = err.response?.data?.message || 'Erro ao atualizar orientação.';
            setApiError(message);
        },

    });

    const onSubmit = (formData: CreateTeacherGuidanceFormData) => {
        setApiError(null);
        const domiciliarValue = formData.domiciliar;

        if (isEditMode) {
            const dataToSubmit: UpdateTeacherGuidance = {
                guidanceDetails: formData.guidanceDetails,
                recommendations: formData.recommendations,
                domiciliar: domiciliarValue
            };
            updateMutation.mutate(dataToSubmit);
        } else {
            const dataToSubmit: CreateTeacherGuidance = {
                guidanceDetails: formData.guidanceDetails,
                recommendations: formData.recommendations,
                domiciliar: domiciliarValue,
                serviceId: serviceId || null,
                followUpId: followUpId || null,
            };
            createMutation.mutate(dataToSubmit);
        }
    };
    return (
        <FormContainer
            title={isEditMode ? "Editar Orientação Pedagógica" : "Criar Orientação Pedagógica"}
            onSubmit={handleSubmit(onSubmit)}
            onClose={onClose}
            isLoading={createMutation.isPending || updateMutation.isPending}
        >

            <Controller
                name="domiciliar"
                control={control}
                render={({ field }) => (
                    <Select
                        id="domiciliar"
                        label="Local da Orientação"
                        options={localOptions}
                        value={String(field.value)}
                        onChange={field.onChange}
                        error={errors.domiciliar?.message}
                    />
                )}
            />

            <Textarea
                id="guidanceDetails"
                label="Detalhes da Orientação"
                {...register('guidanceDetails')}
                error={errors.guidanceDetails?.message}
                rows={6}
            />

            <Textarea
                id="recommendations"
                label="Recomendações / Encaminhamentos"
                {...register('recommendations')}
                error={errors.recommendations?.message}
                rows={6}
            />
        </FormContainer>
    );
}