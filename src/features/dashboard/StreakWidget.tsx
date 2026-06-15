import React from'react';
import { cn } from'../../lib/utils';

interface StreakWidgetProps {
  streak: number;
  loggedDates: string[]; // array of ISO string dates'YYYY-MM-DD'
}

export function StreakWidget({ streak, loggedDates }: StreakWidgetProps) {
  const days = ['M','T','W','T','F','S','S'];
  
  // Just dummy logic for UI mock
  const activeDays = [true, true, true, true, true, false, false]; // M-F active
  const todayIndex = 4; // F

  return (
    <div className="bg-white  border border-gray-200  rounded-xl p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[13px] font-medium text-gray-900  flex items-center gap-1.5">
          🔥 {streak}-day streak
        </span>
        <span className="text-[11px] text-gray-500">Keep it going</span>
      </div>
      
      <div className="flex gap-1.5 sm:gap-2 w-full">
        {days.map((day, idx) => {
          const isActive = activeDays[idx];
          const isToday = idx === todayIndex;
          
          return (
            <div 
              key={idx}
              className={cn(
"flex-1 h-8 sm:h-9 rounded-lg flex items-center justify-center text-[11px] font-medium transition-colors",
                isToday ?"bg-[#1967d2] text-white": 
                isActive ?"bg-[#1a73e8] text-[#174ea6]": 
"bg-[#f8f9fa]  text-gray-500  border border-gray-200"
              )}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}
