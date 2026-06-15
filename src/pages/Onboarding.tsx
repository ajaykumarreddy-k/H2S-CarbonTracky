import React, { useState, useRef, useEffect } from'react';
import { useNavigate } from'react-router-dom';
import { useOnboardingStore } from'../store/onboardingStore';
import { useAuthStore } from'../store/authStore';
import { cn } from'../lib/utils';
import { useToast } from'../components/Toast';

export function Onboarding() {
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  const store = useOnboardingStore();
  const login = useAuthStore(s => s.login);
  const navigate = useNavigate();
  const { toast } = useToast();
  const firstInputRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Focus first input on step change for a11y
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [step]);

  const handleNext = () => {
    if (step < totalSteps) setStep(s => s + 1);
    else handleFinish();
  };

  const handleFinish = () => {
    // Mock finish logic
    toast({ type:'success', message:'Footprint calculated!' });
    login({ id:'dummy', email:'guest@carbontracky.app', name:'Guest' });
    navigate('/dashboard');
  };

  return (
    <div className="max-w-xl mx-auto w-full px-4 pt-12 animate-in fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-1.5 mb-3"role="progressbar"aria-valuenow={step} aria-valuemin={1} aria-valuemax={totalSteps}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div 
              key={i} 
              className={cn(
"h-1.5 flex-1 rounded-full transition-colors duration-300",
                i < step ?"bg-[#1a73e8]":"bg-gray-100"
              )} 
            />
          ))}
        </div>
        <div className="text-[12px] font-medium text-gray-500 uppercase tracking-widest text-center">
          Step {step} of {totalSteps}
        </div>
      </div>

      <div className="bg-white  rounded-2xl border border-gray-200  p-6 md:p-8 shadow-sm">
        {step === 1 && (
          <div role="group"aria-labelledby="step-title">
            <h2 id="step-title"className="text-h1 mb-6 text-center">Where do you live?</h2>
            <select 
              autoFocus
              ref={firstInputRef as any}
              className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-white text-gray-900 mb-6 focus:border-[#1a73e8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8] transition-all"
              value={store.region}
              onChange={e => store.setField('region', e.target.value)}
            >
              <option value=""disabled>Select a region</option>
              <option value="in">India</option>
              <option value="us">United States</option>
              <option value="uk">United Kingdom</option>
              <option value="eu">Europe</option>
              <option value="other">Other</option>
            </select>
          </div>
        )}

        {step === 2 && (
          <div role="group"aria-labelledby="step-title">
            <h2 id="step-title"className="text-h1 mb-2 text-center">Household size</h2>
            <p className="text-[14px] text-gray-500 text-center mb-6">How many people share your home?</p>
            <input 
              type="number"
              min={1}
              max={20}
              autoFocus
              ref={firstInputRef as any}
              className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-white text-gray-900 mb-6 focus:border-[#1a73e8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8] transition-all"
              value={store.householdSize}
              onChange={e => store.setField('householdSize', parseInt(e.target.value) || 1)}
            />
          </div>
        )}

        {step === 3 && (
          <div role="group"aria-labelledby="step-title">
            <h2 id="step-title"className="text-h1 mb-6 text-center">Primary transport</h2>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {['Car','Public Transit','Bike','Walking'].map((mode, i) => (
                <button
                  key={mode}
                  ref={i === 0 ? firstInputRef as any : undefined}
                  onClick={() => store.setField('transportMode', mode)}
                  className={cn(
"p-4 rounded-xl border text-[14px] font-medium transition-all text-center",
                    store.transportMode === mode 
                      ?"bg-[#e8f0fe] border-[#8ab4f8] text-[#174ea6] shadow-sm transform scale-[1.02]"
                      :"bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                  )}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div role="group"aria-labelledby="step-title">
            <h2 id="step-title"className="text-h1 mb-6 text-center">Dietary preference</h2>
            <div className="grid grid-cols-1 gap-3 mb-6">
              {[
                { id:'vegan', label:'Vegan', desc:'Plant-based only' },
                { id:'veg', label:'Vegetarian', desc:'No meat or fish' },
                { id:'omni', label:'Average Omnivore', desc:'Mixed diet, some meat' },
                { id:'meat', label:'Heavy Meat', desc:'Meat with most meals' },
              ].map((opt, i) => (
                <button
                  key={opt.id}
                  ref={i === 0 ? firstInputRef as any : undefined}
                  onClick={() => store.setField('diet', opt.id)}
                  className={cn(
"p-4 rounded-xl border text-left transition-all",
                    store.diet === opt.id 
                      ?"bg-[#e8f0fe] border-[#8ab4f8]"
                      :"bg-white border-gray-200 hover:bg-gray-50"
                  )}
                >
                  <div className={cn("text-[14px] font-medium mb-1", store.diet === opt.id ?"text-[#174ea6]":"text-gray-900")}>{opt.label}</div>
                  <div className={cn("text-[12px]", store.diet === opt.id ?"text-[#1967d2]/80":"text-gray-500")}>{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div role="group"aria-labelledby="step-title">
            <h2 id="step-title"className="text-h1 mb-6 text-center">Flights per year</h2>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {['0','1-2','3-6','6+'].map((f, i) => (
                <button
                  key={f}
                  ref={i === 0 ? firstInputRef as any : undefined}
                  onClick={() => store.setField('flights', f)}
                  className={cn(
"p-4 rounded-xl border text-[14px] font-medium transition-all text-center",
                    store.flights === f 
                      ?"bg-[#e8f0fe] border-[#8ab4f8] text-[#174ea6]"
                      :"bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                  )}
                >
                  {f} flights
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          {step > 1 && (
            <button 
              onClick={() => setStep(s => s - 1)}
              className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          )}
          <button 
            onClick={handleNext}
            className="flex-1 px-6 py-3 rounded-full bg-[#1a73e8] hover:bg-[#1967d2] text-white font-medium transition-colors shadow-sm"
          >
            {step === totalSteps ?'See my footprint' :'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
