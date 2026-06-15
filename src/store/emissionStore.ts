import { create } from'zustand';
import type { Emission } from'../types';

interface EmissionState {
  emissions: Emission[];
  addEmission: (emission: Emission) => void;
  removeEmission: (id: string) => void;
}

const DUMMY_DATA: Emission[] = [
  { id:'1', title:'Car commute — 14 km', category:'Transport', kgCO2e: 2.4, date: new Date().toISOString() },
  { id:'2', title:'Lunch — chicken curry', category:'Food', kgCO2e: 3.8, date: new Date(Date.now() - 3600000 * 4).toISOString() },
  { id:'3', title:'Home electricity — 8 kWh', category:'Energy', kgCO2e: 6.2, date: new Date(Date.now() - 86400000).toISOString() },
];

export const useEmissionStore = create<EmissionState>((set) => ({
  emissions: DUMMY_DATA,
  addEmission: (e) => set((state) => ({ emissions: [e, ...state.emissions] })),
  removeEmission: (id) => set((state) => ({ emissions: state.emissions.filter(e => e.id !== id) })),
}));
