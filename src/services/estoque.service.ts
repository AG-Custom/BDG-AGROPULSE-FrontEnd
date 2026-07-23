import { api } from 'services/api';

import type {
  AjusteEstoquePayload,
  AlertaEstoqueMinimoDto,
  AlertaEstoqueZeradoDto,
  ConfirmarTransferenciaEstoquePayload,
  CriarTransferenciaEstoquePayload,
  EntradaEstoquePayload,
  EstoqueInicialStatusDto,
  IniciarInventarioPayload,
  InventarioDto,
  LancarEstoqueInicialPayload,
  ListarAlertasValidadeParams,
  ListarLotesParams,
  ListarMovimentacoesParams,
  ListarSaldosParams,
  LoteDto,
  MovimentacaoEstoqueDto,
  RegistrarContagemInventarioPayload,
  ReservaStatusDto,
  ReservarEstoquePedidoPayload,
  SaidaEstoquePayload,
  SaldoProdutoDto,
  TransferenciaEstoqueDto,
} from 'types/dtos/estoque.dto';
import type { GenealogiaLoteDto } from 'types/dtos/producao.dto';

export const estoqueService = {
  listarLotes(params?: ListarLotesParams): Promise<LoteDto[]> {
    return api.get<LoteDto[]>('/estoque/lotes', { params }).then((r) => r.data);
  },

  obterLote(loteId: string): Promise<LoteDto> {
    return api.get<LoteDto>(`/estoque/lotes/${loteId}`).then((r) => r.data);
  },

  obterGenealogiaLote(loteId: string): Promise<GenealogiaLoteDto> {
    return api
      .get<GenealogiaLoteDto>(`/estoque/lotes/${loteId}/genealogia`)
      .then((r) => r.data);
  },

  listarSaldos(params?: ListarSaldosParams): Promise<SaldoProdutoDto[]> {
    return api.get<SaldoProdutoDto[]>('/estoque/saldos', { params }).then((r) => r.data);
  },

  listarMovimentacoes(params?: ListarMovimentacoesParams): Promise<MovimentacaoEstoqueDto[]> {
    return api
      .get<MovimentacaoEstoqueDto[]>('/estoque/movimentacoes', { params })
      .then((r) => r.data);
  },

  registrarEntrada(payload: EntradaEstoquePayload): Promise<MovimentacaoEstoqueDto> {
    return api
      .post<MovimentacaoEstoqueDto>('/estoque/movimentacoes/entrada', payload)
      .then((r) => r.data);
  },

  registrarSaida(payload: SaidaEstoquePayload): Promise<MovimentacaoEstoqueDto> {
    return api
      .post<MovimentacaoEstoqueDto>('/estoque/movimentacoes/saida', payload)
      .then((r) => r.data);
  },

  registrarAjuste(payload: AjusteEstoquePayload): Promise<MovimentacaoEstoqueDto> {
    return api
      .post<MovimentacaoEstoqueDto>('/estoque/movimentacoes/ajuste', payload)
      .then((r) => r.data);
  },

  obterStatusEstoqueInicial(): Promise<EstoqueInicialStatusDto> {
    return api
      .get<EstoqueInicialStatusDto>('/estoque/inicial/status')
      .then((r) => r.data);
  },

  lancarEstoqueInicial(
    payload: LancarEstoqueInicialPayload,
  ): Promise<MovimentacaoEstoqueDto[]> {
    return api
      .post<MovimentacaoEstoqueDto[]>('/estoque/inicial/lancar', payload)
      .then((r) => r.data);
  },

  listarInventarios(): Promise<InventarioDto[]> {
    return api.get<InventarioDto[]>('/estoque/inventarios').then((r) => r.data);
  },

  iniciarInventario(payload?: IniciarInventarioPayload): Promise<InventarioDto> {
    return api
      .post<InventarioDto>('/estoque/inventarios/iniciar', payload ?? {})
      .then((r) => r.data);
  },

  obterInventario(inventarioId: string): Promise<InventarioDto> {
    return api
      .get<InventarioDto>(`/estoque/inventarios/${inventarioId}`)
      .then((r) => r.data);
  },

  registrarContagem(
    inventarioId: string,
    itemId: string,
    payload: RegistrarContagemInventarioPayload,
  ): Promise<InventarioDto> {
    return api
      .put<InventarioDto>(`/estoque/inventarios/${inventarioId}/itens/${itemId}`, payload)
      .then((r) => r.data);
  },

  concluirInventario(inventarioId: string): Promise<InventarioDto> {
    return api
      .post<InventarioDto>(`/estoque/inventarios/${inventarioId}/concluir`)
      .then((r) => r.data);
  },

  reservarPedido(payload: ReservarEstoquePedidoPayload): Promise<void> {
    return api.post('/estoque/reservas/reservar', payload);
  },

  devolverReserva(pedidoId: string): Promise<void> {
    return api.post(`/estoque/reservas/${pedidoId}/devolver`);
  },

  obterStatusReserva(pedidoId: string): Promise<ReservaStatusDto> {
    return api
      .get<ReservaStatusDto>(`/estoque/reservas/${pedidoId}/status`)
      .then((r) => r.data);
  },

  listarAlertasMinimo(): Promise<AlertaEstoqueMinimoDto[]> {
    return api
      .get<AlertaEstoqueMinimoDto[]>('/estoque/alertas/minimo')
      .then((r) => r.data);
  },

  listarAlertasZerado(): Promise<AlertaEstoqueZeradoDto[]> {
    return api
      .get<AlertaEstoqueZeradoDto[]>('/estoque/alertas/zerado')
      .then((r) => r.data);
  },

  listarAlertasValidade(params?: ListarAlertasValidadeParams): Promise<LoteDto[]> {
    return api.get<LoteDto[]>('/estoque/alertas/validade', { params }).then((r) => r.data);
  },

  listarTransferencias(): Promise<TransferenciaEstoqueDto[]> {
    return api.get<TransferenciaEstoqueDto[]>('/estoque/transferencias').then((r) => r.data);
  },

  obterTransferencia(id: string): Promise<TransferenciaEstoqueDto> {
    return api.get<TransferenciaEstoqueDto>(`/estoque/transferencias/${id}`).then((r) => r.data);
  },

  criarTransferencia(
    payload: CriarTransferenciaEstoquePayload,
  ): Promise<TransferenciaEstoqueDto> {
    return api
      .post<TransferenciaEstoqueDto>('/estoque/transferencias', payload)
      .then((r) => r.data);
  },

  confirmarTransferencia(
    id: string,
    payload?: ConfirmarTransferenciaEstoquePayload,
  ): Promise<TransferenciaEstoqueDto> {
    return api
      .post<TransferenciaEstoqueDto>(`/estoque/transferencias/${id}/confirmar`, payload ?? {})
      .then((r) => r.data);
  },

  cancelarTransferencia(id: string): Promise<TransferenciaEstoqueDto> {
    return api
      .post<TransferenciaEstoqueDto>(`/estoque/transferencias/${id}/cancelar`)
      .then((r) => r.data);
  },
};
