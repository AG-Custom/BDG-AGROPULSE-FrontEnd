import type { AxiosError } from 'axios';

import type { ApiError, ApiErrorBody, ApiErrorCode, ApiErrorField } from 'types/api/api';

export const MENSAGEM_ERRO_PADRAO = 'Não foi possível concluir a operação. Entre em contato com o suporte.';
export const MENSAGEM_ERRO_CONEXAO = 'Não foi possível conectar à API do AgroPulse. Entre em contato com o suporte.';
const MENSAGEM_ERRO_OPERACAO = 'Erro na operação. Entre em contato com o suporte.';

const AXIOS_MESSAGE_PATTERN = /^Request failed with status code \d+$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function getProp<T>(obj: Record<string, unknown>, ...keys: string[]): T | undefined {
  for (const key of keys) {
    if (key in obj) {
      return obj[key] as T;
    }
  }

  return undefined;
}

export function parseResponseBody(data: unknown): Record<string, unknown> | null {
  if (isRecord(data)) {
    return data;
  }

  if (typeof data === 'string' && data.trim()) {
    try {
      const parsed: unknown = JSON.parse(data);
      return isRecord(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }

  return null;
}

function isEnvelopeFailure(record: Record<string, unknown>): boolean {
  return getProp<boolean>(record, 'success', 'Success') === false;
}

function parseFieldErrors(value: unknown): ApiErrorField[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const fields = value
    .filter(isRecord)
    .map((item) => ({
      field: String(getProp<string>(item, 'field', 'Field') ?? ''),
      message: String(getProp<string>(item, 'message', 'Message') ?? ''),
    }))
    .filter((item) => item.field && item.message);

  return fields.length ? fields : undefined;
}

function parseErrorBody(record: Record<string, unknown>): ApiErrorBody | null {
  const errorRecord = getProp<Record<string, unknown>>(record, 'error', 'Error');

  if (errorRecord && isRecord(errorRecord)) {
    return {
      code: getProp<ApiErrorCode>(errorRecord, 'code', 'Code'),
      message: getProp<string>(errorRecord, 'message', 'Message'),
      fields: parseFieldErrors(getProp(errorRecord, 'fields', 'Fields')),
      title: getProp<string>(errorRecord, 'title', 'Title'),
      detail: getProp<string>(errorRecord, 'detail', 'Detail'),
      errors: getProp<Record<string, string[]>>(errorRecord, 'errors', 'Errors'),
    };
  }

  const hasRootErrorShape =
    'code' in record ||
    'Code' in record ||
    'message' in record ||
    'Message' in record ||
    'fields' in record ||
    'Fields' in record ||
    'title' in record ||
    'Title' in record;

  if (!hasRootErrorShape) {
    return null;
  }

  return {
    code: getProp<ApiErrorCode>(record, 'code', 'Code'),
    message: getProp<string>(record, 'message', 'Message'),
    fields: parseFieldErrors(getProp(record, 'fields', 'Fields')),
    title: getProp<string>(record, 'title', 'Title'),
    detail: getProp<string>(record, 'detail', 'Detail'),
    errors: getProp<Record<string, string[]>>(record, 'errors', 'Errors'),
  };
}

function fieldsParaRecord(fields?: ApiErrorField[]): Record<string, string> | undefined {
  if (!fields?.length) {
    return undefined;
  }

  return Object.fromEntries(fields.map((item) => [item.field, item.message]));
}

function bodyParaApiError(body: ApiErrorBody, status: number): ApiError {
  const fieldsFromArray = fieldsParaRecord(body.fields);
  const fieldsFromRecord = body.errors
    ? Object.fromEntries(
        Object.entries(body.errors).map(([key, messages]) => [key, messages[0] ?? '']),
      )
    : undefined;

  return {
    code: body.code,
    message: body.message ?? body.detail ?? body.title ?? MENSAGEM_ERRO_OPERACAO,
    status,
    fields: fieldsFromArray ?? fieldsFromRecord,
  };
}

export function isMensagemGenericaAxios(message: string): boolean {
  return AXIOS_MESSAGE_PATTERN.test(message.trim());
}

export function isApiError(value: unknown): value is ApiError {
  return (
    isRecord(value) &&
    'message' in value &&
    'status' in value &&
    typeof value.message === 'string' &&
    typeof value.status === 'number'
  );
}

export function parseApiErrorFromBody(data: unknown, status: number): ApiError | null {
  const record = parseResponseBody(data);

  if (!record) {
    return null;
  }

  if (isEnvelopeFailure(record)) {
    const errorBody = parseErrorBody(record);

    if (errorBody?.message || errorBody?.detail || errorBody?.title || errorBody?.fields?.length) {
      return bodyParaApiError(errorBody, status);
    }

    const envelopeMessage = getProp<string>(record, 'message', 'Message');

    if (envelopeMessage?.trim()) {
      return { message: envelopeMessage, status };
    }

    return { message: MENSAGEM_ERRO_OPERACAO, status };
  }

  const errorBody = parseErrorBody(record);

  if (errorBody?.message || errorBody?.detail || errorBody?.title || errorBody?.fields?.length) {
    return bodyParaApiError(errorBody, status);
  }

  return null;
}

export function normalizeAxiosError(error: AxiosError): ApiError {
  if (!error.response) {
    return {
      message: MENSAGEM_ERRO_CONEXAO,
      status: 0,
    };
  }

  const parsed = parseApiErrorFromBody(error.response.data, error.response.status);

  if (parsed) {
    return parsed;
  }

  return {
    message: MENSAGEM_ERRO_PADRAO,
    status: error.response.status,
  };
}

export function extrairApiError(error: unknown): ApiError | null {
  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as AxiosError).response;

    if (response) {
      const fromBody = parseApiErrorFromBody(response.data, response.status);

      if (fromBody) {
        return fromBody;
      }
    }
  }

  if (isApiError(error) && !isMensagemGenericaAxios(error.message)) {
    return error;
  }

  return null;
}

export function unwrapEnvelopeData(data: unknown): unknown {
  const record = parseResponseBody(data);

  if (!record) {
    return data;
  }

  if (isEnvelopeFailure(record)) {
    return null;
  }

  if ('data' in record || 'Data' in record) {
    return getProp(record, 'data', 'Data');
  }

  return data;
}

export function isEnvelopeComFalha(data: unknown): boolean {
  const record = parseResponseBody(data);
  return record !== null && isEnvelopeFailure(record);
}
