import { api } from 'services/api';
import type {
  AlcadaAprovacaoCompraDto,
  AtualizarItensRecebimentoPayload,
  ComparativoCotacaoDto,
  ComprasConfigDto,
  ConfirmarRecebimentoPayload,
  CotacaoCompraDto,
  AtualizarContratoFornecimentoPayload,
  ContratoFornecimentoAlertaDto,
  ContratoFornecimentoDto,
  CriarContratoFornecimentoPayload,
  CriarCotacaoCompraPayload,
  CriarPedidoCompraPayload,
  CriarRecebimentoPayload,
  CriarSolicitacaoCompraPayload,
  DefinirAlcadasAprovacaoPayload,
  EnviarCotacaoPayload,
  EvolucaoPrecoCompraDto,
  HistoricoCompraDto,
  ListarContratosFornecimentoParams,
  ListarCotacoesCompraParams,
  ListarEvolucaoPrecoComprasParams,
  ListarHistoricoComprasParams,
  ListarPedidosCompraParams,
  ListarRecebimentosCompraParams,
  ListarSolicitacoesCompraParams,
  PedidoCompraDto,
  PreviewRecebimentoXmlDto,
  PreviewXmlRecebimentoPayload,
  RecebimentoCompraDto,
  RegistrarDivergenciaRecebimentoPayload,
  ResponderCotacaoPayload,
  SalvarComprasConfigPayload,
  SolicitacaoCompraDto,
} from 'types/dtos/compras.dto';

export const comprasService = {
  obterConfig(): Promise<ComprasConfigDto> {
    return api.get<ComprasConfigDto>('/compras/config').then((r) => r.data);
  },

  salvarConfig(payload: SalvarComprasConfigPayload): Promise<ComprasConfigDto> {
    return api.put<ComprasConfigDto>('/compras/config', payload).then((r) => r.data);
  },

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

  obterComparativoCotacao(id: string): Promise<ComparativoCotacaoDto> {
    return api
      .get<ComparativoCotacaoDto>(`/compras/cotacoes/${id}/comparativo`)
      .then((r) => r.data);
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

  enviarCotacao(id: string, payload: EnviarCotacaoPayload): Promise<CotacaoCompraDto> {
    return api
      .post<CotacaoCompraDto>(`/compras/cotacoes/${id}/enviar`, payload)
      .then((r) => r.data);
  },

  listarContratosFornecimento(
    params?: ListarContratosFornecimentoParams,
  ): Promise<ContratoFornecimentoDto[]> {
    return api
      .get<ContratoFornecimentoDto[]>('/compras/contratos-fornecimento', { params })
      .then((r) => r.data);
  },

  obterContratoFornecimento(id: string): Promise<ContratoFornecimentoDto> {
    return api
      .get<ContratoFornecimentoDto>(`/compras/contratos-fornecimento/${id}`)
      .then((r) => r.data);
  },

  criarContratoFornecimento(
    payload: CriarContratoFornecimentoPayload,
  ): Promise<ContratoFornecimentoDto> {
    return api
      .post<ContratoFornecimentoDto>('/compras/contratos-fornecimento', payload)
      .then((r) => r.data);
  },

  atualizarContratoFornecimento(
    id: string,
    payload: AtualizarContratoFornecimentoPayload,
  ): Promise<ContratoFornecimentoDto> {
    return api
      .put<ContratoFornecimentoDto>(`/compras/contratos-fornecimento/${id}`, payload)
      .then((r) => r.data);
  },

  cancelarContratoFornecimento(id: string): Promise<void> {
    return api
      .post(`/compras/contratos-fornecimento/${id}/cancelar`)
      .then(() => undefined);
  },

  alertasContratosFornecimento(dias = 30): Promise<ContratoFornecimentoAlertaDto[]> {
    return api
      .get<ContratoFornecimentoAlertaDto[]>('/compras/contratos-fornecimento/alertas', {
        params: { dias },
      })
      .then((r) => r.data);
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

  receberPedido(id: string): Promise<RecebimentoCompraDto> {
    return api
      .post<RecebimentoCompraDto>(`/compras/pedidos/${id}/receber`)
      .then((r) => r.data);
  },

  cancelarPedido(id: string): Promise<void> {
    return api.post(`/compras/pedidos/${id}/cancelar`).then(() => undefined);
  },

  aprovarPedido(id: string): Promise<PedidoCompraDto> {
    return api
      .post<PedidoCompraDto>(`/compras/pedidos/${id}/aprovar`)
      .then((r) => r.data);
  },

  rejeitarPedido(id: string): Promise<PedidoCompraDto> {
    return api
      .post<PedidoCompraDto>(`/compras/pedidos/${id}/rejeitar`)
      .then((r) => r.data);
  },

  listarAprovacoesPendentes(): Promise<PedidoCompraDto[]> {
    return api.get<PedidoCompraDto[]>('/compras/aprovacoes').then((r) => r.data);
  },

  listarAlcadas(): Promise<AlcadaAprovacaoCompraDto[]> {
    return api.get<AlcadaAprovacaoCompraDto[]>('/compras/alcadas').then((r) => r.data);
  },

  definirAlcadas(
    payload: DefinirAlcadasAprovacaoPayload,
  ): Promise<AlcadaAprovacaoCompraDto[]> {
    return api
      .put<AlcadaAprovacaoCompraDto[]>('/compras/alcadas', payload)
      .then((r) => r.data);
  },

  previewXmlRecebimento(
    payload: PreviewXmlRecebimentoPayload,
  ): Promise<PreviewRecebimentoXmlDto> {
    return api
      .post<PreviewRecebimentoXmlDto>('/compras/recebimentos/preview-xml', payload)
      .then((r) => r.data);
  },

  listarRecebimentos(
    params?: ListarRecebimentosCompraParams,
  ): Promise<RecebimentoCompraDto[]> {
    return api
      .get<RecebimentoCompraDto[]>('/compras/recebimentos', { params })
      .then((r) => r.data);
  },

  obterRecebimento(id: string): Promise<RecebimentoCompraDto> {
    return api
      .get<RecebimentoCompraDto>(`/compras/recebimentos/${id}`)
      .then((r) => r.data);
  },

  criarRecebimento(payload: CriarRecebimentoPayload): Promise<RecebimentoCompraDto> {
    return api
      .post<RecebimentoCompraDto>('/compras/recebimentos', payload)
      .then((r) => r.data);
  },

  atualizarItensRecebimento(
    id: string,
    payload: AtualizarItensRecebimentoPayload,
  ): Promise<RecebimentoCompraDto> {
    return api
      .put<RecebimentoCompraDto>(`/compras/recebimentos/${id}/itens`, payload)
      .then((r) => r.data);
  },

  registrarDivergenciaRecebimento(
    id: string,
    payload: RegistrarDivergenciaRecebimentoPayload,
  ): Promise<RecebimentoCompraDto> {
    return api
      .post<RecebimentoCompraDto>(`/compras/recebimentos/${id}/divergencias`, payload)
      .then((r) => r.data);
  },

  confirmarRecebimento(
    id: string,
    payload?: ConfirmarRecebimentoPayload | null,
  ): Promise<RecebimentoCompraDto> {
    return api
      .post<RecebimentoCompraDto>(
        `/compras/recebimentos/${id}/confirmar`,
        payload ?? {},
      )
      .then((r) => r.data);
  },

  listarHistorico(params?: ListarHistoricoComprasParams): Promise<HistoricoCompraDto[]> {
    return api
      .get<HistoricoCompraDto[]>('/compras/historico', { params })
      .then((r) => r.data);
  },

  listarEvolucaoPreco(
    params: ListarEvolucaoPrecoComprasParams,
  ): Promise<EvolucaoPrecoCompraDto[]> {
    return api
      .get<EvolucaoPrecoCompraDto[]>('/compras/historico/preco-evolucao', { params })
      .then((r) => r.data);
  },
};
