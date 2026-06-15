import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '../../components/Toast';
import { useAuthStore } from '../../store/authStore';

const schema = z.object({
  transport_km_car_petrol: z.number().min(0).default(0),
  transport_km_car_diesel: z.number().min(0).default(0),
  transport_km_car_electric: z.number().min(0).default(0),
  transport_km_bus: z.number().min(0).default(0),
  transport_km_train: z.number().min(0).default(0),
  flights_short_haul: z.number().min(0).default(0),
  flights_long_haul: z.number().min(0).default(0),
  home_electricity_kwh: z.number().min(0).default(0),
  home_gas_kwh: z.number().min(0).default(0),
  household_size: z.number().min(1).default(1),
  diet_type: z.enum(['meat_heavy', 'meat_medium', 'vegetarian', 'vegan']).default('meat_medium'),
  consumption_level: z.enum(['low', 'medium', 'high']).default('medium'),
});

type FormData = z.infer<typeof schema>;

interface CalculateFormProps {
  onCalculated: () => void;
}

export function CalculateForm({ onCalculated }: CalculateFormProps) {
  const { toast } = useToast();
  const user = useAuthStore(s => s.user);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      transport_km_car_petrol: 0,
      transport_km_car_diesel: 0,
      transport_km_car_electric: 0,
      transport_km_bus: 0,
      transport_km_train: 0,
      flights_short_haul: 0,
      flights_long_haul: 0,
      home_electricity_kwh: 0,
      home_gas_kwh: 0,
      household_size: 1,
      diet_type: 'meat_medium',
      consumption_level: 'medium',
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    const device_id = user?.id || 'anonymous_12345';

    const payload = {
      device_id,
      ...data
    };

    try {
      // 1. Calculate
      const calcRes = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!calcRes.ok) throw new Error('Calculation failed');
      const carbonResult = await calcRes.json();

      // 2. Generate Insights
      const insRes = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ device_id, carbon_result: carbonResult })
      });
      if (!insRes.ok) throw new Error('Insights failed');
      const insightsResult = await insRes.json();

      // 3. Save Entry
      const saveRes = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          device_id, // include device_id in save just in case backend expects it, though path is usually what matters
          carbon_result: carbonResult,
          insights: insightsResult.insights
        })
      });
      if (!saveRes.ok) throw new Error('Failed to save entry');

      toast({ type: 'success', message: `${carbonResult.total_kg.toFixed(1)} kg CO₂e logged successfully!` });
      onCalculated(); // Trigger dashboard refresh
    } catch (err: any) {
      toast({ type: 'error', message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-10 mb-10">
      <div className="mb-8 border-b border-gray-100 pb-6">
        <h2 className="text-[28px] font-medium text-gray-900 mb-2">What's Your Carbon Footprint?</h2>
        <p className="text-[15px] text-gray-600 max-w-2xl">
          Enter your lifestyle data below to calculate your annual CO₂e emissions, compare to global benchmarks, and receive AI-powered personalised actions.
        </p>
        <div className="flex gap-4 mt-4">
          <span className="text-[13px] text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">📊 Science-backed factors</span>
          <span className="text-[13px] text-[#1967d2] bg-[#e8f0fe] px-3 py-1 rounded-full border border-[#8ab4f8]">✨ Gemini AI insights</span>
          <span className="text-[13px] text-[#1e8e3e] bg-green-50 px-3 py-1 rounded-full border border-green-200">🔒 Anonymous & private</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        {/* TRANSPORT */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🚗</span>
            <h3 className="text-xl font-medium text-gray-900">Transport</h3>
          </div>
          <p className="text-[14px] text-gray-500 mb-6">Enter your annual travel distances and number of flights.</p>
          
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-1">
              <label className="text-[13px] font-medium text-gray-700">Petrol Car (km/year)</label>
              <input type="number" {...register('transport_km_car_petrol', { valueAsNumber: true })} className="w-full h-10 px-3 border border-gray-300 rounded-lg text-[14px] outline-none focus:border-[#1a73e8]" />
              <p className="text-[11px] text-gray-400">Annual kilometres driven in a petrol or hybrid car</p>
            </div>
            <div className="space-y-1">
              <label className="text-[13px] font-medium text-gray-700">Diesel Car (km/year)</label>
              <input type="number" {...register('transport_km_car_diesel', { valueAsNumber: true })} className="w-full h-10 px-3 border border-gray-300 rounded-lg text-[14px] outline-none focus:border-[#1a73e8]" />
              <p className="text-[11px] text-gray-400">Annual kilometres driven in a diesel car</p>
            </div>
            <div className="space-y-1">
              <label className="text-[13px] font-medium text-gray-700">Electric Vehicle (km/year)</label>
              <input type="number" {...register('transport_km_car_electric', { valueAsNumber: true })} className="w-full h-10 px-3 border border-gray-300 rounded-lg text-[14px] outline-none focus:border-[#1a73e8]" />
              <p className="text-[11px] text-gray-400">Annual kilometres driven in a battery electric car</p>
            </div>
            <div className="space-y-1">
              <label className="text-[13px] font-medium text-gray-700">Bus (km/year)</label>
              <input type="number" {...register('transport_km_bus', { valueAsNumber: true })} className="w-full h-10 px-3 border border-gray-300 rounded-lg text-[14px] outline-none focus:border-[#1a73e8]" />
              <p className="text-[11px] text-gray-400">Annual kilometres travelled by bus or coach</p>
            </div>
            <div className="space-y-1">
              <label className="text-[13px] font-medium text-gray-700">Train / Metro (km/year)</label>
              <input type="number" {...register('transport_km_train', { valueAsNumber: true })} className="w-full h-10 px-3 border border-gray-300 rounded-lg text-[14px] outline-none focus:border-[#1a73e8]" />
              <p className="text-[11px] text-gray-400">Annual kilometres by train, metro, or tram</p>
            </div>
            <div className="space-y-1">
              <label className="text-[13px] font-medium text-gray-700">Short-Haul Flights (flights/year)</label>
              <input type="number" {...register('flights_short_haul', { valueAsNumber: true })} className="w-full h-10 px-3 border border-gray-300 rounded-lg text-[14px] outline-none focus:border-[#1a73e8]" />
              <p className="text-[11px] text-gray-400">Flights under 3 hours (e.g. London to Paris)</p>
            </div>
            <div className="space-y-1">
              <label className="text-[13px] font-medium text-gray-700">Long-Haul Flights (flights/year)</label>
              <input type="number" {...register('flights_long_haul', { valueAsNumber: true })} className="w-full h-10 px-3 border border-gray-300 rounded-lg text-[14px] outline-none focus:border-[#1a73e8]" />
              <p className="text-[11px] text-gray-400">Flights over 3 hours (e.g. London to New York)</p>
            </div>
          </div>
        </section>

        <hr className="border-gray-100" />

        {/* HOME ENERGY */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🏠</span>
            <h3 className="text-xl font-medium text-gray-900">Home Energy</h3>
          </div>
          <p className="text-[14px] text-gray-500 mb-6">Your household's annual energy consumption. Costs are split equally across household members.</p>
          
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-1">
              <label className="text-[13px] font-medium text-gray-700">Electricity (kWh/year)</label>
              <input type="number" {...register('home_electricity_kwh', { valueAsNumber: true })} className="w-full h-10 px-3 border border-gray-300 rounded-lg text-[14px] outline-none focus:border-[#1a73e8]" />
              <p className="text-[11px] text-gray-400">Check your energy bills — UK average is ~3,700 kWh/year</p>
            </div>
            <div className="space-y-1">
              <label className="text-[13px] font-medium text-gray-700">Natural Gas (kWh/year)</label>
              <input type="number" {...register('home_gas_kwh', { valueAsNumber: true })} className="w-full h-10 px-3 border border-gray-300 rounded-lg text-[14px] outline-none focus:border-[#1a73e8]" />
              <p className="text-[11px] text-gray-400">UK average is ~12,000 kWh/year for heating and cooking</p>
            </div>
            <div className="space-y-1">
              <label className="text-[13px] font-medium text-gray-700">Household Size (people)</label>
              <input type="number" {...register('household_size', { valueAsNumber: true })} className="w-full h-10 px-3 border border-gray-300 rounded-lg text-[14px] outline-none focus:border-[#1a73e8]" />
              <p className="text-[11px] text-gray-400">Number of people sharing your home (emissions split equally)</p>
            </div>
          </div>
        </section>

        <hr className="border-gray-100" />

        {/* DIET & LIFESTYLE */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🥗</span>
            <h3 className="text-xl font-medium text-gray-900">Diet & Lifestyle</h3>
          </div>
          <p className="text-[14px] text-gray-500 mb-6">Your dietary pattern and consumption habits account for a significant share of emissions.</p>
          
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-gray-700">Diet Type</label>
              <select {...register('diet_type')} className="w-full h-10 px-3 bg-white border border-gray-300 rounded-lg text-[14px] outline-none focus:border-[#1a73e8]">
                <option value="meat_heavy">🥩 Meat-heavy (&gt;100g/day)</option>
                <option value="meat_medium">🍗 Meat-moderate (a few times a week)</option>
                <option value="vegetarian">🥚 Vegetarian (dairy & eggs ok)</option>
                <option value="vegan">🌱 Vegan (fully plant-based)</option>
              </select>
              <p className="text-[11px] text-gray-400">Select the option that best describes your typical diet</p>
            </div>
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-gray-700">Shopping & Consumption Level</label>
              <select {...register('consumption_level')} className="w-full h-10 px-3 bg-white border border-gray-300 rounded-lg text-[14px] outline-none focus:border-[#1a73e8]">
                <option value="low">📉 Low — minimal new purchases</option>
                <option value="medium">⚖️ Medium — average consumer spending</option>
                <option value="high">🛍️ High — frequent new purchases</option>
              </select>
              <p className="text-[11px] text-gray-400">How much do you typically spend on new goods (clothes, electronics)?</p>
            </div>
          </div>
        </section>

        <div className="pt-8 border-t border-gray-100 flex justify-center">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-[#1a73e8] text-white px-10 py-4 rounded-full text-[16px] font-medium hover:bg-[#1967d2] transition-colors shadow-md disabled:opacity-50"
          >
            {isSubmitting ? 'Calculating...' : '🌍 Calculate Footprint'}
          </button>
        </div>
      </form>
    </div>
  );
}
