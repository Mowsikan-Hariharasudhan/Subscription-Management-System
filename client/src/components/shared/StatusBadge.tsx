import React from 'react';
import { Badge } from '../ui/badge';

interface StatusBadgeProps {
  status: string;
  type?: 'subscription' | 'invoice' | 'quotation' | 'general';
  size?: 'sm' | 'md' | 'lg' | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size }) => {
  const normalized = (status || '').toUpperCase();

  switch (normalized) {
    case 'ACTIVE':
    case 'PAID':
    case 'ACCEPTED':
      return <Badge variant="success">{normalized}</Badge>;

    case 'CONFIRMED':
    case 'SENT':
      return <Badge variant="info">{normalized}</Badge>;

    case 'DRAFT':
    case 'QUOTATION':
      return <Badge variant="secondary">{normalized}</Badge>;

    case 'PAUSED':
    case 'EXPIRED':
      return <Badge variant="warning">{normalized}</Badge>;

    case 'CLOSED':
    case 'CANCELLED':
    case 'DECLINED':
      return <Badge variant="danger">{normalized}</Badge>;

    default:
      return <Badge variant="outline">{normalized}</Badge>;
  }
};

