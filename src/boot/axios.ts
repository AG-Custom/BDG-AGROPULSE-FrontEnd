import axios, { AxiosError } from 'axios';

import {
  extrairApiError,
  isApiError,
  isEnvelopeComFalha,
  isMensagemGenericaAxios,
  normalizeAxiosError,
  parseApiErrorFromBody,
  unwrapEnvelopeData,
} from 'utils/api-error';
import { obterAccessToken } from 'utils/auth-storage';

import type { ApiError, ApiErrorBody, ApiEnvelope, ValidationProblemDetails } from 'types/api/api';

const baseURL = import.meta.env.VITE_API_URL ?? 'https://localhost:7206/api';

export const api = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = obterAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    if (response.status === 204) {
      return response;
    }

    if (isEnvelopeComFalha(response.data)) {
      return Promise.reject(parseApiErrorFromBody(response.data, response.status));
    }

    const unwrapped = unwrapEnvelopeData(response.data);

    if (unwrapped !== response.data) {
      return { ...response, data: unwrapped };
    }

    return response;
  },
  (error: AxiosError<ValidationProblemDetails | ApiEnvelope<unknown> | ApiErrorBody> | ApiError) => {
    if (isApiError(error) && !isMensagemGenericaAxios(error.message)) {
      return Promise.reject(error);
    }

    const fromBody = extrairApiError(error);

    if (fromBody) {
      return Promise.reject(fromBody);
    }

    return Promise.reject(normalizeAxiosError(error as AxiosError));
  },
);
