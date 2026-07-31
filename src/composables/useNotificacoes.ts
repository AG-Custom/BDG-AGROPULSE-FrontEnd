import { storeToRefs } from 'pinia';

import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { useAuthStore } from 'stores/auth.store';
import { useNotificacaoStore } from 'stores/notificacao.store';
import type { ListarNotificacoesParams } from 'types/dtos/notificacao.dto';
import { extrairApiError, isApiError } from 'utils/api-error';

function isErroSessaoIrrelevante(error: unknown): boolean {
  if (!useAuthStore().autenticado) {
    return true;
  }

  const apiError = isApiError(error) ? error : extrairApiError(error);
  return apiError?.status === 401;
}

export function useNotificacoes() {
  const store = useNotificacaoStore();
  const {
    notificacoesVisiveis,
    naoLidas,
    quantidadeNaoLidas,
    carregando,
    marcando,
  } = storeToRefs(store);
  const { erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(params?: ListarNotificacoesParams): Promise<void> {
    try {
      await store.carregar(params);
    } catch (e) {
      if (isErroSessaoIrrelevante(e)) {
        return;
      }

      erro(mensagem(e));
    }
  }

  async function marcarComoLida(id: string): Promise<boolean> {
    try {
      return await store.marcarComoLida(id);
    } catch (e) {
      if (isErroSessaoIrrelevante(e)) {
        return false;
      }

      erro(mensagem(e));
      return false;
    }
  }

  return {
    notificacoes: notificacoesVisiveis,
    naoLidas,
    quantidadeNaoLidas,
    carregando,
    marcando,
    carregar,
    marcarComoLida,
  };
}
