import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { estoqueService } from 'services/estoque.service';
import type {
  AlertaEstoqueMinimoDto,
  ListarAlertasValidadeParams,
  LoteDto,
} from 'types/dtos/estoque.dto';
import { ref } from 'vue';

export function useEstoqueAlertas() {
  const alertasMinimo = ref<AlertaEstoqueMinimoDto[]>([]);
  const alertasValidade = ref<LoteDto[]>([]);
  const carregandoMinimo = ref(false);
  const carregandoValidade = ref(false);
  const { erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregarMinimo(): Promise<void> {
    carregandoMinimo.value = true;

    try {
      alertasMinimo.value = await estoqueService.listarAlertasMinimo();
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregandoMinimo.value = false;
    }
  }

  async function carregarValidade(params?: ListarAlertasValidadeParams): Promise<void> {
    carregandoValidade.value = true;

    try {
      alertasValidade.value = await estoqueService.listarAlertasValidade(params);
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregandoValidade.value = false;
    }
  }

  return {
    alertasMinimo,
    alertasValidade,
    carregandoMinimo,
    carregandoValidade,
    carregarMinimo,
    carregarValidade,
  };
}
