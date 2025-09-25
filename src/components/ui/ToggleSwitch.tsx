// src/components/ui/ToggleSwitch.tsx

import { Switch } from '@headlessui/react';


interface ToggleSwitchProps {
  id?: string
  checked: boolean;
  onChange: (checked: boolean) => void;
  enabledText?: string;
  disabledText?: string;
}

export default function ToggleSwitch({
  id,
  checked,
  onChange,
  enabledText = 'Ativo',
  disabledText = 'Inativo'
}: ToggleSwitchProps) {
  return (
    <div className="flex items-center gap-4">
      <Switch
        id={id}
        checked={checked}
        onChange={onChange}
        className={`${checked ? 'bg-ifpr-green' : 'bg-gray-300'
          } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-ifpr-green focus:ring-offset-2`}
      >
        <span
          aria-hidden="true"
          className={`${checked ? 'translate-x-5' : 'translate-x-0'
            } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
      </Switch>
      <span className={`font-semibold ${checked ? 'text-gray-800' : 'text-gray-500'}`}>
        {checked ? enabledText : disabledText}
      </span>
    </div>
  );
}