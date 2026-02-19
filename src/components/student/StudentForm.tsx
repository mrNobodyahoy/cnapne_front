import { useForm, useFieldArray } from 'react-hook-form';
import { useMutation, useQueryClient } from "@tanstack/react-query";

import StudentFields from './StudentFields';
import ResponsibleFormFields from './responsible/ResponsibleFormFields'; // Importe o componente dos responsáveis
import { useMinorLogic } from '../../hooks/util/useMinorLogic'; // Ajuste o caminho do seu hook

import { createStudent } from "../../services/studentService";
import type { CreateStudentDTO } from "../../types/student";

interface StudentFormProps {
  onClose: () => void;
}

export default function StudentForm({ onClose }: StudentFormProps) {
  const queryClient = useQueryClient();

  // 1. Inicializa o react-hook-form adicionando o "watch"
  const {
    register,
    handleSubmit,
    control,
    watch, // <-- Necessário para observar a data de nascimento
    formState: { errors }
  } = useForm<CreateStudentDTO>({
    defaultValues: {
      responsibles: [] // Inicializa o array vazio
    }
  });

  // 2. Configura o Field Array para gerenciar a lista de responsáveis
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "responsibles" // Este nome deve bater com a sua interface CreateStudentDTO
  });

  // 3. Chama a sua lógica de verificar idade
  const { isMinor } = useMinorLogic({
    watch,
    fieldArray: { fields, append, replace }
  });

  // Configura a requisição para a API
  const mutation = useMutation({
    mutationFn: createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      onClose();
    },
    onError: (err: any) => {
      alert("Erro ao criar estudante: " + err.message);
    }
  });

  const onSubmit = (data: CreateStudentDTO) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">

      <StudentFields
        register={register}
        control={control}
        errors={errors}
        variant="create"
      />

      {/* 4. Renderiza os responsáveis se for menor de idade ou se já houver algum na lista */}
      {(isMinor || fields.length > 0) && (
        <div className="pt-6 mt-6 border-t border-gray-200">
          <ResponsibleFormFields
            control={control}
            register={register}
            errors={errors}
            fields={fields}
            append={append as any}
            remove={remove}
          />
        </div>
      )}

      {/* Botões do Formulário */}
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 focus:outline-none"
        >
          {mutation.isPending ? "Salvando..." : "Salvar Estudante"}
        </button>
      </div>
    </form>
  );
}