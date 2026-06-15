// Constants for calculating emissions
// Source: Simplified averages based on IPCC / DEFRA data

export const EMISSION_FACTORS = {
  transport: {
    // kg CO2e per km
    petrolCar: 0.170,
    dieselCar: 0.171,
    electricCar: 0.047, // Lifecycle average, UK grid
    bus: 0.105,
    train: 0.035,
    walking: 0,
    cycling: 0,
  },
  food: {
    // kg CO2e per meal (avg)
    vegan: 0.7,
    vegetarian: 1.2,
    omnivore: 2.5,
    highMeat: 3.3, // e.g. beef/lamb focus
  },
  energy: {
    // kg CO2e per kWh
    electricity: 0.233, // Example grid mix
    gas: 0.202, // per kWh equivalent
  },
  flights: {
    // kg CO2e per flight hour (roughly)
    shortHaul: 156,
    longHaul: 200,
  }
};
