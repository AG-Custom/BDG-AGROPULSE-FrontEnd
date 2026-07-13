import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { aprovacaoService } from 'services/aprovacao.service';
import type { PedidoFilaAprovacaoDto } from 'types/dtos/aprovacao.dto';
import { ref } from 'vue';

export function useAprovacoes() {
  const fila = ref<PedidoFilaAprovacaoDto[]>([]);
  const carregando = ref(false);
  const { erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(): Promise<void> {
    carregando.value = true;

    try {
      fila.value = await aprovacaoService.listar();
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  return {
    fila,
    carregando,
    carregar,
  };
}
