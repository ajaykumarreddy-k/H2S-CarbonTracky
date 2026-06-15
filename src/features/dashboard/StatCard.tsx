import React from'react';
import { cn } from'../../lib/utils';
import { ProgressBar } from'../../components/ProgressBar';

interface StatCardProps {
  label: string;
  value: string | number;
  delta?: { value: number; direction:'up' |'down' };
  progress?: number;
  variant?:'default' |'goal' |'streak';
  className?: string;
}

export function StatCard({ label, value, delta, progress, variant ='default', className }: StatCardProps) {
  return (
    <div className={cn("bg-[#f8f9fa]  rounded-lg p-3.5 sm:p-4", className)}>
      <div className="flex items-center gap-2 mb-1">
        <div className="text-[12px] text-gray-500">{label}</div>
        {variant ==='streak' && <span className="text-[14px]">🔥</span>}
      </div>
      <div className="text-[22px] sm:text-data font-medium text-gray-900  mb-1 lg:mb-2">{value}</div>
      
      {delta && (
        <div className={cn(
"text-[11px] font-medium mt-auto flex items-center gap-1",
          delta.direction ==='down' ?"text-[#1e8e3e]":"text-[#d93025]"
        )}>
          <span>{delta.direction ==='down' ?'↓' :'↑'}</span>
          <span>{delta.value}% vs avg</span>
        </div>
      )}

      {variant ==='goal' && progress !== undefined && (
        <div className="mt-2">
          <ProgressBar 
            value={progress} 
            label={`${label} progress`} 
            color={progress > 100 ?'coral' :'green'} 
            size="sm"
          />
        </div>
      )}
    </div>
  );
}
