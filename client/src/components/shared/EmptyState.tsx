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
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-dashed border-border-main my-4">
      <div className="w-14 h-14 rounded-full bg-plum-light/50 flex items-center justify-center text-plum-primary mb-4">
        {icon || <PackageOpen className="w-7 h-7" />}
      </div>
      <h3 className="text-base font-semibold text-text-primary">{title}</h3>
      {description && (
        <p className="text-xs text-text-secondary max-w-sm mt-1 mb-5">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};

