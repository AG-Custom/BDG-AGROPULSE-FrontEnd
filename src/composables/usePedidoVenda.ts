import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { messageService } from 'services/message.service';
import { pedidoVendaService } from 'services/pedido-venda.service';
import type { TravaAprovacaoDto } from 'types/dtos/aprovacao.dto';
import type { PedidoVendaDto } from 'types/dtos/pedido-venda.dto';
import { PedidoVendaStatus } from 'constants/enums';
import { ref } from 'vue';

export function usePedidoVenda() {
  const pedido = ref<PedidoVendaDto | null>(null);
  const travas = ref<TravaAprovacaoDto[]>([]);
  const carregando = ref(false);
  const carregandoTravas = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregarTravas(pedidoId: string): Promise<void> {
    carregandoTravas.value = true;

    try {
      travas.value = await pedidoVendaService.obterTravas(pedidoId);
    } catch {
      travas.value = pedido.value?.travas ?? [];
    } finally {
      carregandoTravas.value = false;
    }
  }

  async function obter(pedidoId: string): Promise<boolean> {
    carregando.value = true;

    try {
      pedido.value = await pedidoVendaService.obter(pedidoId);
      void carregarTravas(pedidoId);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      carregando.value = false;
    }
  }

  function mensagemPosEnvio(atualizado: PedidoVendaDto): string {
    if (atualizado.status === PedidoVendaStatus.Aprovado) {
      return 'Pedido auto-aprovado (sem travas).';
    }

    if (atualizado.status === PedidoVendaStatus.PendenteEstoque) {
      return 'Pedido pendente de estoque. Será liberado automaticamente quando houver saldo.';
    }

    if (atualizado.status === PedidoVendaStatus.Aguardando) {
      return 'Pedido enviado para aprovação.';
    }

    return 'Pedido atualizado.';
  }

  async function enviarAprovacao(pedidoId: string): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Enviar para aprovação',
      mensagem:
        'O estoque será reservado quando possível. Pedidos sem travas podem ser auto-aprovados. Deseja continuar?',
      textoConfirmar: 'Enviar',
      icone: 'warning',
    });

    if (!confirmou) {
      return false;
    }

    salvando.value = true;

    try {
      pedido.value = await pedidoVendaService.enviarAprovacao(pedidoId);
      sucesso(mensagemPosEnvio(pedido.value));
      void carregarTravas(pedidoId);
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
    travas,
    carregando,
    carregandoTravas,
    salvando,
    obter,
    carregarTravas,
    enviarAprovacao,
    aprovar,
    solicitarRecusa,
    expirar,
    faturar,
  };
}
