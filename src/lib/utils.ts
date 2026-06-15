import { clsx, type ClassValue } from'clsx';
import { twMerge } from'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatEmission(kgCO2e: number): string {
  if (kgCO2e >= 1000) {
    return`${(kgCO2e / 1000).toFixed(1)}t`;
  }
  return`${kgCO2e.toFixed(1)} kg`;
}
