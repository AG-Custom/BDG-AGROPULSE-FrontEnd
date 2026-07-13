import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { messageService } from 'services/message.service';
import { pedidoVendaService } from 'services/pedido-venda.service';
import type { PedidoVendaDto } from 'types/dtos/pedido-venda.dto';
import { ref } from 'vue';

export function usePedidoVenda() {
  const pedido = ref<PedidoVendaDto | null>(null);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function obter(pedidoId: string): Promise<boolean> {
    carregando.value = true;

    try {
      pedido.value = await pedidoVendaService.obter(pedidoId);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      carregando.value = false;
    }
  }

  async function enviarAprovacao(pedidoId: string): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Enviar para aprovação',
      mensagem:
        'O estoque será reservado (FEFO) e o pedido entrará em aguardando aprovação. Deseja continuar?',
      textoConfirmar: 'Enviar',
      icone: 'warning',
    });

    if (!confirmou) {
      return false;
    }

    salvando.value = true;

    try {
      pedido.value = await pedidoVendaService.enviarAprovacao(pedidoId);
      sucesso('Pedido enviado para aprovação.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function aprovar(pedidoId: string): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Aprovar pedido',
      mensagem: 'Deseja aprovar este pedido de venda?',
      textoConfirmar: 'Aprovar',
      icone: 'info',
    });

    if (!confirmou) {
      return false;
    }

    salvando.value = true;

    try {
      pedido.value = await pedidoVendaService.aprovar(pedidoId);
      sucesso('Pedido aprovado com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function recusar(pedidoId: string, motivo?: string): Promise<boolean> {
    salvando.value = true;

    try {
      pedido.value = await pedidoVendaService.recusar(pedidoId, {
        motivo: motivo?.trim() || null,
      });
      sucesso('Pedido recusado. Estoque devolvido.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function solicitarRecusa(pedidoId: string, motivo?: string): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Recusar pedido',
      mensagem:
        'Ao recusar, a reserva de estoque será devolvida. Deseja continuar?',
      textoConfirmar: 'Recusar',
      icone: 'warning',
    });

    if (!confirmou) {
      return false;
    }

    return recusar(pedidoId, motivo);
  }

  async function expirar(pedidoId: string): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Expirar pedido',
      mensagem:
        'Ao expirar, a reserva de estoque será devolvida. Deseja continuar?',
      textoConfirmar: 'Expirar',
      icone: 'warning',
    });

    if (!confirmou) {
      return false;
    }

    salvando.value = true;

    try {
      pedido.value = await pedidoVendaService.expirar(pedidoId);
      sucesso('Pedido expirado. Estoque devolvido.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function faturar(pedidoId: string): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Faturar pedido',
      mensagem:
        'Serão geradas as contas a receber conforme a condição de pagamento. Deseja faturar?',
      textoConfirmar: 'Faturar',
      icone: 'info',
    });

    if (!confirmou) {
      return false;
    }

    salvando.value = true;

    try {
      pedido.value = await pedidoVendaService.faturar(pedidoId);
      sucesso('Pedido faturado com sucesso.');
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  return {
    pedido,
    carregando,
    salvando,
    obter,
    enviarAprovacao,
    aprovar,
    solicitarRecusa,
    expirar,
    faturar,
  };
}
