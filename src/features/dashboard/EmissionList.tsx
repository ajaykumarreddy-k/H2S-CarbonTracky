import React from'react';
import { formatDistanceToNow } from'date-fns';
import { Trash2 } from'lucide-react';
import type { Emission } from'../../types';
import { cn, formatEmission } from'../../lib/utils';
import { useEmissionStore } from'../../store/emissionStore';
import { useToast } from'../../components/Toast';

interface EmissionListProps {
  emissions: Emission[];
  isLoading?: boolean;
  filterCategory?: string | null;
}

export function EmissionList({ emissions, isLoading, filterCategory }: EmissionListProps) {
  const { removeEmission } = useEmissionStore();
  const { toast } = useToast();

  const handleRemove = (id: string) => {
    removeEmission(id);
    toast({ type:'info', message:'Emission removed' });
  };

  const filtered = filterCategory 
    ? emissions.filter(e => e.category === filterCategory)
    : emissions;

  if (filtered.length === 0) {
    return (
      <div className="text-center py-12 px-4 border border-dashed border-gray-200  rounded-xl">
        <div className="text-[13px] text-gray-500 mb-3">Nothing logged yet — add your first entry above.</div>
      </div>
    );
  }

  const categoryColors: Record<string, string> = {
    Transport:'bg-[#1a73e8]',
    Food:'bg-[#34a853]',
    Energy:'bg-[#378ADD]',
    Shopping:'bg-[#f9ab00]',
    Flights:'bg-[#ea4335]',
    Other:'bg-[#888780]'
  };

  return (
    <div className="flex flex-col">
      {filtered.map(item => (
        <div key={item.id} className="group flex items-center justify-between py-3 border-b border-gray-100  last:border-0 hover:bg-gray-50 :bg-white/5 px-2 -mx-2 rounded-lg transition-colors">
          <div className="flex items-center gap-3">
            <div className={cn("w-2 h-2 rounded-full flex-shrink-0", categoryColors[item.category] || categoryColors.Other)} />
            <div>
              <div className="text-[13px] text-gray-900  font-medium">{item.title}</div>
              <div className="text-[11px] text-gray-500">{formatDistanceToNow(new Date(item.date), { addSuffix: true })}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-[13px] font-medium text-gray-900  min-w-[50px] text-right">
              {formatEmission(item.kgCO2e)}
            </div>
            
            <button 
              onClick={() => handleRemove(item.id)}
              className="lg:opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-gray-400 hover:text-[#d93025] rounded-md hover:bg-[#fce8e6] :bg-[#3c0a0a]"
              aria-label="Delete entry"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
