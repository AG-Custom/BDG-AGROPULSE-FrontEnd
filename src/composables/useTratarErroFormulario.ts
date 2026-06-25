import type { ApiError } from 'types/api/api';

export function useTratarErroFormulario() {
  function mensagem(error: unknown): string {
    const apiError = error as Partial<ApiError>;
    return apiError.detail ?? apiError.title ?? 'Não foi possível concluir a operação.';
  }

  return { mensagem };
}
