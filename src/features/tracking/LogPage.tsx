import React, { useState } from'react';
import { useForm } from'react-hook-form';
import { z } from'zod';
import { zodResolver } from'@hookform/resolvers/zod';
import { useToast } from'../../components/Toast';
import { EMISSION_FACTORS } from'../../lib/emissionFactors';
import { QuickAdd } from'./QuickAdd';
import { useAuthStore } from'../../store/authStore';
import { useEmissionStore } from'../../store/emissionStore';

const schema = z.object({
  category: z.enum(['Transport','Food','Energy','Shopping','Flights','Other']),
  date: z.string(),
  notes: z.string().max(200).optional(),
  
  // Transport
  distance_km: z.number().min(0.1).max(10000).optional(),
  transport_mode: z.enum(['petrolCar','dieselCar','electricCar','bus','train','walking','cycling']).optional(),
  
  // Food
  food_type: z.enum(['vegan','vegetarian','omnivore','highMeat']).optional(),
  weight_kg: z.number().min(0.05).max(5).optional(), // rough proxy
  
  // Energy
  kwh: z.number().min(0.1).max(10000).optional(),
  
  // Shopping
  amount_inr: z.number().min(1).optional()
}).superRefine((data, ctx) => {
  if (data.category ==='Transport' && (!data.distance_km || !data.transport_mode)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message:"Distance and mode required", path: ['distance_km'] });
  }
  if (data.category ==='Energy' && !data.kwh) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message:"kWh required", path: ['kwh'] });
  }
  if (data.category ==='Food' && !data.food_type) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message:"Dietary type required", path: ['food_type'] });
  }
});

type FormData = z.infer<typeof schema>;

export function LogPage() {
  const { addEmission } = useEmissionStore();
  const { toast } = useToast();

  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      category:'Transport',
      date: new Date().toISOString().split('T')[0]
    }
  });

  const category = watch('category');
  const watchAll = watch();

  let estimatedKg = 0;
  if (category ==='Transport' && watchAll.distance_km && watchAll.transport_mode) {
    estimatedKg = watchAll.distance_km * (EMISSION_FACTORS.transport[watchAll.transport_mode] || 0);
  } else if (category ==='Energy' && watchAll.kwh) {
    estimatedKg = watchAll.kwh * EMISSION_FACTORS.energy.electricity;
  } else if (category ==='Food' && watchAll.food_type) {
    estimatedKg = EMISSION_FACTORS.food[watchAll.food_type] * (watchAll.weight_kg || 1);
  } else if (category ==='Shopping' && watchAll.amount_inr) {
    estimatedKg = watchAll.amount_inr * 0.05; // dummy conversion
  }

  const user = useAuthStore(s => s.user);

  const onSubmit = async (data: FormData) => {
    let title = `${data.category} entry`;
    if (data.category === 'Transport') title = `Commute — ${data.distance_km} km`;
    if (data.category === 'Food') title = `Meal — ${data.food_type}`;
    if (data.category === 'Energy') title = `Electricity — ${data.kwh} kWh`;

    const device_id = user?.id || 'anonymous_12345';

    // Map to backend CarbonInput
    const payload: any = {
      device_id,
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
      consumption_level: 'medium'
    };

    if (data.category === 'Transport' && data.distance_km) {
      if (data.transport_mode === 'electricCar') payload.transport_km_car_electric = data.distance_km;
      else if (data.transport_mode === 'dieselCar') payload.transport_km_car_diesel = data.distance_km;
      else if (data.transport_mode === 'bus') payload.transport_km_bus = data.distance_km;
      else if (data.transport_mode === 'train') payload.transport_km_train = data.distance_km;
      else payload.transport_km_car_petrol = data.distance_km;
    } else if (data.category === 'Energy' && data.kwh) {
      payload.home_electricity_kwh = data.kwh;
    } else if (data.category === 'Food' && data.food_type) {
      if (data.food_type === 'vegan') payload.diet_type = 'vegan';
      else if (data.food_type === 'vegetarian') payload.diet_type = 'vegetarian';
      else if (data.food_type === 'highMeat') payload.diet_type = 'meat_heavy';
      else payload.diet_type = 'meat_medium';
    }

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
          carbon_result: carbonResult,
          insights: insightsResult.insights
        })
      });
      if (!saveRes.ok) throw new Error('Failed to save entry');

      // Local state update just for immediate visual feedback if needed
      addEmission({
        id: Math.random().toString(),
        category: data.category as any,
        kgCO2e: carbonResult.total_kg || 1,
        date: new Date(data.date).toISOString(),
        title,
        notes: data.notes
      });

      toast({ type: 'success', message: `${carbonResult.total_kg.toFixed(1)} kg logged successfully` });
      reset({ category: 'Transport', date: new Date().toISOString().split('T')[0] });
    } catch (err: any) {
      toast({ type: 'error', message: err.message });
    }
  };

  const handleQuickAdd = (kgCO2e: number, cat: string, title: string) => {
    addEmission({
      id: Math.random().toString(),
      category: cat as any,
      kgCO2e,
      date: new Date().toISOString(),
      title
    });
  };

  return (
    <div className="max-w-2xl mx-auto w-full px-4 animate-in fade-in">
      <h1 className="text-h1 mb-6">Log emission</h1>
      
      <QuickAdd onAdd={handleQuickAdd} />

      <div className="bg-white  rounded-2xl border border-gray-200  p-6 sm:p-8 shadow-sm">
        <h2 className="text-h3 border-b border-gray-100  pb-4 mb-6">Manual entry</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] text-gray-500 mb-1.5 focus-within:text-[#1a73e8]">Category</label>
              <select 
                {...register('category')}
                className="w-full h-10 px-3 bg-white  border border-gray-300  rounded-lg text-[13px] text-gray-900  outline-none focus:border-[#1a73e8]"
              >
                {['Transport','Food','Energy','Shopping','Flights','Other'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[12px] text-gray-500 mb-1.5 focus-within:text-[#1a73e8]">Date</label>
              <input 
                type="date"
                {...register('date')}
                className="w-full h-10 px-3 bg-white  border border-gray-300  rounded-lg text-[13px] text-gray-900  outline-none focus:border-[#1a73e8]"
              />
            </div>
          </div>

          <div className="p-4 bg-gray-50  rounded-xl border border-gray-100  space-y-4">
            {category ==='Transport' && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] text-gray-500 mb-1.5 focus-within:text-[#1a73e8]">Distance (km)</label>
                  <input 
                    type="number"
                    step="0.1"
                    {...register('distance_km', { valueAsNumber: true })}
                    className="w-full h-10 px-3 bg-white  border border-gray-300  rounded-lg text-[13px] outline-none focus:border-[#1a73e8]"
                  />
                  {errors.distance_km && <p className="text-[#d93025] text-[11px] mt-1">{errors.distance_km.message}</p>}
                </div>
                <div>
                  <label className="block text-[12px] text-gray-500 mb-1.5 focus-within:text-[#1a73e8]">Mode</label>
                  <select 
                    {...register('transport_mode')}
                    className="w-full h-10 px-3 bg-white  border border-gray-300  rounded-lg text-[13px] text-gray-900  outline-none focus:border-[#1a73e8]"
                  >
                    <option value="">Select mode</option>
                    <option value="petrolCar">Petrol Car</option>
                    <option value="dieselCar">Diesel Car</option>
                    <option value="electricCar">Electric Car</option>
                    <option value="bus">Bus</option>
                    <option value="train">Train</option>
                    <option value="cycling">Cycling</option>
                    <option value="walking">Walking</option>
                  </select>
                </div>
              </div>
            )}
            
            {category ==='Energy' && (
              <div>
                <label className="block text-[12px] text-gray-500 mb-1.5 focus-within:text-[#1a73e8]">Usage (kWh)</label>
                <input 
                  type="number"
                  step="0.1"
                  {...register('kwh', { valueAsNumber: true })}
                  className="w-full h-10 px-3 bg-white  border border-gray-300  rounded-lg text-[13px] outline-none focus:border-[#1a73e8]"
                />
                 {errors.kwh && <p className="text-[#d93025] text-[11px] mt-1">{errors.kwh.message}</p>}
              </div>
            )}

            {category ==='Food' && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] text-gray-500 mb-1.5 focus-within:text-[#1a73e8]">Dietary type</label>
                  <select 
                    {...register('food_type')}
                    className="w-full h-10 px-3 bg-white  border border-gray-300  rounded-lg text-[13px] text-gray-900  outline-none focus:border-[#1a73e8]"
                  >
                    <option value="">Select type</option>
                    <option value="vegan">Vegan</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="omnivore">Omnivore</option>
                    <option value="highMeat">High Meat</option>
                  </select>
                </div>
              </div>
            )}
            
            {['Shopping','Flights','Other'].includes(category) && (
              <div className="text-[13px] text-gray-500 py-2">
                Detailed entry for {category} is simplified in this demo.
              </div>
            )}
          </div>

          <div>
            <label className="block text-[12px] text-gray-500 mb-1.5 focus-within:text-[#1a73e8]">Notes (optional)</label>
            <textarea 
              {...register('notes')}
              className="w-full h-20 p-3 bg-white  border border-gray-300  rounded-lg text-[13px] outline-none focus:border-[#1a73e8] resize-none"
              placeholder="Add any context..."
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex gap-2 items-baseline">
              <span className="text-[13px] text-gray-500">Estimated emission:</span>
              <span className="text-[22px] font-medium text-[#1967d2]">
                {estimatedKg > 0 ?`${estimatedKg.toFixed(1)} kg` :'—'}
              </span>
            </div>
            
            <button 
              type="submit"
              className="h-10 px-6 bg-[#1a73e8] hover:bg-[#1967d2] text-white font-medium rounded-full text-[13px] transition-colors shadow-sm"
            >
              Save entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
