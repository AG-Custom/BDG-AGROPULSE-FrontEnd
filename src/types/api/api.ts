export interface ApiResponse<T> {
  data: T;
  success?: boolean;
  message?: string;
}

export interface ApiError {
  title: string;
  detail?: string;
  status: number;
  errors?: Record<string, string[]>;
}

export interface ValidationProblemDetails extends ApiError {
  errors: Record<string, string[]>;
}
