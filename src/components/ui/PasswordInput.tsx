
import { useState, type ComponentProps, forwardRef } from 'react';
import Input from './Input';
import { Eye, EyeOff } from 'lucide-react';

type PasswordInputProps = ComponentProps<typeof Input>;

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>((props, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative">
            <Input
                ref={ref}
                {...props}
                type={showPassword ? 'text' : 'password'}
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 top-6 flex items-center pr-3.5 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
            >
                {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                ) : (
                    <Eye className="h-5 w-5" />
                )}
            </button>
        </div>
    );
});

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;