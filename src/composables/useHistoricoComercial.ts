import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { clienteService } from 'services/cliente.service';
import type { HistoricoComercialItemDto } from 'types/dtos/comercial-extras.dto';
import { ref } from 'vue';

export function useHistoricoComercial() {
  const itens = ref<HistoricoComercialItemDto[]>([]);
  const carregando = ref(false);
  const indisponivel = ref(false);
  const { erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(clienteId: string): Promise<void> {
    carregando.value = true;
    indisponivel.value = false;

    try {
      const historico = await clienteService.obterHistoricoComercial(clienteId);
      itens.value = historico.itens;
    } catch (e) {
      itens.value = [];
      indisponivel.value = true;
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  function limpar(): void {
    itens.value = [];
    indisponivel.value = false;
  }

  return {
    itens,
    carregando,
    indisponivel,
    carregar,
    limpar,
  };
}
