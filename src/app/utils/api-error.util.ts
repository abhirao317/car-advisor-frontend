import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorResponse } from '../models/api-error.models';

export function extractApiErrorMessage(error: HttpErrorResponse, fallback: string): string {
  if (typeof error.error === 'string' && error.error.trim()) {
    return error.error.trim();
  }

  if (isApiErrorResponse(error.error) && error.error.messages.length) {
    return error.error.messages.join(' ');
  }

  if (hasMessage(error.error)) {
    return error.error.message.trim();
  }

  return fallback;
}

function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  return !!value
    && typeof value === 'object'
    && Array.isArray((value as ApiErrorResponse).messages);
}

function hasMessage(value: unknown): value is { message: string } {
  return !!value
    && typeof value === 'object'
    && typeof (value as { message?: unknown }).message === 'string'
    && !!(value as { message: string }).message.trim();
}
