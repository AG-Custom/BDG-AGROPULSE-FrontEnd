import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { messageService } from 'services/message.service';
import { estoqueService } from 'services/estoque.service';
import type {
  ConfirmarTransferenciaEstoquePayload,
  TransferenciaEstoqueDto,
  TransferenciaEstoqueFormModel,
} from 'types/dtos/estoque.dto';
import { formParaTransferenciaPayload } from 'utils/mappers/estoque.mapper';
import { ref } from 'vue';

export function useEstoqueTransferencias() {
  const transferencias = ref<TransferenciaEstoqueDto[]>([]);
  const transferencia = ref<TransferenciaEstoqueDto | null>(null);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(): Promise<void> {
    carregando.value = true;

    try {
      transferencias.value = await estoqueService.listarTransferencias();
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function obter(id: string): Promise<boolean> {
    carregando.value = true;

    try {
      transferencia.value = await estoqueService.obterTransferencia(id);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      carregando.value = false;
    }
  }

  async function criar(form: TransferenciaEstoqueFormModel): Promise<TransferenciaEstoqueDto | null> {
    salvando.value = true;

    try {
      const criada = await estoqueService.criarTransferencia(formParaTransferenciaPayload(form));
      sucesso('Transferência criada como pendente.');
      await carregar();
      return criada;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function confirmar(
    id: string,
    payload?: ConfirmarTransferenciaEstoquePayload,
  ): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Confirmar transferência',
      mensagem:
        'Ao confirmar, o estoque será baixado na origem e entrará no destino. Deseja continuar?',
      textoConfirmar: 'Confirmar',
      icone: 'warning',
    });

    if (!confirmou) {
      return false;
    }

    salvando.value = true;

    try {
      transferencia.value = await estoqueService.confirmarTransferencia(id, payload);
      sucesso('Transferência confirmada com sucesso.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function cancelar(id: string): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Cancelar transferência',
      mensagem: 'Deseja cancelar esta transferência pendente?',
      textoConfirmar: 'Cancelar transferência',
      icone: 'warning',
    });

    if (!confirmou) {
      return false;
    }

    salvando.value = true;

    try {
      transferencia.value = await estoqueService.cancelarTransferencia(id);
      sucesso('Transferência cancelada.');
      await carregar();
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  return {
    transferencias,
    transferencia,
    carregando,
    salvando,
    carregar,
    obter,
    criar,
    confirmar,
    cancelar,
  };
}
