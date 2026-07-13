import { api } from 'services/api';
import type {
  CotacaoCompraDto,
  CriarCotacaoCompraPayload,
  CriarPedidoCompraPayload,
  CriarSolicitacaoCompraPayload,
  ListarCotacoesCompraParams,
  ListarPedidosCompraParams,
  ListarSolicitacoesCompraParams,
  PedidoCompraDto,
  ResponderCotacaoPayload,
  SolicitacaoCompraDto,
} from 'types/dtos/compras.dto';

export const comprasService = {
  listarSolicitacoes(
    params?: ListarSolicitacoesCompraParams,
  ): Promise<SolicitacaoCompraDto[]> {
    return api
      .get<SolicitacaoCompraDto[]>('/compras/solicitacoes', { params })
      .then((r) => r.data);
  },

  obterSolicitacao(id: string): Promise<SolicitacaoCompraDto> {
    return api
      .get<SolicitacaoCompraDto>(`/compras/solicitacoes/${id}`)
      .then((r) => r.data);
  },

  criarSolicitacao(payload: CriarSolicitacaoCompraPayload): Promise<SolicitacaoCompraDto> {
    return api
      .post<SolicitacaoCompraDto>('/compras/solicitacoes', payload)
      .then((r) => r.data);
  },

  cancelarSolicitacao(id: string): Promise<void> {
    return api.post(`/compras/solicitacoes/${id}/cancelar`).then(() => undefined);
  },

  listarCotacoes(params?: ListarCotacoesCompraParams): Promise<CotacaoCompraDto[]> {
    return api
      .get<CotacaoCompraDto[]>('/compras/cotacoes', { params })
      .then((r) => r.data);
  },

  obterCotacao(id: string): Promise<CotacaoCompraDto> {
    return api.get<CotacaoCompraDto>(`/compras/cotacoes/${id}`).then((r) => r.data);
  },

  criarCotacao(payload: CriarCotacaoCompraPayload): Promise<CotacaoCompraDto> {
    return api
      .post<CotacaoCompraDto>('/compras/cotacoes', payload)
      .then((r) => r.data);
  },

  responderCotacao(
    id: string,
    payload: ResponderCotacaoPayload,
  ): Promise<CotacaoCompraDto> {
    return api
      .post<CotacaoCompraDto>(`/compras/cotacoes/${id}/respostas`, payload)
      .then((r) => r.data);
  },

  encerrarCotacao(id: string): Promise<void> {
    return api.post(`/compras/cotacoes/${id}/encerrar`).then(() => undefined);
  },

  listarPedidos(params?: ListarPedidosCompraParams): Promise<PedidoCompraDto[]> {
    return api
      .get<PedidoCompraDto[]>('/compras/pedidos', { params })
      .then((r) => r.data);
  },

  obterPedido(id: string): Promise<PedidoCompraDto> {
    return api.get<PedidoCompraDto>(`/compras/pedidos/${id}`).then((r) => r.data);
  },

  criarPedido(payload: CriarPedidoCompraPayload): Promise<PedidoCompraDto> {
    return api
      .post<PedidoCompraDto>('/compras/pedidos', payload)
      .then((r) => r.data);
  },

  enviarPedido(id: string): Promise<PedidoCompraDto> {
    return api
      .post<PedidoCompraDto>(`/compras/pedidos/${id}/enviar`)
      .then((r) => r.data);
  },

  receberPedido(id: string): Promise<PedidoCompraDto> {
    return api
      .post<PedidoCompraDto>(`/compras/pedidos/${id}/receber`)
      .then((r) => r.data);
  },

  cancelarPedido(id: string): Promise<void> {
    return api.post(`/compras/pedidos/${id}/cancelar`).then(() => undefined);
  },
};
