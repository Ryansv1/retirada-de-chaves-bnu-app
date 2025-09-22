import { isAxiosError } from 'axios';

export interface ApiErrorResponse {
  statusCode: number;
  identifier: string;
  description: string;
  timestamp: string;
  path: string;
  method: string;
  details?: unknown;
}

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly identifier: string;
  public readonly details?: unknown;

  constructor(response: ApiErrorResponse) {
    super(response.description);
    this.name = 'ApiError';
    this.statusCode = response.statusCode;
    this.identifier = response.identifier;
    this.details = response.details;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export function handleApiError(error: unknown): ApiError {
  if (isAxiosError(error) && error.response) {
    const errorData = error.response.data as ApiErrorResponse;
    if (errorData && errorData.identifier) {
      return new ApiError(errorData);
    }
  }

  // Fallback for unexpected errors or errors that don't match the API error structure
  const fallbackError = new ApiError({
    statusCode: 500,
    identifier: 'UNEXPECTED_ERROR',
    description:
      error instanceof Error ? error.message : 'An unexpected error occurred.',
    timestamp: new Date().toISOString(),
    path: '',
    method: '',
  });

  if (error instanceof Error && process.env.NODE_ENV === 'development') {
    console.error('Fallback error details:', {
      message: error.message,
      stack: error.stack,
      originalError: error,
    });
  }

  return fallbackError;
}
