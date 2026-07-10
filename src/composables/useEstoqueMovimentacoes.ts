import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { estoqueService } from 'services/estoque.service';
import type {
  AjusteEstoqueFormModel,
  EntradaEstoqueFormModel,
  ListarMovimentacoesParams,
  MovimentacaoEstoqueDto,
  SaidaEstoqueFormModel,
} from 'types/dtos/estoque.dto';
import {
  formParaAjustePayload,
  formParaEntradaPayload,
  formParaSaidaPayload,
} from 'utils/mappers/estoque.mapper';
import { ref } from 'vue';

export function useEstoqueMovimentacoes() {
  const movimentacoes = ref<MovimentacaoEstoqueDto[]>([]);
  const carregando = ref(false);
  const salvando = ref(false);
  const ultimosParams = ref<ListarMovimentacoesParams | undefined>();
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(params?: ListarMovimentacoesParams): Promise<void> {
    ultimosParams.value = params;
    carregando.value = true;

    try {
      movimentacoes.value = await estoqueService.listarMovimentacoes(params);
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function recarregar(): Promise<void> {
    await carregar(ultimosParams.value);
  }

  async function registrarEntrada(form: EntradaEstoqueFormModel): Promise<boolean> {
    salvando.value = true;

    try {
      await estoqueService.registrarEntrada(formParaEntradaPayload(form));
      await recarregar();
      sucesso('Entrada de estoque registrada com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function registrarSaida(form: SaidaEstoqueFormModel): Promise<boolean> {
    salvando.value = true;

    try {
      await estoqueService.registrarSaida(formParaSaidaPayload(form));
      await recarregar();
      sucesso('Saída de estoque registrada com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function registrarAjuste(form: AjusteEstoqueFormModel): Promise<boolean> {
    salvando.value = true;

    try {
      await estoqueService.registrarAjuste(formParaAjustePayload(form));
      await recarregar();
      sucesso('Ajuste de estoque registrado com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  return {
    movimentacoes,
    carregando,
    salvando,
    carregar,
    registrarEntrada,
    registrarSaida,
    registrarAjuste,
  };
}
