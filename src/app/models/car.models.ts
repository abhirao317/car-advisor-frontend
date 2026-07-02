export interface CarSummary {
  id: number;
  make: string;
  model: string;
  variant: string;
  priceInLakhs: number;
  bodyType: string;
  fuelType: string;
  transmission: string;
  mileage: number;
  seatingCapacity: number;
  safetyRating: number;
  segment: string;
  imageUrl: string;
}

export interface CarFilterOptions {
  bodyTypes: string[];
  fuelTypes: string[];
}
