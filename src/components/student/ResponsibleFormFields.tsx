import { Controller, type Control, type FieldErrors, type UseFormRegister, type UseFieldArrayAppend, type UseFieldArrayRemove, type FieldArrayWithId } from 'react-hook-form';
import { Trash, Plus } from 'lucide-react';

import type { CreateFormData } from './StudentForm';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { formatPhone } from '../../lib/formatters';

type Props = {
  control: Control<CreateFormData>;
  register: UseFormRegister<CreateFormData>;
  errors: FieldErrors<CreateFormData>;
  fields: FieldArrayWithId<CreateFormData, "responsibles", "id">[];
  append: UseFieldArrayAppend<CreateFormData, "responsibles">;
  remove: UseFieldArrayRemove;
};

export default function ResponsibleFormFields({ register, errors, fields, append, remove, control }: Props) { // <<< MUDANÇA AQUI: Adiciona 'control'
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-ifpr-black">
        Cadastro de Responsável
      </h3>
      {fields.map((item, index) => (
        <div key={item.id} className="p-4 border rounded-lg space-y-4 relative">
          <Button
            type="button"
            onClick={() => remove(index)}
            className="absolute top-2 right-2 bg-transparent text-red-500 hover:bg-red-100 p-1"
            title="Remover Responsável"
          >
            <Trash className="h-4 w-4" />
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            <Input
              id={`responsibles.${index}.completeName`}
              label={`Nome Completo do Responsável ${index + 1}`}
              {...register(`responsibles.${index}.completeName`)}
              error={errors.responsibles?.[index]?.completeName?.message}
            />
             <Input
              id={`responsibles.${index}.email`}
              label={`E-mail do Responsável ${index + 1}`}
              type="email"
              {...register(`responsibles.${index}.email`)}
              error={errors.responsibles?.[index]?.email?.message}
            />
            
            {/* <<< MUDANÇA AQUI: Substituído o Input simples pelo Controller */}
            <Controller
              name={`responsibles.${index}.phone`}
              control={control}
              render={({ field }) => (
                <Input
                  id={`responsibles.${index}.phone`}
                  label={`Telefone do Responsável ${index + 1}`}
                  type="tel"
                  placeholder="(99) 99999-9999"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(formatPhone(e.target.value))}
                  error={errors.responsibles?.[index]?.phone?.message}
                />
              )}
            />
            
            <Input
              id={`responsibles.${index}.kinship`}
              label={`Parentesco do Responsável ${index + 1}`}
              {...register(`responsibles.${index}.kinship`)}
              error={errors.responsibles?.[index]?.kinship?.message}
            />
          </div>
        </div>
      ))}
      
      <Button
        type="button"
        onClick={() => append({ completeName: '', email: '', phone: '', kinship: '' })}
        className="flex items-center gap-2 text-ifpr-green border border-ifpr-green hover:bg-green-50"
      >
        <Plus className="h-5 w-5" />
        Adicionar outro Responsável
      </Button>
    </div>
  );
}