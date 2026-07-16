import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { financeiroGestaoService } from 'services/financeiro-gestao.service';
import type {
  EscopoListagemParams,
  TesourariaProjecaoDto,
  TesourariaSaldoIntradayDto,
} from 'types/dtos/financeiro-gestao.dto';
import { ref } from 'vue';

export function useTesouraria() {
  const saldo = ref<TesourariaSaldoIntradayDto | null>(null);
  const projecao = ref<TesourariaProjecaoDto | null>(null);
  const carregando = ref(false);
  const { erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregarSaldo(params?: EscopoListagemParams): Promise<void> {
    carregando.value = true;
    try {
      saldo.value = await financeiroGestaoService.obterSaldoIntraday(params);
    } catch (e) {
      erro(mensagem(e));
      saldo.value = null;
    } finally {
      carregando.value = false;
    }
  }

  async function carregarProjecao(
    params?: EscopoListagemParams & { dias?: number },
  ): Promise<void> {
    carregando.value = true;
    try {
      projecao.value = await financeiroGestaoService.obterProjecaoTesouraria(params);
    } catch (e) {
      erro(mensagem(e));
      projecao.value = null;
    } finally {
      carregando.value = false;
    }
  }

  return {
    saldo,
    projecao,
    carregando,
    carregarSaldo,
    carregarProjecao,
  };
}
