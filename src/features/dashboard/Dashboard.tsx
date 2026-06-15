import React, { useState, useEffect } from'react';
import { Link } from'react-router-dom';
import { StatCard } from'./StatCard';
import { DonutChart } from'./DonutChart';
import { EmissionList } from'./EmissionList';
import { StreakWidget } from'./StreakWidget';
import { InsightCard } from'../insights/InsightCard';
import { CalculateForm } from'../tracking/CalculateForm';
import { useEmissionStore } from'../../store/emissionStore';
import { useToast } from'../../components/Toast';

function AnimatedCounter({ end, duration = 1800 }: { end: number, duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setCount(end);
      return;
    }

    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeProgress * end));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return <>{count.toLocaleString()}</>;
}

export function Dashboard() {
  const [period, setPeriod] = useState('Month');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const { emissions, addEmission } = useEmissionStore();
  const { toast } = useToast();
  const [globalCarbon, setGlobalCarbon] = useState<{ intensity: number; index: string } | null>(null);

  React.useEffect(() => {
    fetch('/api/carbon/global')
      .then(res => res.json())
      .then(data => setGlobalCarbon(data))
      .catch(err => console.error('Failed to fetch global carbon', err));
  }, []);

  const periods = ['Today','Week','Month','Year'];
  
  // Dummy calculations based on current emissions
  const totalKg = emissions.reduce((acc, curr) => acc + curr.kgCO2e, 0);
  
  const categorySummary = ['Transport','Food','Energy','Shopping','Flights','Other']
    .map(cat => ({
      category: cat,
      kgCO2e: emissions.filter(e => e.category === cat).reduce((acc, curr) => acc + curr.kgCO2e, 0),
    }))
    .filter(c => c.kgCO2e > 0)
    .map((c, _, arr) => ({
      ...c,
      percentage: (c.kgCO2e / arr.reduce((acc, curr) => acc + curr.kgCO2e, 0)) * 100
    }))
    .sort((a, b) => b.kgCO2e - a.kgCO2e);

  const sampleInsight = {
    id:'1',
    title:'Switch one weekly car trip to bus',
    description:'Your Transport category is your biggest source this month.',
    category:'Transport',
    co2SavingKg: 18,
    difficulty:'easy' as const
  };

  const handleCalculated = () => {
    // Optionally trigger a re-fetch of dashboard data from backend here
    // Currently, it will just re-render or we can show a toast
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-h1 mb-1">Dashboard</h1>
          <p className="text-body text-gray-500">Welcome back, here's your impact.</p>
        </div>
        
        <div className="inline-flex gap-1 bg-gray-100  p-1 rounded-full border border-gray-200  w-max">
          {periods.map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`text-[12px] px-4 py-1.5 rounded-full font-medium transition-all ${
                period === p 
                  ?'bg-white  text-gray-900  shadow-sm' 
                  :'text-gray-500 hover:text-gray-900'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <CalculateForm onCalculated={handleCalculated} />

      <h2 className="text-h2 mb-4">Dashboard & History</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-8">
        <StatCard 
          label="This month"
          value={`${totalKg.toFixed(1)} kg`} 
          delta={{ value: 3, direction:'down' }} 
        />
        <StatCard 
          label="Today"
          value="12.4 kg"
          delta={{ value: 8, direction:'down' }} 
        />
        <StatCard 
          label="Global Grid Intensity"
          value={globalCarbon ? `${globalCarbon.intensity} gCO2/kWh` : "Loading..."}
          delta={globalCarbon?.index ? { value: 0, direction: globalCarbon.index === 'low' ? 'down' : 'up' } : undefined}
          className="col-span-2 md:col-span-1"
        />
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
        <div className="space-y-8">
          <div className="bg-white  rounded-2xl border border-gray-200  p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-h3 m-0 border-0 pb-0">Recent emissions</h2>
              {filterCategory && (
                <button 
                  onClick={() => setFilterCategory(null)}
                  className="text-[11px] text-[#1e8e3e]  hover:underline"
                >
                  Clear filter
                </button>
              )}
            </div>
            
            <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
              {categorySummary.length > 0 ? (
                <div className="w-full md:w-[240px] flex-shrink-0 bg-gray-50  p-4 rounded-xl border border-gray-100">
                  <DonutChart 
                    data={categorySummary} 
                    size={160} 
                    innerRadius={45}
                    onSelectCategory={setFilterCategory}
                    selectedCategory={filterCategory}
                  />
                </div>
              ) : null}
              
              <div className="flex-1 w-full">
                <EmissionList 
                  emissions={emissions} 
                  filterCategory={filterCategory}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <StreakWidget streak={5} loggedDates={[]} />
          
          <div>
            <h3 className="text-[14px] font-medium text-gray-900  mb-3">Suggested action</h3>
            <InsightCard 
              insight={sampleInsight} 
              onCommit={() => toast({ type:'success', message:'Action added to your plan!' })} 
            />
          </div>
        </div>
      </div>

      <div className="mt-20 pt-10 border-t border-gray-200">
        <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 mt-10 mb-16 text-center">
          <div className="bg-[#e8f0fe] border border-[#8ab4f8] rounded-2xl md:rounded-3xl py-12 md:py-20 px-6 sm:px-12 mb-8 transform hover:scale-[1.01] transition-transform duration-500">
            <div className="text-[52px] md:text-[72px] font-medium text-[#1967d2] leading-none mb-3 tracking-tight">
              <AnimatedCounter end={6840} />
            </div>
            <div className="text-[14px] text-[#5F5E5A]">
              kg CO₂e · your estimated annual footprint
            </div>
            
            <h1 className="text-[24px] md:text-[32px] font-medium text-gray-900 mt-10 mb-4 mx-auto max-w-lg leading-tight">
              The first step is knowing your number.
            </h1>
            <p className="text-[14px] md:text-[16px] text-gray-600 max-w-[420px] mx-auto mb-10 leading-relaxed">
              Track your carbon footprint in under 90 seconds. Get personalised actions that actually fit your life.
            </p>
            
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-2 bg-[#1a73e8] hover:bg-[#1967d2] text-white px-8 py-4 rounded-full text-[15px] font-medium transition-colors shadow-sm cursor-pointer"
            >
              Calculate mine free <span aria-hidden="true">→</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="bg-[#f8f9fa] rounded-xl p-5 border border-gray-100">
              <div className="text-[12px] text-gray-500 mb-1">Average Indian footprint</div>
              <div className="text-[24px] font-medium text-gray-900">1.9t</div>
              <div className="text-[11px] text-gray-500 mt-1">CO₂e per year</div>
            </div>
            <div className="bg-[#f8f9fa] rounded-xl p-5 border border-gray-100">
              <div className="text-[12px] text-gray-500 mb-1">1.5°C target</div>
              <div className="text-[24px] font-medium text-gray-900">2.3t</div>
              <div className="text-[11px] text-gray-500 mt-1">per person / year</div>
            </div>
            <div className="bg-[#f8f9fa] rounded-xl p-5 border border-gray-100">
              <div className="text-[12px] text-gray-500 mb-1">Avg action saves</div>
              <div className="text-[24px] font-medium text-gray-900">180kg</div>
              <div className="text-[11px] text-[#1e8e3e] font-medium mt-1">↓ per year</div>
            </div>
          </div>
        </section>
        
        {/* How it works */}
        <section id="how-it-works" className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center border-t border-gray-100">
          <h2 className="text-[32px] md:text-[40px] font-medium text-gray-900 mb-6">How it works</h2>
          <p className="text-[16px] text-gray-600 max-w-2xl mx-auto mb-16">
            Understanding your impact shouldn't be complicated. Carbon Tracky simplifies the process into three easy steps.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-left">
              <div className="w-12 h-12 bg-[#e8f0fe] text-[#1967d2] rounded-full flex items-center justify-center font-medium text-xl mb-6">1</div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">Log your habits</h3>
              <p className="text-gray-600 text-[14px] leading-relaxed">Input your daily transport, diet, and energy usage in seconds using our streamlined interface.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-left">
              <div className="w-12 h-12 bg-[#e8f0fe] text-[#1967d2] rounded-full flex items-center justify-center font-medium text-xl mb-6">2</div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">Get AI insights</h3>
              <p className="text-gray-600 text-[14px] leading-relaxed">Our Gemini-powered engine analyzes your footprint to find the most impactful areas for improvement.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-left">
              <div className="w-12 h-12 bg-[#e8f0fe] text-[#1967d2] rounded-full flex items-center justify-center font-medium text-xl mb-6">3</div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">Reduce impact</h3>
              <p className="text-gray-600 text-[14px] leading-relaxed">Commit to personalized actions, track your progress over time, and build a lasting sustainable lifestyle.</p>
            </div>
          </div>
        </section>

        {/* Impact */}
        <section id="impact" className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center border-t border-gray-100 mb-10">
          <h2 className="text-[32px] md:text-[40px] font-medium text-gray-900 mb-6">Real-world impact</h2>
          <p className="text-[16px] text-gray-600 max-w-2xl mx-auto mb-16">
            When millions make small changes, the collective impact is massive. Here's what we're achieving together.
          </p>
          <div className="bg-[#1a73e8] text-white rounded-3xl p-10 md:p-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-left space-y-6">
              <h3 className="text-3xl md:text-4xl font-medium leading-tight">Every kilogram counts.</h3>
              <p className="text-[#e8f0fe] text-[16px] leading-relaxed">
                By aligning your daily choices with global sustainability targets, you're directly contributing to the fight against climate change. Our community has already saved thousands of tonnes of CO₂e.
              </p>
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="inline-block mt-4 bg-white text-[#1a73e8] px-6 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors shadow-sm cursor-pointer">
                Join the movement
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="text-3xl font-medium mb-1">24.5k</div>
                <div className="text-[12px] text-blue-100 uppercase tracking-wider">Active users</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="text-3xl font-medium mb-1">1.2m</div>
                <div className="text-[12px] text-blue-100 uppercase tracking-wider">Actions logged</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center col-span-2">
                <div className="text-4xl font-medium mb-1">8,450t</div>
                <div className="text-[12px] text-blue-100 uppercase tracking-wider">CO₂e Reduced this year</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
