import { extrairApiError, MENSAGEM_ERRO_PADRAO } from 'utils/api-error';

export function useTratarErroFormulario() {
  function mensagem(error: unknown): string {
    return extrairApiError(error)?.message ?? MENSAGEM_ERRO_PADRAO;
  }

  function errosPorCampo(error: unknown): Record<string, string> {
    return extrairApiError(error)?.fields ?? {};
  }

  return { mensagem, errosPorCampo };
}
