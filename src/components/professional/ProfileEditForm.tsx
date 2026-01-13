// src/components/professional/ProfileEditForm.tsx

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { changeMyPassword, updateProfessional } from '../../services/professionalService';
import type { UpdateProfessionalDTO } from '../../types/professional';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { useUserProfile } from '../../hooks/professional/useUserProfile';
import { useForm, Controller } from 'react-hook-form';

// 1. Importe os ícones
import { User, AtSign, Briefcase, LoaderCircle } from 'lucide-react';

// 2. Importe seus componentes de UI padronizados
import Button from '../ui/Button';
import Select from '../ui/Select';
import Input from '../ui/Input';
import IconInput from '../ui/IconInput';
import PasswordInput from '../ui/PasswordInput';
import { specialtyOptions } from './ProfessionalOptions';

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

    const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');


    const { register, handleSubmit, formState: { errors }, reset, control } = useForm<FormData>({
        mode: 'onChange'
    });

    useEffect(() => {
        if (profile) {
            reset({ ...profile, specialty: profile.specialty || '' });
        }
    }, [profile, reset]);

    const { mutate: updateProfileMutation, isPending: isUpdating } = useMutation({
        mutationFn: (data: UpdateProfessionalDTO) => updateProfessional(profile!.id, data),
        onSuccess: () => {
            toast.success('Perfil atualizado com sucesso!');
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            onClose();
        },
        onError: (err) => toast.error(`Erro ao atualizar: ${err.message}`),
    });

    const { mutate: changePasswordMutation, isPending: isChangingPassword } = useMutation({
        mutationFn: changeMyPassword,
        onSuccess: () => {
            toast.success('Senha alterada com sucesso!');
            setActiveTab('profile');
            reset({ ...profile, currentPassword: '', newPassword: '' });
        },
        onError: () => toast.error('Erro ao alterar a senha. Verifique a senha atual.'),
    });

    const onPasswordSubmit = handleSubmit((data) => {
        if (data.newPassword && data.currentPassword) {
            changePasswordMutation({
                newPassword: data.newPassword,
                currentPassword: data.currentPassword,
            });
        }
    });

    const onProfileSubmit = handleSubmit((data) => {
        updateProfileMutation(data);
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-8 min-h-[300px]">
                <LoaderCircle className="animate-spin h-8 w-8 text-ifpr-green" />
                <span className="ml-3 text-gray-600">Carregando dados do perfil...</span>
            </div>
        );
    }

    if (isError || !profile) {
        return (
            <div className="p-8 text-center text-red-600 min-h-[300px]">
                <p className="font-semibold text-lg">Falha ao carregar seus dados.</p>
                <p className="text-sm text-gray-600 mt-2">Por favor, feche o modal e tente novamente.</p>
            </div>
        );
    }

    // Helper para classes de Aba
    const getTabClassName = (tabName: 'profile' | 'password') => {
        const base = "px-4 py-2 font-medium text-sm rounded-t-md cursor-pointer";
        if (activeTab === tabName) {
            return `${base} border-b-2 border-blue-600 text-blue-600`;
        }
        return `${base} text-gray-500 hover:text-gray-800`;
    };

    return (
        <div className="space-y-4">
            {/* 5. Navegação das Abas (continua igual) */}
            <div className="border-b border-gray-200">
                <nav className="flex space-x-2">
                    <button type="button" className={getTabClassName('profile')} onClick={() => setActiveTab('profile')}>
                        Dados Pessoais
                    </button>
                    <button type="button" className={getTabClassName('password')} onClick={() => setActiveTab('password')}>
                        Alterar Senha
                    </button>
                </nav>
            </div>

            {/* 6. Conteúdo da Aba de Perfil (Agora COMPONENTIZADO) */}
            {activeTab === 'profile' && (
                <form onSubmit={onProfileSubmit} className="space-y-4 pt-2">
                    <IconInput
                        id="email"
                        label="E-mail"
                        icon={AtSign}
                        {...register('email')}
                        readOnly
                        disabled
                        className="bg-gray-100"
                    />

                    <IconInput
                        id="fullName"
                        label="Nome Completo"
                        icon={User}
                        {...register('fullName', { required: 'Nome é obrigatório' })}
                        error={errors.fullName?.message}
                    />

                    {/* Wrapper para o ícone do Select */}
                    <div className="relative">
                        <span className="absolute top-9 left-0 flex items-center pl-3.5 z-10">
                            <Briefcase className="h-5 w-5 text-gray-400" />
                        </span>
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
                                    className="pl-10" // Seu Select.tsx aceita 'className'
                                />
                            )}
                        />
                    </div>

                    <Input
                        id="role"
                        label="Função"
                        value={profile?.role.replace(/_/g, " ") || ''}
                        readOnly
                        disabled
                        className="bg-gray-100"
                    />

                    {/* 7. Botão de Ação Alinhado (usando seu componente Button) */}
                    <div className="flex justify-end pt-4 mt-4 border-t">
                        <Button type="submit" loading={isUpdating}>
                            {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
                        </Button>
                    </div>
                </form>
            )}

            {/* 8. Conteúdo da Aba de Senha (Agora COMPONENTIZADO) */}
            {activeTab === 'password' && (
                <form onSubmit={onPasswordSubmit} className="space-y-4 pt-2" autoComplete="off">
                    <PasswordInput
                        id="currentPassword"
                        label="Senha Atual"
                        autoComplete="current-password"
                        {...register('currentPassword', { required: 'Senha atual é obrigatória' })}
                        error={errors.currentPassword?.message}
                    />

                    <PasswordInput
                        id="newPassword"
                        label="Nova Senha"
                        autoComplete="new-password"
                        {...register('newPassword', { required: 'Nova senha é obrigatória' })}
                        error={errors.newPassword?.message}
                    />

                    {/* Botão de Ação Alinhado (usando seu componente Button) */}
                    <div className="flex justify-end pt-4 mt-4 border-t">
                        <Button type="submit" loading={isChangingPassword}>
                            {isChangingPassword ? 'Alterando...' : 'Alterar Senha'}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}