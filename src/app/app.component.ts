import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CarFilterOptions, CarSummary } from './models/car.models';
import { RecommendationQuerySummary, RecommendationRequest, RecommendationResponse } from './models/recommendation.models';
import { CarApiService } from './services/car-api.service';
import { RecommendationApiService } from './services/recommendation-api.service';
import { extractApiErrorMessage } from './utils/api-error.util';
import { budgetRangeValidator } from './validators/budget-range.validator';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html'
})
export class AppComponent {
  private readonly recommendationApi = inject(RecommendationApiService);
  private readonly carApi = inject(CarApiService);
  private readonly fb = inject(FormBuilder);

  protected loading = false;
  protected cars: CarSummary[] = [];
  protected recentQueries: RecommendationQuerySummary[] = [];
  protected filterOptions: CarFilterOptions = {
    bodyTypes: ['SUV', 'Hatchback', 'Sedan', 'MPV'],
    fuelTypes: ['Petrol', 'Diesel', 'Hybrid', 'Electric']
  };
  protected recommendation: RecommendationResponse | null = null;
  protected errorMessage = '';

  protected readonly form = this.fb.group({
    queryText: this.fb.nonNullable.control(
      'I want a safe automatic SUV for city and highway use.',
      [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]
    ),
    budgetMin: new FormControl<number | null>(8),
    budgetMax: new FormControl<number | null>(18),
    bodyType: this.fb.nonNullable.control('SUV'),
    fuelType: this.fb.nonNullable.control('Petrol')
  }, { validators: budgetRangeValidator });

  protected readonly lookupForm = this.fb.nonNullable.group({
    queryId: [1, [Validators.required, Validators.min(1)]]
  });

  constructor() {
    this.loadCars();
    this.loadFilterOptions();
    this.loadRecentQueries();
  }

  recommend(): void {
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.recommendationApi.recommend(this.buildRecommendationRequest())
      .subscribe({
        next: (response) => {
          this.recommendation = response;
          this.lookupForm.controls.queryId.setValue(response.queryId);
          this.clearError();
          this.loadRecentQueries();
          this.loading = false;
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = extractApiErrorMessage(
            error,
            'Could not fetch recommendations. Check that the Spring Boot API is running on port 8080.'
          );
          this.loading = false;
        }
      });
  }

  loadSavedRecommendation(queryId = this.lookupForm.controls.queryId.value): void {
    if (!queryId || queryId < 1) {
      return;
    }

    this.lookupForm.controls.queryId.setValue(queryId);
    this.loading = true;
    this.errorMessage = '';
    this.recommendationApi.findByQueryId(queryId)
      .subscribe({
        next: (response) => {
          this.recommendation = response;
          this.patchFormFromRecommendation(response);
          this.clearError();
          this.loading = false;
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = extractApiErrorMessage(
            error,
            'Could not load that saved query. Check the id and confirm the API is running.'
          );
          this.loading = false;
        }
      });
  }

  private loadRecentQueries(): void {
    this.recommendationApi.findRecentQueries()
      .subscribe({
        next: (queries) => {
          this.recentQueries = queries;
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = extractApiErrorMessage(
            error,
            'Could not load recent recommendations. Check that the Spring Boot API is running on port 8080.'
          );
        }
      });
  }

  private loadCars(): void {
    this.carApi.findAll()
      .subscribe({
        next: (cars) => {
          this.cars = cars;
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = extractApiErrorMessage(
            error,
            'Could not load the car catalog. Check that the Spring Boot API is running on port 8080.'
          );
        }
      });
  }

  private loadFilterOptions(): void {
    this.carApi.findFilterOptions()
      .subscribe({
        next: (filterOptions) => {
          this.filterOptions = filterOptions;
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = extractApiErrorMessage(
            error,
            'Could not load filter options. Check that the Spring Boot API is running on port 8080.'
          );
        }
      });
  }

  private buildRecommendationRequest(): RecommendationRequest {
    const formValue = this.form.getRawValue();

    return {
      queryText: formValue.queryText.trim(),
      budgetMin: formValue.budgetMin,
      budgetMax: formValue.budgetMax,
      bodyType: formValue.bodyType.trim(),
      fuelType: formValue.fuelType.trim()
    };
  }

  private patchFormFromRecommendation(response: RecommendationResponse): void {
    this.form.patchValue({
      queryText: response.queryText,
      budgetMin: response.budgetMin,
      budgetMax: response.budgetMax,
      bodyType: response.bodyType || '',
      fuelType: response.fuelType || ''
    });
  }

  private clearError(): void {
    this.errorMessage = '';
  }
}
