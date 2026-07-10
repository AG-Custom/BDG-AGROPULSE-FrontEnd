import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { estoqueService } from 'services/estoque.service';
import type { ListarSaldosParams, SaldoProdutoDto } from 'types/dtos/estoque.dto';
import { ref } from 'vue';

export function useEstoqueSaldos() {
  const saldos = ref<SaldoProdutoDto[]>([]);
  const carregando = ref(false);
  const { erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(params?: ListarSaldosParams): Promise<void> {
    carregando.value = true;

    try {
      saldos.value = await estoqueService.listarSaldos(params);
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  return {
    saldos,
    carregando,
    carregar,
  };
}
