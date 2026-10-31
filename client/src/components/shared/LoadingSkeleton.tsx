import React from 'react';
import { cn } from '../../lib/utils';

export const LoadingSkeleton: React.FC<{ count?: number; className?: string }> = ({
  count = 3,
  className,
}) => {
  return (
    <div className="w-full space-y-3 p-4 bg-white rounded-xl border border-border-main">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={cn(
            'h-10 bg-surface-main rounded-lg animate-pulse',
            idx === 0 && 'w-3/4',
            idx === 1 && 'w-full',
            idx === 2 && 'w-5/6',
            className
          )}
        />
      ))}
    </div>
  );
};

