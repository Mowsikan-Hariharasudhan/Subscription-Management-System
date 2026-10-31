import React from 'react';
import { PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center bg-white rounded-lg border border-border-main my-3 shadow-subtle">
      <div className="w-12 h-12 rounded-md bg-surface-subtle border border-border-main flex items-center justify-center text-plum-primary mb-3">
        {icon || <PackageOpen className="w-6 h-6" />}
      </div>
      <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
      {description && (
        <p className="text-xs text-text-secondary max-w-sm mt-1 mb-4">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};
