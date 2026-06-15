import React from'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from'recharts';
import type { CategorySummary } from'../../types';

interface DonutChartProps {
  data: CategorySummary[];
  size?: number;
  innerRadius?: number;
  onSelectCategory?: (cat: string | null) => void;
  selectedCategory?: string | null;
}

const COLORS: Record<string, string> = {
  Transport:'#1a73e8',
  Food:'#34a853',
  Energy:'#378ADD',
  Shopping:'#f9ab00',
  Flights:'#ea4335',
  Other:'#888780'
};

export function DonutChart({ data, size = 200, innerRadius = 55, onSelectCategory, selectedCategory }: DonutChartProps) {
  const total = data.reduce((acc, curr) => acc + curr.kgCO2e, 0);

  const handleClick = (entry: any) => {
    if (onSelectCategory) {
      onSelectCategory(selectedCategory === entry.category ? null : entry.category);
    }
  };

  return (
    <div className="relative flex flex-col items-center gap-4 justify-center">
      <div style={{ width: size, height: size }} className="relative flex-shrink-0">
        <ResponsiveContainer width="100%"height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={size / 2 - 10}
              paddingAngle={2}
              dataKey="kgCO2e"
              onClick={handleClick}
              className="cursor-pointer outline-none"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[entry.category] || COLORS.Other}
                  opacity={selectedCategory ? (selectedCategory === entry.category ? 1 : 0.3) : 1}
                  className="transition-opacity duration-300 outline-none"
                  strokeWidth={0}
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [`${value.toFixed(1)} kg`,'CO2e']}
              contentStyle={{ borderRadius:'8px', border:'none', boxShadow:'0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-[20px] font-medium text-gray-900">{total.toFixed(0)}</div>
          <div className="text-[10px] text-gray-500">kg CO₂e</div>
        </div>
      </div>

      <div className="flex-1 w-full sm:min-w-[140px] flex flex-col gap-2">
        {data.map(row => (
          <button 
            key={row.category}
            onClick={() => onSelectCategory?.(selectedCategory === row.category ? null : row.category)}
            className="flex items-center gap-2 p-1.5 -mx-1.5 rounded-md hover:bg-black/5 transition-colors text-left"
          >
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"style={{ backgroundColor: COLORS[row.category] || COLORS.Other }} />
            <span className="text-[12px] flex-1 text-gray-500">{row.category}</span>
            <span className="text-[12px] font-medium text-gray-900">{row.percentage.toFixed(0)}%</span>
          </button>
        ))}
      </div>

      <table className="sr-only"aria-label="Emission breakdown by category">
        <thead><tr><th>Category</th><th>kg CO₂e</th><th>%</th></tr></thead>
        <tbody>
          {data.map(row => (
            <tr key={row.category}>
              <td>{row.category}</td>
              <td>{row.kgCO2e}</td>
              <td>{row.percentage}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
