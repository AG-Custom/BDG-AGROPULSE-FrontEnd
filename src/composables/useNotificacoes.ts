import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { notificacaoService } from 'services/notificacao.service';
import type {
  ListarNotificacoesParams,
  NotificacaoDto,
} from 'types/dtos/notificacao.dto';
import { computed, ref } from 'vue';

export function useNotificacoes() {
  const notificacoes = ref<NotificacaoDto[]>([]);
  const carregando = ref(false);
  const marcando = ref(false);
  const { erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  const naoLidas = computed(() =>
    notificacoes.value.filter((item) => !item.lida),
  );

  const quantidadeNaoLidas = computed(() => naoLidas.value.length);

  async function carregar(params?: ListarNotificacoesParams): Promise<void> {
    carregando.value = true;

    try {
      notificacoes.value = await notificacaoService.listar(params);
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function marcarComoLida(id: string): Promise<boolean> {
    marcando.value = true;

    try {
      await notificacaoService.marcarComoLida(id);
      const atual = notificacoes.value.find((item) => item.id === id);

      if (atual) {
        atual.lida = true;
        atual.lidaEm = new Date().toISOString();
      }

      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      marcando.value = false;
    }
  }

  return {
    notificacoes,
    naoLidas,
    quantidadeNaoLidas,
    carregando,
    marcando,
    carregar,
    marcarComoLida,
  };
}
