import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { estoqueService } from 'services/estoque.service';
import type { ListarLotesParams, LoteDto } from 'types/dtos/estoque.dto';
import type { GenealogiaLoteDto } from 'types/dtos/producao.dto';
import { ref } from 'vue';

export function useEstoqueLotes() {
  const lotes = ref<LoteDto[]>([]);
  const genealogia = ref<GenealogiaLoteDto | null>(null);
  const carregando = ref(false);
  const carregandoGenealogia = ref(false);
  const { erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(params?: ListarLotesParams): Promise<void> {
    carregando.value = true;

    try {
      lotes.value = await estoqueService.listarLotes(params);
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function obterGenealogia(loteId: string): Promise<boolean> {
    carregandoGenealogia.value = true;
    try {
      genealogia.value = await estoqueService.obterGenealogiaLote(loteId);
      return true;
    } catch (e) {
      erro(mensagem(e));
      genealogia.value = null;
      return false;
    } finally {
      carregandoGenealogia.value = false;
    }
  }

  return {
    lotes,
    genealogia,
    carregando,
    carregandoGenealogia,
    carregar,
    obterGenealogia,
  };
}
