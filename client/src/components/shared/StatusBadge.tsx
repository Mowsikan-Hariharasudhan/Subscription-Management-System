import React from 'react';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';

interface StatusBadgeProps {
  status: string;
  type?: 'subscription' | 'invoice' | 'quotation' | 'general';
  size?: 'sm' | 'md' | 'lg' | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size }) => {
  const normalized = (status || '').toUpperCase();

  const getVariant = () => {
    switch (normalized) {
      case 'ACTIVE':
      case 'PAID':
      case 'ACCEPTED':
        return 'success';

      case 'CONFIRMED':
      case 'SENT':
        return 'secondary';

      case 'DRAFT':
      case 'QUOTATION':
        return 'outline';

      case 'PAUSED':
      case 'EXPIRED':
        return 'warning';

      case 'CLOSED':
      case 'CANCELLED':
      case 'DECLINED':
        return 'danger';

      default:
        return 'outline';
    }
  };

  const getDotColor = () => {
    switch (normalized) {
      case 'ACTIVE':
      case 'PAID':
      case 'ACCEPTED':
        return 'bg-emerald-500';
      case 'CONFIRMED':
      case 'SENT':
        return 'bg-plum-primary';
      case 'PAUSED':
      case 'EXPIRED':
        return 'bg-amber-500';
      case 'CLOSED':
      case 'CANCELLED':
      case 'DECLINED':
        return 'bg-rose-500';
      default:
        return 'bg-gray-400';
    }
  };

  const isLarge = size === 'lg';

  return (
    <Badge
      variant={getVariant()}
      className={cn(
        'inline-flex items-center gap-1.5 font-medium tracking-wide uppercase font-mono text-[10px]',
        isLarge && 'text-xs px-2.5 py-1'
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', getDotColor())} />
      <span>{normalized}</span>
    </Badge>
  );
};
