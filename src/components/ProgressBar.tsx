import React, { useEffect, useState } from'react';
import { cn } from'../lib/utils';

interface ProgressBarProps {
  value: number;
  color?:'green' |'teal' |'coral' |'amber';
  size?:'sm' |'md';
  label: string;
  className?: string;
  animated?: boolean;
}

export function ProgressBar({ value, color ='green', size ='sm', label, className, animated = true }: ProgressBarProps) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // Small delay to ensure the transition happens on mount
    const timer = setTimeout(() => setWidth(value), 50);
    return () => clearTimeout(timer);
  }, [value]);

  const bgColorMap = {
    green:'bg-[#1a73e8]',
    teal:'bg-[#34a853]',
    coral:'bg-[#ea4335]',
    amber:'bg-[#f9ab00]'
  };

  const trackColorMap = {
    green:'bg-[#e8f0fe]',
    teal:'bg-[#e6f4ea]',
    coral:'bg-[#fce8e6]',
    amber:'bg-[#fef7e0]'
  };

  const heightClass = size ==='sm' ?'h-1' :'h-2';

  return (
    <div 
      className={cn("w-full overflow-hidden rounded-full bg-opacity-20", trackColorMap[color], heightClass, className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div 
        className={cn("h-full rounded-full transition-all duration-1000 ease-out", bgColorMap[color], !animated &&'transition-none')}
        style={{ width:`${animated ? width : value}%` }}
      />
    </div>
  );
}
