import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { safrasService } from 'services/safras.service';
import type {
  HistoricoAplicacaoItemDto,
  HistoricoProdutividadeDto,
  ListarHistoricoAplicacoesParams,
  ListarHistoricoProdutividadeParams,
} from 'types/dtos/safras.dto';
import { ref } from 'vue';

export function useHistoricoSafras() {
  const historicoAplicacoes = ref<HistoricoAplicacaoItemDto[]>([]);
  const historicoProdutividade = ref<HistoricoProdutividadeDto[]>([]);
  const carregando = ref(false);
  const { erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregarHistoricoAplicacoes(
    params?: ListarHistoricoAplicacoesParams,
  ): Promise<void> {
    carregando.value = true;
    try {
      historicoAplicacoes.value = await safrasService.listarHistoricoAplicacoes(params);
    } catch (e) {
      erro(mensagem(e));
      historicoAplicacoes.value = [];
    } finally {
      carregando.value = false;
    }
  }

  async function carregarHistoricoProdutividade(
    params?: ListarHistoricoProdutividadeParams,
  ): Promise<void> {
    carregando.value = true;
    try {
      historicoProdutividade.value =
        await safrasService.listarHistoricoProdutividade(params);
    } catch (e) {
      erro(mensagem(e));
      historicoProdutividade.value = [];
    } finally {
      carregando.value = false;
    }
  }

  return {
    historicoAplicacoes,
    historicoProdutividade,
    carregando,
    carregarHistoricoAplicacoes,
    carregarHistoricoProdutividade,
  };
}
