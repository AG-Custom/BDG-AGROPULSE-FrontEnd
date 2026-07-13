import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import { messageService } from 'services/message.service';
import { comprasService } from 'services/compras.service';
import type {
  ComparativoCotacaoDto,
  CotacaoCompraDto,
  CriarCotacaoCompraPayload,
  CriarPedidoCompraPayload,
  CriarSolicitacaoCompraPayload,
  ListarCotacoesCompraParams,
  ListarPedidosCompraParams,
  ListarSolicitacoesCompraParams,
  PedidoCompraDto,
  RecebimentoCompraDto,
  ResponderCotacaoPayload,
  SolicitacaoCompraDto,
} from 'types/dtos/compras.dto';
import { ref } from 'vue';

export function useCompras() {
  const solicitacoes = ref<SolicitacaoCompraDto[]>([]);
  const solicitacao = ref<SolicitacaoCompraDto | null>(null);
  const cotacoes = ref<CotacaoCompraDto[]>([]);
  const cotacao = ref<CotacaoCompraDto | null>(null);
  const comparativo = ref<ComparativoCotacaoDto | null>(null);
  const pedidos = ref<PedidoCompraDto[]>([]);
  const pedido = ref<PedidoCompraDto | null>(null);
  const carregando = ref(false);
  const salvando = ref(false);
  const { sucesso, erro } = useNotificacao();
  const { mensagem } = useTratarErroFormulario();

  async function carregarSolicitacoes(
    params?: ListarSolicitacoesCompraParams,
  ): Promise<void> {
    carregando.value = true;

    try {
      solicitacoes.value = await comprasService.listarSolicitacoes(params);
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function obterSolicitacao(id: string): Promise<boolean> {
    carregando.value = true;

    try {
      solicitacao.value = await comprasService.obterSolicitacao(id);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      carregando.value = false;
    }
  }

  async function criarSolicitacao(
    payload: CriarSolicitacaoCompraPayload,
  ): Promise<SolicitacaoCompraDto | null> {
    salvando.value = true;

    try {
      const criada = await comprasService.criarSolicitacao(payload);
      sucesso('Solicitação de compra criada.');
      return criada;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function cancelarSolicitacao(id: string): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Cancelar solicitação',
      mensagem: 'Deseja cancelar esta solicitação de compra?',
      textoConfirmar: 'Cancelar',
      icone: 'warning',
    });

    if (!confirmou) {
      return false;
    }

    salvando.value = true;

    try {
      await comprasService.cancelarSolicitacao(id);
      sucesso('Solicitação cancelada.');
      solicitacao.value = await comprasService.obterSolicitacao(id);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function carregarCotacoes(params?: ListarCotacoesCompraParams): Promise<void> {
    carregando.value = true;

    try {
      cotacoes.value = await comprasService.listarCotacoes(params);
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function obterCotacao(id: string): Promise<boolean> {
    carregando.value = true;

    try {
      cotacao.value = await comprasService.obterCotacao(id);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      carregando.value = false;
    }
  }

  async function carregarComparativo(id: string): Promise<void> {
    try {
      comparativo.value = await comprasService.obterComparativoCotacao(id);
    } catch (e) {
      erro(mensagem(e));
      comparativo.value = null;
    }
  }

  async function criarCotacao(
    payload: CriarCotacaoCompraPayload,
  ): Promise<CotacaoCompraDto | null> {
    salvando.value = true;

    try {
      const criada = await comprasService.criarCotacao(payload);
      sucesso('Cotação criada com sucesso.');
      return criada;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function responderCotacao(
    id: string,
    payload: ResponderCotacaoPayload,
  ): Promise<boolean> {
    salvando.value = true;

    try {
      cotacao.value = await comprasService.responderCotacao(id, payload);
      sucesso('Resposta registrada.');
      await carregarComparativo(id);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function encerrarCotacao(id: string): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Encerrar cotação',
      mensagem: 'Deseja encerrar esta cotação?',
      textoConfirmar: 'Encerrar',
      icone: 'info',
    });

    if (!confirmou) {
      return false;
    }

    salvando.value = true;

    try {
      await comprasService.encerrarCotacao(id);
      sucesso('Cotação encerrada.');
      cotacao.value = await comprasService.obterCotacao(id);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function carregarPedidos(params?: ListarPedidosCompraParams): Promise<void> {
    carregando.value = true;

    try {
      pedidos.value = await comprasService.listarPedidos(params);
    } catch (e) {
      erro(mensagem(e));
    } finally {
      carregando.value = false;
    }
  }

  async function obterPedido(id: string): Promise<boolean> {
    carregando.value = true;

    try {
      pedido.value = await comprasService.obterPedido(id);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      carregando.value = false;
    }
  }

  async function criarPedido(
    payload: CriarPedidoCompraPayload,
  ): Promise<PedidoCompraDto | null> {
    salvando.value = true;

    try {
      const criado = await comprasService.criarPedido(payload);
      sucesso('Pedido de compra criado.');
      return criado;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function enviarPedido(id: string): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Enviar pedido',
      mensagem: 'Deseja enviar este pedido ao fornecedor?',
      textoConfirmar: 'Enviar',
      icone: 'info',
    });

    if (!confirmou) {
      return false;
    }

    salvando.value = true;

    try {
      pedido.value = await comprasService.enviarPedido(id);
      sucesso(
        pedido.value.status === 'AguardandoAprovacao'
          ? 'Pedido enviado para aprovação.'
          : 'Pedido enviado.',
      );
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  async function receberPedido(id: string): Promise<RecebimentoCompraDto | null> {
    salvando.value = true;

    try {
      const recebimento = await comprasService.receberPedido(id);
      sucesso('Recebimento aberto para conferência.');
      return recebimento;
    } catch (e) {
      erro(mensagem(e));
      return null;
    } finally {
      salvando.value = false;
    }
  }

  async function cancelarPedido(id: string): Promise<boolean> {
    const confirmou = await messageService.confirmar({
      titulo: 'Cancelar pedido',
      mensagem: 'Deseja cancelar este pedido de compra?',
      textoConfirmar: 'Cancelar',
      icone: 'warning',
    });

    if (!confirmou) {
      return false;
    }

    salvando.value = true;

    try {
      await comprasService.cancelarPedido(id);
      sucesso('Pedido cancelado.');
      pedido.value = await comprasService.obterPedido(id);
      return true;
    } catch (e) {
      erro(mensagem(e));
      return false;
    } finally {
      salvando.value = false;
    }
  }

  return {
    solicitacoes,
    solicitacao,
    cotacoes,
    cotacao,
    comparativo,
    pedidos,
    pedido,
    carregando,
    salvando,
    carregarSolicitacoes,
    obterSolicitacao,
    criarSolicitacao,
    cancelarSolicitacao,
    carregarCotacoes,
    obterCotacao,
    carregarComparativo,
    criarCotacao,
    responderCotacao,
    encerrarCotacao,
    carregarPedidos,
    obterPedido,
    criarPedido,
    enviarPedido,
    receberPedido,
    cancelarPedido,
  };
}
