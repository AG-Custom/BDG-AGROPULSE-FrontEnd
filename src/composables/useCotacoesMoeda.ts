import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { financeiroGestaoService } from 'services/financeiro-gestao.service';
import { messageService } from 'services/message.service';
import type {
  CotacaoMoedaDto,
  CotacaoMoedaFormModel,
  ExposicaoCambialDto,
  SincronizarPtaxPayload,
} from 'types/dtos/financeiro-gestao.dto';
import { ref } from 'vue';

export function useCotacoesMoeda() {
  const cotacoes = ref<CotacaoMoedaDto[]>([]);
  const exposicao = ref<ExposicaoCambialDto | null>(null);
  const carregando = ref(false);
  const salvando = ref(false);
  const sincronizando = ref(false);
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
      await carregarExposicao();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function atualizar(id: string, form: CotacaoMoedaFormModel): Promise<boolean> {
    salvando.value = true;
    try {
      await financeiroGestaoService.atualizarCotacaoMoeda(id, {
        taxaCompra: Number(form.taxaCompra.replace(',', '.')),
        taxaVenda: Number(form.taxaVenda.replace(',', '.')),
      });
      sucesso('Cotação atualizada.');
      await carregar();
      await carregarExposicao();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function solicitarInativacao(item: CotacaoMoedaDto): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Inativar cotação',
      mensagem: `Deseja inativar a cotação ${item.moeda} de ${item.data}?`,
      textoConfirmar: 'Inativar',
      icone: 'warning',
    });
    if (!confirmou) return false;

    salvando.value = true;
    try {
      await financeiroGestaoService.inativarCotacaoMoeda(item.id);
      sucesso('Cotação inativada.');
      await carregar();
      await carregarExposicao();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function sincronizarPtax(payload: SincronizarPtaxPayload = {}): Promise<boolean> {
    sincronizando.value = true;
    try {
      const cotacao = await financeiroGestaoService.sincronizarPtax({
        moeda: payload.moeda?.trim().toUpperCase() || 'USD',
        data: payload.data,
      });
      sucesso(`PTAX ${cotacao.moeda} atualizada (${cotacao.data}).`);
      await carregar();
      await carregarExposicao();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      sincronizando.value = false;
    }
  }

  return {
    cotacoes,
    exposicao,
    carregando,
    salvando,
    sincronizando,
    carregar,
    carregarExposicao,
    criar,
    atualizar,
    solicitarInativacao,
    sincronizarPtax,
  };
}
