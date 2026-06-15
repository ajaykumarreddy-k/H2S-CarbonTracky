import React, { useState, useEffect } from'react';
import { InsightCard } from'./InsightCard';
import { useToast } from'../../components/Toast';
import { useAuthStore } from'../../store/authStore';

export function InsightsPage() {
  const { toast } = useToast();

  const handleCommit = (id: string) => {
    toast({ type:'success', message:'Action added to your plan' });
  };

  const user = useAuthStore(s => s.user);
  const [insights, setInsights] = useState<any[]>([
    {
      id:'1',
      title:'Switch one weekly car trip to bus',
      description:'Your Transport category is your biggest source this month. Small changes compound.',
      category:'Transport',
      co2SavingKg: 18,
      difficulty:'easy'
    }
  ]);

  useEffect(() => {
    const device_id = user?.id || 'anonymous_12345';
    fetch(`/api/entries/${device_id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        if (data && data.length > 0 && data[0].insights && data[0].insights.length > 0) {
          const mappedInsights = data[0].insights.map((ins: any, i: number) => ({
            id: `api_${i}`,
            title: ins.title,
            description: ins.description,
            category: 'Other',
            co2SavingKg: ins.estimated_saving_kg || 0,
            difficulty: 'medium'
          }));
          setInsights(mappedInsights);
        }
      })
      .catch(err => console.error(err));
  }, [user]);

  return (
    <div className="max-w-3xl mx-auto w-full px-4 animate-in fade-in">
      <div className="mb-8">
        <h1 className="text-h1 mb-1">AI Insights</h1>
        <p className="text-body text-gray-500">Personalised recommendations based on your logs.</p>
      </div>

      <div className="space-y-4">
        {insights.map((insight, i) => (
          <InsightCard 
            key={insight.id} 
            insight={insight} 
            onCommit={handleCommit}
            committed={i === 1} // just mock state for visualization
          />
        ))}
      </div>
    </div>
  );
}
