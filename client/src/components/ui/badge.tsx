import * as React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger' | 'info';
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = 'default', ...props }) => {
  const variants = {
    default: 'bg-odoo text-white border-[1.5px] border-black shadow-[2px_2px_0_#000]',
    secondary: 'bg-white text-odoo-dark border-[1.5px] border-black shadow-[2px_2px_0_#000]',
    outline: 'border-[1.5px] border-black bg-white text-gray-800 shadow-[1px_1px_0_#000]',
    success: 'bg-[#d1fae5] text-[#047857] border-[1.5px] border-black shadow-[2px_2px_0_#000]',
    warning: 'bg-[#fef3c7] text-[#b45309] border-[1.5px] border-black shadow-[2px_2px_0_#000]',
    danger: 'bg-[#fee2e2] text-[#b91c1c] border-[1.5px] border-black shadow-[2px_2px_0_#000]',
    info: 'bg-[#e0f2fe] text-[#0369a1] border-[1.5px] border-black shadow-[2px_2px_0_#000]',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-md text-[0.625rem] font-bold uppercase tracking-wider',
        variants[variant],
        className
      )}
      {...props}
    />
  );
};
