import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CarFilterOptions, CarSummary } from '../models/car.models';

@Injectable({
  providedIn: 'root'
})
export class CarApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://car-advisor-backend.onrender.com/api/cars';

  findAll(): Observable<CarSummary[]> {
    return this.http.get<CarSummary[]>(this.baseUrl);
  }

  findFilterOptions(): Observable<CarFilterOptions> {
    return this.http.get<CarFilterOptions>(`${this.baseUrl}/filter-options`);
  }
}

