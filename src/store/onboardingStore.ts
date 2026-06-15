import { create } from'zustand';

interface OnboardingState {
  region: string;
  householdSize: number;
  transportMode: string;
  diet: string;
  flights: string;
  setField: (field: keyof Omit<OnboardingState,'setField'>, value: string | number) => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  region:'',
  householdSize: 1,
  transportMode:'',
  diet:'',
  flights:'',
  setField: (field, value) => set({ [field]: value }),
}));
