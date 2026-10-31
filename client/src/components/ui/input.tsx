import * as React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            'input-focus flex h-11 w-full rounded-xl border-[1.5px] border-black bg-white px-4 py-2.5 text-[0.9375rem] font-medium text-odoo-dark placeholder:text-gray-400 shadow-sm disabled:cursor-not-allowed disabled:opacity-50 transition-all',
            error && 'border-rose-600 focus:border-rose-600 focus:ring-rose-500/20',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs font-semibold text-rose-600">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
