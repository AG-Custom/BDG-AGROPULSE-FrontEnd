import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { financeiroGestaoService } from 'services/financeiro-gestao.service';
import type {
  AplicacaoFinanceiraDto,
  AplicacaoFormModel,
  EscopoListagemParams,
} from 'types/dtos/financeiro-gestao.dto';
import type { TipoAplicacaoValor } from 'constants/enums';
import { ref } from 'vue';

export function useAplicacoesFinanceiras() {
  const aplicacoes = ref<AplicacaoFinanceiraDto[]>([]);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(params?: EscopoListagemParams): Promise<void> {
    carregando.value = true;
    try {
      aplicacoes.value = await financeiroGestaoService.listarAplicacoes(params);
    } catch (e) {
      erro(mensagem(e));
      aplicacoes.value = [];
    } finally {
      carregando.value = false;
    }
  }

  async function criar(form: AplicacaoFormModel): Promise<boolean> {
    salvando.value = true;
    try {
      await financeiroGestaoService.criarAplicacao({
        contaBancariaId: form.contaBancariaId,
        tipo: form.tipo as TipoAplicacaoValor,
        descricao: form.descricao.trim(),
        valorAplicado: Number(form.valorAplicado.replace(',', '.')),
        dataAplicacao: form.dataAplicacao,
        dataVencimento: form.dataVencimento || null,
        taxaPercentual: form.taxaPercentual
          ? Number(form.taxaPercentual.replace(',', '.'))
          : null,
      });
      sucesso('Aplicação registrada.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function resgatar(id: string): Promise<boolean> {
    salvando.value = true;
    try {
      await financeiroGestaoService.resgatarAplicacao(id);
      sucesso('Aplicação resgatada.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  return { aplicacoes, carregando, salvando, carregar, criar, resgatar };
}
