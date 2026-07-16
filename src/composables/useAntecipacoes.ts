import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { financeiroGestaoService } from 'services/financeiro-gestao.service';
import type {
  AntecipacaoCarteiraDto,
  AntecipacaoDto,
  EscopoListagemParams,
  SimularAntecipacaoResultDto,
} from 'types/dtos/financeiro-gestao.dto';
import { ref } from 'vue';

export function useAntecipacoes() {
  const antecipacoes = ref<AntecipacaoDto[]>([]);
  const carteira = ref<AntecipacaoCarteiraDto | null>(null);
  const simulacao = ref<SimularAntecipacaoResultDto | null>(null);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(params?: EscopoListagemParams): Promise<void> {
    carregando.value = true;
    try {
      antecipacoes.value = await financeiroGestaoService.listarAntecipacoes(params);
    } catch (e) {
      erro(mensagem(e));
      antecipacoes.value = [];
    } finally {
      carregando.value = false;
    }
  }

  async function carregarCarteira(): Promise<void> {
    carregando.value = true;
    try {
      carteira.value = await financeiroGestaoService.obterCarteiraAntecipacao();
    } catch (e) {
      erro(mensagem(e));
      carteira.value = null;
    } finally {
      carregando.value = false;
    }
  }

  async function simular(
    contasReceberIds: string[],
    desagioPercentual: number,
  ): Promise<boolean> {
    salvando.value = true;
    try {
      simulacao.value = await financeiroGestaoService.simularAntecipacao({
        contasReceberIds,
        desagioPercentual,
      });
      sucesso('Simulação concluída.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function ceder(id: string): Promise<boolean> {
    salvando.value = true;
    try {
      await financeiroGestaoService.cederAntecipacao(id);
      sucesso('Antecipação cedida.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  return {
    antecipacoes,
    carteira,
    simulacao,
    carregando,
    salvando,
    carregar,
    carregarCarteira,
    simular,
    ceder,
  };
}
