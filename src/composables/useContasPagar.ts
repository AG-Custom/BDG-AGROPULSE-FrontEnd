import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { messageService } from 'services/message.service';
import { financeiroService } from 'services/financeiro.service';
import type {
  BaixarContaPagarPayload,
  ContaPagarDto,
  ListarContasPagarParams,
} from 'types/dtos/financeiro.dto';
import { ref } from 'vue';

export function useContasPagar() {
  const contas = ref<ContaPagarDto[]>([]);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
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

  async function baixar(
    id: string,
    payload: BaixarContaPagarPayload,
    paramsRecarregar?: ListarContasPagarParams,
  ): Promise<boolean> {
    salvando.value = true;

    try {
      await financeiroService.baixarContaPagar(id, payload);
      sucesso('Conta baixada com sucesso.');
      await carregar(paramsRecarregar);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function cancelar(
    item: ContaPagarDto,
    paramsRecarregar?: ListarContasPagarParams,
  ): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Cancelar conta a pagar',
      mensagem: 'Deseja cancelar este título?',
      textoConfirmar: 'Cancelar título',
      icone: 'warning',
    });

    if (!confirmou) {
      return false;
    }

    salvando.value = true;

    try {
      await financeiroService.cancelarContaPagar(item.id);
      sucesso('Conta cancelada.');
      await carregar(paramsRecarregar);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  function limpar(): void {
    contas.value = [];
  }

  return {
    contas,
    carregando,
    salvando,
    carregar,
    baixar,
    cancelar,
    limpar,
  };
}
