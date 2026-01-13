// src/components/ui/IconInput.tsx
import { forwardRef, type ComponentProps, type ElementType } from 'react';
import Input from './Input';
import { cn } from '../../lib/utils';

type Props = ComponentProps<typeof Input> & {
    icon: ElementType;
};

const IconInput = forwardRef<HTMLInputElement, Props>(
    ({ icon: Icon, className, ...props }, ref) => {
        return (
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 top-7">
                    <Icon className="h-5 w-5 text-gray-400" />
                </span>
                <Input
                    ref={ref}
                    {...props}
                    className={cn('pl-10', className)}
                />
            </div>
        );
    }
);

IconInput.displayName = 'IconInput';
export default IconInput;