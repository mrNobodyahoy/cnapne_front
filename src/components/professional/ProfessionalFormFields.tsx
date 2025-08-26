    // src/components/student/StudentFormFields.tsx
    import type { FieldErrors, UseFormRegister, Control } from 'react-hook-form';
    import Input from '../ui/Input';
    import type { CreateFormData } from './ProfessionalForm';

    type Props = {
    register: UseFormRegister<CreateFormData>;
    errors: FieldErrors<CreateFormData>;
    control: Control<CreateFormData>;
    };


    export default function ProfessionalFormFields({ register, errors }: Props) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
    <Input
    label="Nome Completo"
    type="text"
    placeholder="Digite o nome completo"
    id="fullName"
    {...register("fullName")}
    error={errors.fullName?.message}
    />

    <Input
    label="E-mail"
    type="email"
    placeholder="exemplo@email.com"
    id="email"
    {...register("email")}
    error={errors.email?.message}
    />

    <Input
    label="Senha"
    type="password"
    placeholder="Digite uma senha"
    id="password"
    {...register("password")}
    error={errors.password?.message}
    />

    <Input
    label="Especialidade"
    type="text"
    placeholder="Digite a especialidade"
    id="specialty"
    {...register("specialty")}
    error={errors.specialty?.message}
    />

    <Input
    label="Função"
    type="text"
    placeholder="Digite a função"
        id="role"
        {...register("role")}
        error={errors.role?.message}
    />
        </div>
    );
    }
