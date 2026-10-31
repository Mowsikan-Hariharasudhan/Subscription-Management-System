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
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-plum-primary disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none';

    const variants = {
      primary: 'bg-plum-primary text-white border border-[#53364F] hover:bg-plum-deep shadow-xs active:translate-y-[0.5px]',
      secondary: 'bg-plum-light text-plum-primary border border-plum-muted/20 hover:bg-[#ebdce7] hover:border-plum-muted/40',
      outline: 'border border-border-main bg-white hover:bg-surface-main hover:border-text-secondary text-text-primary shadow-xs active:bg-surface-subtle',
      ghost: 'hover:bg-surface-main hover:text-text-primary text-text-secondary',
      danger: 'bg-rose-600 text-white border border-rose-700 hover:bg-rose-700 shadow-xs active:translate-y-[0.5px]',
      link: 'text-plum-primary underline-offset-4 hover:underline p-0 h-auto font-medium',
    };

    const sizes = {
      sm: 'h-8 px-2.5 text-xs gap-1.5',
      md: 'h-9 px-3.5 text-xs sm:text-sm gap-2',
      lg: 'h-10 px-5 text-sm gap-2.5',
      icon: 'h-8 w-8 p-0',
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
