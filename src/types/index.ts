export interface User {
  id: string;
  name?: string;
  email: string;
  joinDate?: string;
  token?: string;
}

export interface Emission {
  id: string;
  category:'Transport' |'Food' |'Energy' |'Shopping' |'Flights' |'Other';
  kgCO2e: number;
  date: string;
  title: string;
  notes?: string;
}

export interface CategorySummary {
  category: string;
  kgCO2e: number;
  percentage: number;
  color?: string;
}

export interface Insight {
  id: string;
  title: string;
  co2SavingKg: number;
  difficulty:'easy' |'medium' |'hard';
  category: string;
  description: string;
}

export interface Badge {
  id: string;
  tier:'bronze' |'silver' |'gold';
  label: string;
  requiredKg: number;
  earnedAt?: string;
}
