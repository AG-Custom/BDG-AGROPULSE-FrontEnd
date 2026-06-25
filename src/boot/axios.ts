import axios, { AxiosError } from 'axios';

import type { ApiError, ApiResponse, ValidationProblemDetails } from 'types/api/api';

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:5293';

export const api = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
  },
});

api.interceptors.response.use(
  (response) => {
    const data = response.data as ApiResponse<unknown> | unknown;

    if (data && typeof data === 'object' && 'data' in data) {
      return { ...response, data: (data as ApiResponse<unknown>).data };
    }

    return response;
  },
  (error: AxiosError<ValidationProblemDetails | ApiError>) => {
    return Promise.reject(normalizeApiError(error));
  },
);

function normalizeApiError(error: AxiosError<ValidationProblemDetails | ApiError>): ApiError {
  if (!error.response) {
    return {
      title: 'Erro de conexão',
      detail: 'Não foi possível conectar à API do AgroPulse.',
      status: 0,
    };
  }

  const data = error.response.data;

  return {
    title: data?.title ?? 'Erro inesperado',
    detail: data?.detail ?? error.message,
    status: error.response.status,
    errors: 'errors' in (data ?? {}) ? (data as ValidationProblemDetails).errors : undefined,
  };
}
