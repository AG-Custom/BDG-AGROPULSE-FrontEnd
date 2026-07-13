import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { financeiroService } from 'services/financeiro.service';
import type { ContaPagarDto, ListarContasPagarParams } from 'types/dtos/financeiro.dto';
import { ref } from 'vue';

export function useContasPagar() {
  const contas = ref<ContaPagarDto[]>([]);
  const carregando = ref(false);
  const { erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(params?: ListarContasPagarParams): Promise<void> {
    carregando.value = true;

    try {
      contas.value = await financeiroService.listarContasPagar(params);
    } catch (e) {
      erro(mensagem(e));
      contas.value = [];
    } finally {
      carregando.value = false;
    }
  }

  function limpar(): void {
    contas.value = [];
  }

  return {
    contas,
    carregando,
    carregar,
    limpar,
  };
}
