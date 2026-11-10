import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { Loader2, ShieldCheck, Sparkles, Server } from 'lucide-react';

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

export const AuthSkeleton: React.FC<{
  title?: string;
  badge?: string;
  isRegister?: boolean;
}> = ({
  title = "Sign in",
  badge = "ACCESS PORTAL",
  isRegister = false,
}) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getStatusText = () => {
    if (seconds < 3) return "Authenticating credentials & validating security tokens...";
    if (seconds < 8) return "Connecting to Brightloop Cloud Gateway on Render...";
    if (seconds < 20) return "Waking up cloud database & API instance (Render cold start)...";
    return "Finalizing security session synchronization... Almost ready!";
  };

  return (
    <div className="p-8 sm:p-10 flex flex-col justify-center bg-white h-full anim-fade">
      {/* Top Header Skeleton */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <span className="text-[11px] font-bold tracking-wider text-text-secondary uppercase">
            {badge}
          </span>
          <h2 className="text-2xl font-bold text-text-primary mt-1">{title}</h2>
        </div>
        <div className="w-9 h-9 rounded-xl border border-border-main flex items-center justify-center text-text-secondary bg-surface-main">
          <Loader2 className="w-4 h-4 text-plum-primary animate-spin" />
        </div>
      </div>

      {/* High-visibility Live Status Card */}
      <div className="mb-5 p-4 rounded-xl border-[1.5px] border-black bg-surface-main/80 shadow-[2px_2px_0px_#E5DFE4]">
        <div className="flex items-center space-x-2.5 mb-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-semibold text-text-primary tracking-tight">
            {getStatusText()}
          </span>
        </div>

        {/* Shimmering Animated Progress Bar */}
        <div className="w-full bg-black/10 rounded-full h-2 overflow-hidden border border-black/30">
          <div
            className="bg-gradient-to-r from-plum-primary via-pink-600 to-plum-deep h-full transition-all duration-1000 ease-out"
            style={{ width: `${Math.min(96, 25 + seconds * 4)}%` }}
          />
        </div>

        <div className="flex justify-between items-center mt-2.5 text-[10px] text-text-secondary font-medium">
          <span className="inline-flex items-center gap-1">
            <Server className="w-3 h-3 text-plum-primary" /> Render Cloud Backend
          </span>
          <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-black/20 text-text-primary">
            {seconds}s elapsed
          </span>
        </div>
      </div>

      {/* Structured Field Skeletons */}
      <div className="space-y-4">
        {isRegister ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="skeleton h-3 w-20 mb-1.5" />
                <div className="skeleton h-10 w-full rounded-xl" />
              </div>
              <div>
                <div className="skeleton h-3 w-24 mb-1.5" />
                <div className="skeleton h-10 w-full rounded-xl" />
              </div>
            </div>
            <div>
              <div className="skeleton h-3 w-24 mb-1.5" />
              <div className="skeleton h-10 w-full rounded-xl" />
            </div>
            <div>
              <div className="skeleton h-3 w-20 mb-1.5" />
              <div className="skeleton h-10 w-full rounded-xl" />
            </div>
          </>
        ) : (
          <>
            <div>
              <div className="skeleton h-3 w-24 mb-1.5" />
              <div className="skeleton h-11 w-full rounded-xl" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <div className="skeleton h-3 w-20" />
                <div className="skeleton h-3 w-24" />
              </div>
              <div className="skeleton h-11 w-full rounded-xl" />
            </div>
          </>
        )}

        {/* Shimmering Button Skeleton with Active Pulse */}
        <div className="skeleton h-11 w-full rounded-xl mt-2 flex items-center justify-center gap-2">
          <span className="text-xs font-semibold text-text-secondary flex items-center gap-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-plum-primary" />
            Establishing Authorized Session...
          </span>
        </div>
      </div>

      {/* Footer skeleton */}
      <div className="mt-6 flex justify-center">
        <div className="skeleton h-3.5 w-48" />
      </div>
    </div>
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface-main flex flex-col md:flex-row anim-fade">
      {/* Sidebar Skeleton */}
      <aside className="w-64 border-r-[1.5px] border-black bg-white p-5 hidden md:flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="skeleton w-8 h-8 rounded-xl" />
            <div className="skeleton h-4 w-28" />
          </div>

          <div className="space-y-2.5 pt-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton h-9 w-full rounded-xl" />
            ))}
          </div>
        </div>

        <div className="pt-4 border-t-[1.5px] border-black">
          <div className="skeleton h-10 w-full rounded-xl" />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-8 space-y-6 overflow-hidden">
        {/* Top Navbar Skeleton */}
        <div className="flex items-center justify-between pb-6 border-b-[1.5px] border-black">
          <div className="space-y-2">
            <div className="skeleton h-3 w-32" />
            <div className="skeleton h-6 w-52" />
          </div>
          <div className="flex items-center space-x-3">
            <div className="skeleton w-9 h-9 rounded-xl" />
            <div className="skeleton w-28 h-9 rounded-xl" />
          </div>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>

        {/* Big Chart Skeleton */}
        <div className="brutal-card p-6 h-64 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <div className="skeleton h-4 w-44" />
            <div className="skeleton h-6 w-20 rounded-md" />
          </div>
          <div className="skeleton h-40 w-full rounded-xl" />
        </div>

        {/* Table Skeleton */}
        <LoadingSkeleton count={3} />
      </main>
    </div>
  );
};
