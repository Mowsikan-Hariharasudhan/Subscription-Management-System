import React from 'react';
import { formatCurrency } from '../../lib/utils';
import { cn } from '../../lib/utils';

interface CurrencyDisplayProps {
  amount: number | undefined | null; // in paise
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({
  amount,
  className,
  size = 'md',
}) => {
  const sizeStyles = {
    sm: 'text-xs',
    md: 'text-sm font-semibold',
    lg: 'text-lg font-bold',
    xl: 'text-2xl font-extrabold tracking-tight',
  };

  return (
    <span className={cn('tabular-nums font-sans font-semibold tracking-tight', sizeStyles[size], className)}>
      {formatCurrency(amount)}
    </span>
  );
};
