import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

import type { AuthContextSessionDto } from 'types/dtos/auth.dto';
import {
  extrairApiError,
  isApiError,
  isEnvelopeComFalha,
  isMensagemGenericaAxios,
  normalizeAxiosError,
  parseApiErrorFromBody,
  unwrapEnvelopeData,
} from 'utils/api-error';
import { limparSessao } from 'utils/auth-storage';

import type { ApiError, ApiEnvelope, ApiErrorBody, ValidationProblemDetails } from 'types/api/api';

const baseURL = import.meta.env.VITE_API_URL ?? '/api';

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

const rotasSemRefresh = ['/auth/login', '/auth/register', '/auth/confirm-email', '/auth/refresh', '/auth/logout'];

type RequestComRetry = InternalAxiosRequestConfig & { _retry?: boolean };

let refreshEmAndamento: Promise<boolean> | null = null;

async function tentarRefresh(): Promise<boolean> {
  try {
    const response = await api.post<AuthContextSessionDto>('/auth/refresh');
    const { useAuthStore } = await import('stores/auth.store');
    useAuthStore().aplicarContextoRefresh(response.data);
    return true;
  } catch {
    limparSessao();
    return false;
  }
}

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
  async (error: AxiosError<ValidationProblemDetails | ApiEnvelope<unknown> | ApiErrorBody>) => {
    const config = error.config as RequestComRetry | undefined;
    const status = error.response?.status;
    const url = config?.url ?? '';

    if (
      status === 401 &&
      config &&
      !config._retry &&
      !rotasSemRefresh.some((rota) => url.includes(rota))
    ) {
      config._retry = true;

      if (!refreshEmAndamento) {
        refreshEmAndamento = tentarRefresh().finally(() => {
          refreshEmAndamento = null;
        });
      }

      const renovou = await refreshEmAndamento;

      if (renovou) {
        return api(config);
      }
    }

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
