import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { financeiroGestaoService } from 'services/financeiro-gestao.service';
import type {
  CotacaoMoedaDto,
  CotacaoMoedaFormModel,
  ExposicaoCambialDto,
} from 'types/dtos/financeiro-gestao.dto';
import { ref } from 'vue';

export function useCotacoesMoeda() {
  const cotacoes = ref<CotacaoMoedaDto[]>([]);
  const exposicao = ref<ExposicaoCambialDto | null>(null);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(): Promise<void> {
    carregando.value = true;
    try {
      cotacoes.value = await financeiroGestaoService.listarCotacoesMoeda();
    } catch (e) {
      erro(mensagem(e));
      cotacoes.value = [];
    } finally {
      carregando.value = false;
    }
  }

  async function carregarExposicao(): Promise<void> {
    carregando.value = true;
    try {
      exposicao.value = await financeiroGestaoService.obterExposicaoCambial();
    } catch (e) {
      erro(mensagem(e));
      exposicao.value = null;
    } finally {
      carregando.value = false;
    }
  }

  async function criar(form: CotacaoMoedaFormModel): Promise<boolean> {
    salvando.value = true;
    try {
      await financeiroGestaoService.criarCotacaoMoeda({
        moeda: form.moeda.trim().toUpperCase(),
        data: form.data,
        taxaCompra: Number(form.taxaCompra.replace(',', '.')),
        taxaVenda: Number(form.taxaVenda.replace(',', '.')),
      });
      sucesso('Cotação registrada.');
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
    cotacoes,
    exposicao,
    carregando,
    salvando,
    carregar,
    carregarExposicao,
    criar,
  };
}
