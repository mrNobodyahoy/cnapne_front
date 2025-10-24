import { useMutation, useQueryClient } from '@tanstack/react-query';
import { changeMyPassword } from '../../services/professionalService';
import { updateProfessional } from '../../services/professionalService';
import type { UpdateProfessionalDTO } from '../../types/professional';
import { LoaderCircle, Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useUserProfile } from '../../hooks/professional/useUserProfile';
import Select from '../ui/Select';
import { specialtyOptions } from './ProfessionalOptions';
import { useForm, Controller } from 'react-hook-form';


interface ProfileEditFormProps {
    onClose: () => void;
}

type FormData = UpdateProfessionalDTO & {
    currentPassword?: string;
    newPassword?: string;
};

export function ProfileEditForm({ onClose }: ProfileEditFormProps) {
    const queryClient = useQueryClient();
    const { data: profile, isLoading, isError } = useUserProfile();

    const [view, setView] = useState<'profile' | 'password'>('profile');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);


    const { register, handleSubmit, formState: { errors }, reset, control } = useForm<FormData>({
        mode: 'onChange'
    });

    useEffect(() => {
        if (profile) {
            const profileData = {
                ...profile,
                specialty: profile.specialty || '',
            };
            reset(profileData);
        }
    }, [profile, reset]);

    const { mutate: updateProfileMutation, isPending: isUpdating } = useMutation({
        mutationFn: (data: UpdateProfessionalDTO) => updateProfessional(profile!.id, data),
        onSuccess: () => {
            alert('Perfil atualizado com sucesso!');
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            onClose();
        },
        onError: (err) => alert(`Erro: ${err.message}`),
    });

    const { mutate: changePasswordMutation, isPending: isChangingPassword } = useMutation({
        mutationFn: changeMyPassword,
        onError: () => alert('Erro ao alterar a senha. Verifique a senha atual.'),
    });

    const onPasswordSubmit = handleSubmit((data) => {
        if (data.newPassword && data.currentPassword) {
            changePasswordMutation({
                newPassword: data.newPassword,
                currentPassword: data.currentPassword,
            }, {
                onSuccess: () => {
                    alert('Senha alterada com sucesso!');
                    setView('profile');
                    reset({ ...profile, currentPassword: '', newPassword: '' });
                }
            });
        } else {
            alert("Por favor, preencha a senha atual e a nova senha.");
        }
    });

    const onProfileSubmit = handleSubmit((data) => {
        updateProfileMutation(data);
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-8 min-h-[300px]">
                <LoaderCircle className="animate-spin h-8 w-8 text-ifpr-green" />
                <span className="ml-2">Carregando dados...</span>
            </div>
        );
    }

    if (isError || !profile) {
        return (
            <div className="p-4 text-center text-red-600 min-h-[300px]">
                <p className="font-semibold">Falha ao carregar seus dados.</p>
                <p className="text-sm">Por favor, feche e tente novamente.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {view === 'profile' && (
                <form onSubmit={onProfileSubmit} className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Dados Pessoais</h3>

                    <div>
                        <label className="label-style">E-mail</label>
                        <input {...register('email')} className="input-style bg-gray-100" readOnly disabled autoComplete='username' />
                    </div>

                    <div>
                        <label htmlFor="fullName" className="label-style">Nome Completo</label>
                        <input id="fullName" {...register('fullName', { required: 'Nome é obrigatório' })} className="input-style" />
                        {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
                    </div>


                    <Controller
                        name="specialty"
                        control={control}
                        rules={{ required: 'Especialidade é obrigatória' }}
                        render={({ field }) => (
                            <Select
                                id="specialty"
                                label="Especialidade"
                                options={specialtyOptions}
                                placeholder="Selecione sua especialidade"
                                error={errors.specialty?.message}
                                {...field}
                            />
                        )}
                    />

                    <div>
                        <label className="label-style">Função</label>
                        <input value={profile.role.replace(/_/g, " ")} className="input-style bg-gray-100" readOnly disabled />
                    </div>

                    <div className="flex flex-col items-center gap-3 pt-4">
                        <button type="submit" disabled={isUpdating} className="btn-primary">
                            {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
                        </button>

                        <button
                            type="button"
                            onClick={() => setView('password')}
                            className="btn-blue"
                        >
                            Alterar Senha
                        </button>
                    </div>
                </form>
            )}

            {view === 'password' && (
                <form onSubmit={onPasswordSubmit} className="space-y-4" autoComplete="off">
                    <h3 className="text-lg font-semibold text-gray-800">Alterar Senha</h3>

                    <div className="relative">
                        <label htmlFor="currentPassword" className="label-style">Senha Atual</label>
                        <input
                            id="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            {...register('currentPassword', { required: 'Senha atual é obrigatória' })}
                            className="input-style pr-10"
                            autoComplete="current-password"
                        />
                        <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute inset-y-0 right-0 top-6 flex items-center pr-3 text-gray-500">
                            {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                        {errors.currentPassword && <p className="text-red-500 text-sm mt-1">{errors.currentPassword.message}</p>}
                    </div>

                    <div className="relative">
                        <label htmlFor="newPassword" className="label-style">Nova Senha</label>
                        <input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            {...register('newPassword', { required: 'Nova senha é obrigatória' })}
                            className="input-style pr-10"
                            autoComplete="new-password"
                        />
                        <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute inset-y-0 right-0 top-6 flex items-center pr-3 text-gray-500">
                            {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                        {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>}
                    </div>

                    <div className="flex flex-col items-start gap-4 pt-4">
                        <button type="submit" disabled={isChangingPassword} className="btn-primary">
                            {isChangingPassword ? 'Alterando...' : 'Alterar Senha'}
                        </button>

                        <button
                            type="button"
                            onClick={() => setView('profile')}
                            className="text-gray-600 hover:underline text-sm font-medium transition-colors"
                        >
                            Voltar
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}