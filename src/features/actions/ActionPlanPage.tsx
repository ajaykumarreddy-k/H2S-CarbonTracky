import React from'react';
import { AchievementBadge } from'./AchievementBadge';
import { InsightCard } from'../insights/InsightCard';

export function ActionPlanPage() {
  const activeActions = [
    {
      id:'2',
      title:'Try 2 meat-free days per week',
      description:'Beef & lamb account for 60% of your food emissions.',
      category:'Food',
      co2SavingKg: 124,
      difficulty:'medium' as const
    }
  ];

  const badges = [
    { id:'1', tier:'bronze' as const, label:'First 100 kg', requiredKg: 100 },
    { id:'2', tier:'silver' as const, label:'500 kg saved', requiredKg: 500 },
  ];

  const currentSavings = 216;

  return (
    <div className="max-w-3xl mx-auto w-full px-4 animate-in fade-in">
      <div className="mb-8">
        <h1 className="text-h1 mb-1">Action Plan</h1>
        <p className="text-body text-gray-500">Track the impact of your committed changes.</p>
      </div>

      <div className="bg-white  rounded-2xl border border-gray-200  p-6 sm:p-8 shadow-sm mb-8">
        <h2 className="text-h2 mb-2">Estimated savings</h2>
        <div className="text-[40px] font-medium text-[#1967d2]  leading-none mb-1">
          {currentSavings} <span className="text-[16px] text-[#174ea6]">kg CO₂e / yr</span>
        </div>
        <p className="text-[13px] text-gray-500 mb-6">Based on your committed actions</p>

        <h3 className="text-h3 mb-4">Milestones</h3>
        <div className="flex flex-wrap gap-4">
          {badges.map(b => (
            <AchievementBadge key={b.id} badge={b} currentSavings={currentSavings} />
          ))}
        </div>
      </div>

      <h2 className="text-h3 mb-4 text-gray-900">My Commitments</h2>
      <div className="space-y-4">
        {activeActions.map((action) => (
          <InsightCard 
            key={action.id} 
            insight={action} 
            committed={true}
          />
        ))}
      </div>
    </div>
  );
}
