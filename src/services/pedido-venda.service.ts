import { api } from 'services/api';
import type { TravaAprovacaoDto } from 'types/dtos/aprovacao.dto';
import type {
  CriarPedidoVendaPayload,
  EditarPedidoVendaPayload,
  ListarPedidosVendaParams,
  PedidoVendaDto,
  PedidoVendaResumoDto,
  RecusarPedidoVendaPayload,
} from 'types/dtos/pedido-venda.dto';
import type { ExportacaoPedidoFormatoValor } from 'constants/enums';

export const pedidoVendaService = {
  listar(params?: ListarPedidosVendaParams): Promise<PedidoVendaResumoDto[]> {
    return api
      .get<PedidoVendaResumoDto[]>('/pedidos-venda', { params })
      .then((r) => r.data);
  },

  exportar(
    formato: ExportacaoPedidoFormatoValor,
    params?: Omit<ListarPedidosVendaParams, 'exportar'>,
  ): Promise<Blob> {
    return api
      .get<Blob>('/pedidos-venda', {
        params: { ...params, exportar: formato },
        responseType: 'blob',
      })
      .then((r) => r.data);
  },

  obter(id: string): Promise<PedidoVendaDto> {
    return api.get<PedidoVendaDto>(`/pedidos-venda/${id}`).then((r) => r.data);
  },

  obterTravas(id: string): Promise<TravaAprovacaoDto[]> {
    return api
      .get<TravaAprovacaoDto[]>(`/pedidos-venda/${id}/travas`)
      .then((r) => r.data);
  },

  criar(payload: CriarPedidoVendaPayload): Promise<PedidoVendaDto> {
    return api.post<PedidoVendaDto>('/pedidos-venda', payload).then((r) => r.data);
  },

  editar(id: string, payload: EditarPedidoVendaPayload): Promise<PedidoVendaDto> {
    return api.put<PedidoVendaDto>(`/pedidos-venda/${id}`, payload).then((r) => r.data);
  },

  enviarAprovacao(id: string): Promise<PedidoVendaDto> {
    return api
      .post<PedidoVendaDto>(`/pedidos-venda/${id}/enviar-aprovacao`)
      .then((r) => r.data);
  },

  aprovar(id: string): Promise<PedidoVendaDto> {
    return api.post<PedidoVendaDto>(`/pedidos-venda/${id}/aprovar`).then((r) => r.data);
  },

  recusar(id: string, payload?: RecusarPedidoVendaPayload): Promise<PedidoVendaDto> {
    return api
      .post<PedidoVendaDto>(`/pedidos-venda/${id}/recusar`, payload ?? {})
      .then((r) => r.data);
  },

  expirar(id: string): Promise<PedidoVendaDto> {
    return api.post<PedidoVendaDto>(`/pedidos-venda/${id}/expirar`).then((r) => r.data);
  },

  faturar(id: string): Promise<PedidoVendaDto> {
    return api.post<PedidoVendaDto>(`/pedidos-venda/${id}/faturar`).then((r) => r.data);
  },
};
