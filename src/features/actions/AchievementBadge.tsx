import React from'react';
import type { Badge } from'../../types';
import { cn } from'../../lib/utils';

interface AchievementBadgeProps {
  key?: string | number;
  badge: Badge;
  currentSavings: number;
}

export function AchievementBadge({ badge, currentSavings }: AchievementBadgeProps) {
  const isEarned = currentSavings >= badge.requiredKg;
  const progress = Math.min(100, Math.round((currentSavings / badge.requiredKg) * 100));
  
  const tierIcons = {
    bronze:'🥉',
    silver:'🥈',
    gold:'🥇'
  };

  const toGo = Math.max(0, badge.requiredKg - currentSavings);

  return (
    <div className={cn(
"inline-flex flex-col items-center gap-1.5 p-3 sm:px-4 sm:py-3 rounded-xl border text-center transition-all",
      isEarned 
        ?"bg-[#fef7e0]  border-[#fde293]"
        :"bg-gray-50  border-gray-200  opacity-60"
    )}>
      <div className={cn("text-[24px] mb-1 transition-all", !isEarned &&"opacity-80 grayscale mix-blend-luminosity")}>
        {tierIcons[badge.tier]}
      </div>
      <div className={cn("text-[12px] font-medium leading-tight", isEarned ?"text-[#e37400]":"text-gray-500")}>
        {badge.label}
      </div>
      <div className="text-[10px] text-gray-500">
        {isEarned ? (
`${badge.tier.charAt(0).toUpperCase() + badge.tier.slice(1)} — Earned`
        ) : (
`${toGo} kg to go`
        )}
      </div>
      {!isEarned && (
        <div className="w-full h-1 bg-gray-200  rounded-full mt-1 overflow-hidden">
          <div className="h-full bg-gray-400  rounded-full"style={{ width:`${progress}%` }} />
        </div>
      )}
    </div>
  );
}
