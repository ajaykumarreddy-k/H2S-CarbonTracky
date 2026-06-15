import React, { useState } from'react';
import { cn } from'../../lib/utils';
import { useToast } from'../../components/Toast';

interface QuickAddProps {
  onAdd: (kgCO2e: number, category: string, title: string) => void;
}

export function QuickAdd({ onAdd }: QuickAddProps) {
  const [expandedTile, setExpandedTile] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const { toast } = useToast();

  const tiles = [
    { id:'car', icon:'🚗', label:'Car trip', options: ['Petrol car','Electric car','Bus'], unit:'Distance (km)' },
    { id:'meal', icon:'🥩', label:'Meal', options: ['High meat','Vegetarian','Vegan'], unit:'Portions' },
    { id:'energy', icon:'⚡', label:'Electricity', options: ['Home mix','100% Renewable'], unit:'Usage (kWh)' },
    { id:'flight', icon:'✈️', label:'Flight', options: ['Short haul','Long haul'], unit:'Hours' },
    { id:'shopping', icon:'🛍️', label:'Purchase', options: ['Clothes','Electronics','Other'], unit:'Amount ($)' },
    { id:'voice', icon:'🎤', label:'Voice', isVoice: true }
  ];

  const handleTileClick = (tile: any) => {
    if (tile.isVoice) {
      toast({ type:'info', message:'Listening..."I drove 15 km to work"' });
      setTimeout(() => {
        onAdd(2.4,'Transport','Voice: Car commute');
        toast({ type:'success', message:'2.4 kg logged — Car trip' });
      }, 2000);
      return;
    }
    
    if (expandedTile === tile.id) {
      setExpandedTile(null);
    } else {
      setExpandedTile(tile.id);
      setInputValue('');
      setSelectValue(tile.options[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue) return;
    
    // Dummy emission calc
    const num = parseFloat(inputValue);
    const kg = num * 0.170; // fake multiplier
    
    const tile = tiles.find(t => t.id === expandedTile);
    onAdd(kg, tile?.label ||'Other',`${tile?.label} — ${selectValue}`);
    toast({ type:'success', message:`${kg.toFixed(1)} kg logged — ${tile?.label}` });
    
    setExpandedTile(null);
    setInputValue('');
  };

  const activeTile = tiles.find(t => t.id === expandedTile);

  return (
    <div className="mb-8">
      <div className="text-[11px] font-medium tracking-[0.08em] uppercase text-gray-500 mb-3 ml-1">Quick add</div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {tiles.map(tile => (
          <button
            key={tile.id}
            onClick={() => handleTileClick(tile)}
            className={cn(
"flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border transition-colors",
              tile.isVoice 
                ?"bg-[#e8f0fe]  border-[#8ab4f8]"
                : expandedTile === tile.id 
                  ?"bg-gray-50  border-gray-300  shadow-inner"
                  :"bg-white  border-gray-200  hover:bg-gray-50 :bg-white/5"
            )}
          >
            <div className={cn("text-[20px]", tile.isVoice &&"text-[#1967d2]")}>{tile.icon}</div>
            <div className={cn("text-[11px] text-center", tile.isVoice ?"text-[#1967d2]  font-medium":"text-gray-600")}>
              {tile.label}
            </div>
          </button>
        ))}
      </div>

      {activeTile && (
        <form onSubmit={handleSubmit} className="mt-3 p-3 sm:p-4 bg-white  border border-gray-200  rounded-xl flex flex-col sm:flex-row items-end gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex-1 w-full">
            <label className="block text-[12px] text-gray-500 mb-1.5">{activeTile.unit}</label>
            <input 
              type="number"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="e.g. 14"
              className="w-full h-10 px-3 bg-white  border border-gray-300  rounded-lg text-[13px] outline-none focus:border-[#1a73e8] transition-colors"
              autoFocus
            />
          </div>
          <div className="flex-1 w-full">
            <select 
              value={selectValue}
              onChange={e => setSelectValue(e.target.value)}
              className="w-full h-10 px-3 bg-white  border border-gray-300  rounded-lg text-[13px] text-gray-900  outline-none focus:border-[#1a73e8] transition-colors appearance-none"
            >
              {activeTile.options?.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <button 
            type="submit"
            disabled={!inputValue}
            className="w-full sm:w-auto h-10 px-5 bg-[#e8f0fe] hover:bg-[#8ab4f8]  :bg-[#1967d2] text-[#174ea6]  font-medium rounded-full text-[13px] transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            Log {inputValue ? (parseFloat(inputValue) * 0.17).toFixed(1) :'–'} kg
          </button>
        </form>
      )}
    </div>
  );
}
