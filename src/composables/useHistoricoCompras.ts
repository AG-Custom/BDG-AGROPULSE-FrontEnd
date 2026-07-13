import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { comprasService } from 'services/compras.service';
import type {
  EvolucaoPrecoCompraDto,
  HistoricoCompraDto,
  ListarEvolucaoPrecoComprasParams,
  ListarHistoricoComprasParams,
} from 'types/dtos/compras.dto';
import { ref } from 'vue';

export function useHistoricoCompras() {
  const historico = ref<HistoricoCompraDto[]>([]);
  const evolucao = ref<EvolucaoPrecoCompraDto[]>([]);
  const carregando = ref(false);
  const carregandoEvolucao = ref(false);
  const { erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(params?: ListarHistoricoComprasParams): Promise<void> {
    carregando.value = true;

    try {
      historico.value = await comprasService.listarHistorico(params);
    } catch (e) {
      erro(mensagem(e));
      historico.value = [];
    } finally {
      carregando.value = false;
    }
  }

  async function carregarEvolucao(
    params: ListarEvolucaoPrecoComprasParams,
  ): Promise<void> {
    carregandoEvolucao.value = true;

    try {
      evolucao.value = await comprasService.listarEvolucaoPreco(params);
    } catch (e) {
      erro(mensagem(e));
      evolucao.value = [];
    } finally {
      carregandoEvolucao.value = false;
    }
  }

  return {
    historico,
    evolucao,
    carregando,
    carregandoEvolucao,
    carregar,
    carregarEvolucao,
  };
}
