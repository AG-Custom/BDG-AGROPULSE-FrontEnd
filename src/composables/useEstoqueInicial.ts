import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { estoqueService } from 'services/estoque.service';
import type {
  EntradaEstoqueFormModel,
  EstoqueInicialStatusDto,
  MovimentacaoEstoqueDto,
} from 'types/dtos/estoque.dto';
import { formParaEntradaPayload } from 'utils/mappers/estoque.mapper';
import { ref } from 'vue';

export function useEstoqueInicial() {
  const status = ref<EstoqueInicialStatusDto | null>(null);
  const movimentacoes = ref<MovimentacaoEstoqueDto[]>([]);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregarStatus(): Promise<void> {
    carregando.value = true;

    try {
      status.value = await estoqueService.obterStatusEstoqueInicial();
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function lancar(itens: EntradaEstoqueFormModel[]): Promise<boolean> {
    if (itens.length === 0) {
      erro('Adicione ao menos um item para lançar o estoque inicial.');
      return false;
    }

    salvando.value = true;

    try {
      movimentacoes.value = await estoqueService.lancarEstoqueInicial({
        itens: itens.map(formParaEntradaPayload),
      });
      await carregarStatus();
      sucesso('Estoque inicial lançado com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  return {
    status,
    movimentacoes,
    carregando,
    salvando,
    carregarStatus,
    lancar,
  };
}
