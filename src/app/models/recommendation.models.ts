import { CarSummary } from './car.models';

export interface RecommendationRequest {
  queryText: string;
  budgetMin: number | null;
  budgetMax: number | null;
  bodyType: string;
  fuelType: string;
}

export interface RecommendationItem {
  id: number;
  rank: number;
  car: CarSummary;
  reason: string;
}

export interface RecommendationResponse {
  queryId: number;
  queryText: string;
  budgetMin: number | null;
  budgetMax: number | null;
  bodyType: string | null;
  fuelType: string | null;
  createdAt: string;
  results: RecommendationItem[];
}

export interface RecommendationQuerySummary {
  id: number;
  queryText: string;
  budgetMin: number | null;
  budgetMax: number | null;
  bodyType: string | null;
  fuelType: string | null;
  createdAt: string;
}
