import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { financeiroGestaoService } from 'services/financeiro-gestao.service';
import type {
  FluxoCaixaDto,
  ListarFluxoCaixaParams,
} from 'types/dtos/financeiro-gestao.dto';
import { ref } from 'vue';

export function useFluxoCaixa() {
  const fluxo = ref<FluxoCaixaDto | null>(null);
  const carregando = ref(false);
  const { erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(params?: ListarFluxoCaixaParams): Promise<void> {
    carregando.value = true;
    try {
      fluxo.value = await financeiroGestaoService.obterFluxoCaixa(params);
    } catch (e) {
      erro(mensagem(e));
      fluxo.value = null;
    } finally {
      carregando.value = false;
    }
  }

  return { fluxo, carregando, carregar };
}
