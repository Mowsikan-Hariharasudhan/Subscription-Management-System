import * as React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-plum-primary/20 disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none';

    const variants = {
      primary: 'bg-plum-primary text-white border border-[#522D46] shadow-plum-btn hover:shadow-[3px_3px_0px_#3E2134] hover:-translate-x-[0.5px] hover:-translate-y-[0.5px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#3E2134]',
      secondary: 'bg-plum-surface text-plum-primary border border-plum-border hover:bg-[#F2E5EE] shadow-xs',
      outline: 'bg-white text-text-primary border border-border-main shadow-outline-btn hover:border-plum-primary hover:shadow-[3px_3px_0px_#E5DFE4] hover:-translate-x-[0.5px] hover:-translate-y-[0.5px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#E5DFE4]',
      ghost: 'hover:bg-surface-hover hover:text-text-primary text-text-secondary border border-transparent',
      danger: 'bg-rose-600 text-white border border-rose-800 shadow-[2px_2px_0px_#991B1B] hover:shadow-[3px_3px_0px_#991B1B] hover:-translate-x-[0.5px] hover:-translate-y-[0.5px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#991B1B]',
      link: 'text-plum-primary underline-offset-4 hover:underline p-0 h-auto font-medium',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs gap-1.5',
      md: 'h-9 px-4 text-xs sm:text-sm gap-2',
      lg: 'h-10 px-5 text-sm gap-2.5',
      icon: 'h-9 w-9 p-0',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-0.5 mr-2 h-3.5 w-3.5 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
