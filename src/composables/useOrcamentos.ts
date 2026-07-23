import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { orcamentoService } from 'services/orcamento.service';
import type {
  CriarOrcamentoPayload,
  EditarOrcamentoPayload,
  ListarOrcamentosParams,
  OrcamentoDto,
  OrcamentoFormModel,
  OrcamentoResumoDto,
} from 'types/dtos/orcamento.dto';
import { parseMascaraMoeda } from 'utils/formatters';
import { ref } from 'vue';

function parsePrecoOpcional(valor: string): number | null {
  const numero = parseMascaraMoeda(valor);
  return numero !== null && numero > 0 ? numero : null;
}

function formParaPayload(form: OrcamentoFormModel): CriarOrcamentoPayload {
  return {
    clienteId: form.clienteId,
    vendedorUsuarioId: form.vendedorUsuarioId || null,
    tabelaPrecoId: form.tabelaPrecoId || null,
    observacao: form.observacao.trim() || null,
    itens: form.itens.map((item) => ({
      produtoId: item.produtoId,
      quantidade: Number(item.quantidade),
      precoUnitario: parsePrecoOpcional(item.precoUnitario),
    })),
  };
}

export function useOrcamentos() {
  const orcamentos = ref<OrcamentoResumoDto[]>([]);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(params?: ListarOrcamentosParams): Promise<void> {
    carregando.value = true;

    try {
      orcamentos.value = await orcamentoService.listar(params);
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function criar(form: OrcamentoFormModel): Promise<OrcamentoDto | null> {
    salvando.value = true;

    try {
      const criado = await orcamentoService.criar(formParaPayload(form));
      sucesso('Orçamento criado com sucesso.');
      return criado;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function editar(
    orcamentoId: string,
    form: OrcamentoFormModel,
  ): Promise<OrcamentoDto | null> {
    salvando.value = true;

    try {
      const payload: EditarOrcamentoPayload = formParaPayload(form);
      const atualizado = await orcamentoService.editar(orcamentoId, payload);
      sucesso('Orçamento atualizado com sucesso.');
      return atualizado;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  return {
    orcamentos,
    carregando,
    salvando,
    carregar,
    criar,
    editar,
  };
}
