import React from 'react';
import { cn } from '../../lib/utils';

export const LoadingSkeleton: React.FC<{ count?: number; className?: string }> = ({
  count = 4,
  className,
}) => {
  return (
    <div className="glass-panel rounded-2xl overflow-hidden w-full">
      {/* Header bar skeleton */}
      <div className="border-b-[1.5px] border-black bg-white/40 px-6 py-4 flex items-center gap-8">
        <div className="skeleton h-4 w-28" />
        <div className="skeleton h-4 w-36" />
        <div className="skeleton h-4 w-24 hidden sm:block" />
        <div className="skeleton h-4 w-24 ml-auto" />
      </div>

      {/* Row skeletons */}
      <div className="p-6 space-y-5">
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className={cn('flex items-center gap-6', className)}>
            <div className="skeleton w-10 h-10 rounded-full shrink-0" />
            <div className="skeleton h-4 w-40" />
            <div className="skeleton h-4 w-32 hidden sm:block" />
            <div className="skeleton h-4 w-28 hidden md:block" />
            <div className="skeleton h-6 w-20 ml-auto shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('glass-panel rounded-2xl p-6 h-[9.5rem] flex flex-col justify-between', className)}>
    <div className="skeleton h-3 w-24" />
    <div className="skeleton h-8 w-32" />
    <div className="skeleton h-4 w-40" />
  </div>
);
