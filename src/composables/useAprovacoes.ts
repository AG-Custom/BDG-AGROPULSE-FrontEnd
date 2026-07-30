import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import {
  PedidoVendaStatus,
  type PedidoVendaStatusValor,
} from 'constants/enums';
import { aprovacaoService } from 'services/aprovacao.service';
import { messageService } from 'services/message.service';
import { pedidoVendaService } from 'services/pedido-venda.service';
import type { PedidoFilaAprovacaoDto } from 'types/dtos/aprovacao.dto';
import type { PedidoVendaResumoDto } from 'types/dtos/pedido-venda.dto';
import { ref } from 'vue';

const STATUS_HISTORICO: PedidoVendaStatusValor[] = [
  PedidoVendaStatus.Aprovado,
  PedidoVendaStatus.Faturado,
  PedidoVendaStatus.Recusado,
  PedidoVendaStatus.Expirado,
];

export function useAprovacoes() {
  const fila = ref<PedidoFilaAprovacaoDto[]>([]);
  const historico = ref<PedidoVendaResumoDto[]>([]);
  const carregando = ref(false);
  const carregandoHistorico = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregar(): Promise<void> {
    carregando.value = true;

    try {
      fila.value = await aprovacaoService.listar();
    } catch (e) {
      erro(mensagem(e));
      fila.value = [];
    } finally {
      carregando.value = false;
    }
  }

  async function carregarHistorico(
    status?: PedidoVendaStatusValor | null,
  ): Promise<void> {
    carregandoHistorico.value = true;

    try {
      const statuses =
        status && STATUS_HISTORICO.includes(status)
          ? [status]
          : STATUS_HISTORICO;

      const listas = await Promise.all(
        statuses.map((item) => pedidoVendaService.listar({ status: item })),
      );

      historico.value = listas
        .flat()
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
    } catch (e) {
      erro(mensagem(e));
      historico.value = [];
    } finally {
      carregandoHistorico.value = false;
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
      await pedidoVendaService.aprovar(pedidoId);
      sucesso('Pedido aprovado com sucesso.');
      fila.value = fila.value.filter((item) => item.pedidoId !== pedidoId);
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
      await pedidoVendaService.recusar(pedidoId, {
        motivo: motivo?.trim() || null,
      });
      sucesso('Pedido recusado. Estoque devolvido.');
      fila.value = fila.value.filter((item) => item.pedidoId !== pedidoId);
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

  return {
    fila,
    historico,
    carregando,
    carregandoHistorico,
    salvando,
    carregar,
    carregarHistorico,
    aprovar,
    solicitarRecusa,
    statusHistoricoOpcoes: STATUS_HISTORICO,
  };
}
