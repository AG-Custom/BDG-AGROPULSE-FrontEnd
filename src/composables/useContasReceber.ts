import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { financeiroService } from 'services/financeiro.service';
import type { ContaReceberDto, ListarContasReceberParams } from 'types/dtos/financeiro.dto';
import { ref } from 'vue';

export function useContasReceber() {
  const contas = ref<ContaReceberDto[]>([]);
  const carregando = ref(false);
  const { erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(params?: ListarContasReceberParams): Promise<void> {
    carregando.value = true;

    try {
      contas.value = await financeiroService.listarContasReceber(params);
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
