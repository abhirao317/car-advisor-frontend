import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RecommendationQuerySummary, RecommendationRequest, RecommendationResponse } from '../models/recommendation.models';

@Injectable({
  providedIn: 'root'
})
export class RecommendationApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/ai/recommendations';

  recommend(request: RecommendationRequest): Observable<RecommendationResponse> {
    return this.http.post<RecommendationResponse>(this.baseUrl, request);
  }

  findByQueryId(queryId: number): Observable<RecommendationResponse> {
    return this.http.get<RecommendationResponse>(`${this.baseUrl}/${queryId}`);
  }

  findRecentQueries(): Observable<RecommendationQuerySummary[]> {
    return this.http.get<RecommendationQuerySummary[]>(this.baseUrl);
  }
}
