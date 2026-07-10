import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { estoqueService } from 'services/estoque.service';
import type { ListarLotesParams, LoteDto } from 'types/dtos/estoque.dto';
import { ref } from 'vue';

export function useEstoqueLotes() {
  const lotes = ref<LoteDto[]>([]);
  const carregando = ref(false);
  const { erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(params?: ListarLotesParams): Promise<void> {
    carregando.value = true;

    try {
      lotes.value = await estoqueService.listarLotes(params);
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  return {
    lotes,
    carregando,
    carregar,
  };
}
