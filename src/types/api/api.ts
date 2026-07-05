export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'BUSINESS_ERROR'
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'INTERNAL_ERROR';

export interface ApiErrorField {
  field: string;
  message: string;
}

export interface ApiErrorBody {
  code?: ApiErrorCode;
  message?: string;
  fields?: ApiErrorField[];
  title?: string;
  detail?: string;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  data: T;
  success?: boolean;
  message?: string;
}

export interface ApiEnvelope<T> {
  success: boolean;
  data: T | null;
  error: ApiErrorBody | null;
  message?: string;
}

export interface ApiError {
  code?: ApiErrorCode;
  message: string;
  status: number;
  fields?: Record<string, string>;
}

export interface ValidationProblemDetails extends ApiErrorBody {
  title: string;
  errors?: Record<string, string[]>;
}
