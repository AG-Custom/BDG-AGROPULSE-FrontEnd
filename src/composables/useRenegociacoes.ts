import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { messageService } from 'services/message.service';
import { financeiroGestaoService } from 'services/financeiro-gestao.service';
import type {
  EscopoListagemParams,
  RenegociacaoDto,
  RenegociacaoFormModel,
} from 'types/dtos/financeiro-gestao.dto';
import { parseMascaraMoeda } from 'utils/formatters';
import { ref } from 'vue';

export function useRenegociacoes() {
  const renegociacoes = ref<RenegociacaoDto[]>([]);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(params?: EscopoListagemParams): Promise<void> {
    carregando.value = true;
    try {
      renegociacoes.value = await financeiroGestaoService.listarRenegociacoes(params);
    } catch (e) {
      erro(mensagem(e));
      renegociacoes.value = [];
    } finally {
      carregando.value = false;
    }
  }

  async function criar(form: RenegociacaoFormModel): Promise<boolean> {
    salvando.value = true;
    try {
      await financeiroGestaoService.criarRenegociacao({
        clienteId: form.clienteId,
        contasReceberIds: form.contasReceberIds,
        valorMora: parseMascaraMoeda(form.valorMora),
        valorMulta: parseMascaraMoeda(form.valorMulta),
        numeroParcelas: Number(form.numeroParcelas),
        observacao: form.observacao.trim() || null,
      });
      sucesso('Renegociação criada.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function aprovar(item: RenegociacaoDto): Promise<boolean> {
    salvando.value = true;
    try {
      await financeiroGestaoService.aprovarRenegociacao(item.id);
      sucesso('Renegociação aprovada.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function rejeitar(item: RenegociacaoDto): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Rejeitar renegociação',
      mensagem: 'Deseja rejeitar esta renegociação?',
      textoConfirmar: 'Rejeitar',
      icone: 'warning',
    });
    if (!confirmou) return false;

    salvando.value = true;
    try {
      await financeiroGestaoService.rejeitarRenegociacao(item.id);
      sucesso('Renegociação rejeitada.');
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
    renegociacoes,
    carregando,
    salvando,
    carregar,
    criar,
    aprovar,
    rejeitar,
  };
}
