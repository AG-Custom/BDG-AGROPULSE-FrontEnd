import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { financeiroGestaoService } from 'services/financeiro-gestao.service';
import type {
  DreOrcamentoDto,
  EscopoListagemParams,
  OrcamentoFinanceiroDto,
  OrcamentoFinanceiroFormModel,
} from 'types/dtos/financeiro-gestao.dto';
import type { VersaoOrcamentoFinanceiroValor } from 'constants/enums';
import { ref } from 'vue';

export function useOrcamentoFinanceiro() {
  const orcamentos = ref<OrcamentoFinanceiroDto[]>([]);
  const dre = ref<DreOrcamentoDto | null>(null);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(params?: EscopoListagemParams): Promise<void> {
    carregando.value = true;
    try {
      orcamentos.value = await financeiroGestaoService.listarOrcamentosFinanceiros(params);
    } catch (e) {
      erro(mensagem(e));
      orcamentos.value = [];
    } finally {
      carregando.value = false;
    }
  }

  async function criar(form: OrcamentoFinanceiroFormModel): Promise<boolean> {
    salvando.value = true;
    try {
      await financeiroGestaoService.criarOrcamentoFinanceiro({
        ano: Number(form.ano),
        versao: form.versao as VersaoOrcamentoFinanceiroValor,
        descricao: form.descricao.trim(),
        unidadeId: form.unidadeId || null,
      });
      sucesso('Orçamento criado.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function carregarDre(id: string): Promise<void> {
    carregando.value = true;
    try {
      dre.value = await financeiroGestaoService.obterDreOrcamento(id);
    } catch (e) {
      erro(mensagem(e));
      dre.value = null;
    } finally {
      carregando.value = false;
    }
  }

  return {
    orcamentos,
    dre,
    carregando,
    salvando,
    carregar,
    criar,
    carregarDre,
  };
}
