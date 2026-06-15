import React from'react';
import type { Insight } from'../../types';
import { cn } from'../../lib/utils';
import { Check } from'lucide-react';

interface InsightCardProps {
  key?: string | number;
  insight: Insight;
  onCommit?: (id: string) => void;
  committed?: boolean;
}

export function InsightCard({ insight, onCommit, committed }: InsightCardProps) {
  const diffMap = {
    easy:'text-[#1967d2] bg-[#e8f0fe] border-[#8ab4f8]',
    medium:'text-[#f9ab00] bg-[#fef7e0] border-[#fde293]',
    hard:'text-[#d93025] bg-[#fce8e6] border-[#f28b82]'
  };

  const icons = {
    Transport:'🚌',
    Food:'🌱',
    Energy:'💡',
    Shopping:'📦',
    Flights:'🛫',
    Other:'✨'
  };

  return (
    <div className="bg-white  border border-gray-200  rounded-xl p-4 flex gap-3 items-start">
      <div className="w-9 h-9 rounded-lg bg-[#e6f4ea]  flex items-center justify-center flex-shrink-0 text-[16px]">
        {icons[insight.category as keyof typeof icons] ||'✨'}
      </div>
      
      <div className="flex-1">
        <div className="text-[13px] font-medium text-gray-900  mb-1">{insight.title}</div>
        <div className="text-[12px] text-gray-500 mb-3">{insight.description}</div>
        
        <div className="flex items-center gap-2 mb-3">
          <div className="text-[11px] font-medium text-[#1e8e3e]">Saves ~{insight.co2SavingKg} kg/yr</div>
          <span className={cn("text-[10px] px-2 py-0.5 rounded-full border", diffMap[insight.difficulty])}>
            {insight.difficulty.charAt(0).toUpperCase() + insight.difficulty.slice(1)}
          </span>
        </div>

        {committed ? (
          <button disabled className="flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 bg-[#e8f0fe]  text-[#174ea6]  font-medium rounded-lg transition-colors border border-[#8ab4f8]">
            <Check size={12} strokeWidth={3} /> Committed
          </button>
        ) : (
          <button 
            onClick={() => onCommit?.(insight.id)}
            className="text-[11px] px-2.5 py-1.5 border border-gray-200  bg-white  hover:bg-gray-50 :bg-white/5 rounded-lg transition-colors font-medium text-gray-700"
          >
            Commit to this
          </button>
        )}
      </div>
    </div>
  );
}
