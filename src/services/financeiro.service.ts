import { api } from 'services/api';
import type {
  BaixarContaPagarPayload,
  BaixarContaReceberPayload,
  CondicaoPagamentoDto,
  ConfigFormaPagamentoDto,
  ContaPagarDto,
  ContaReceberDto,
  CriarCondicaoPagamentoPayload,
  CriarConfigFormaPagamentoPayload,
  EditarCondicaoPagamentoPayload,
  EditarConfigFormaPagamentoPayload,
  ListarContasPagarParams,
  ListarContasReceberParams,
  UpsertTaxaFormaPagamentoPayload,
} from 'types/dtos/financeiro.dto';

export const financeiroService = {
  listarCondicoesPagamento(): Promise<CondicaoPagamentoDto[]> {
    return api
      .get<CondicaoPagamentoDto[]>('/condicoes-pagamento')
      .then((r) => r.data);
  },

  obterCondicaoPagamento(id: string): Promise<CondicaoPagamentoDto> {
    return api
      .get<CondicaoPagamentoDto>(`/condicoes-pagamento/${id}`)
      .then((r) => r.data);
  },

  criarCondicaoPagamento(
    payload: CriarCondicaoPagamentoPayload,
  ): Promise<CondicaoPagamentoDto> {
    return api
      .post<CondicaoPagamentoDto>('/condicoes-pagamento', payload)
      .then((r) => r.data);
  },

  editarCondicaoPagamento(
    id: string,
    payload: EditarCondicaoPagamentoPayload,
  ): Promise<CondicaoPagamentoDto> {
    return api
      .put<CondicaoPagamentoDto>(`/condicoes-pagamento/${id}`, payload)
      .then((r) => r.data);
  },

  inativarCondicaoPagamento(id: string, justificativa: string): Promise<void> {
    return api.patch(`/condicoes-pagamento/${id}/inativar`, { justificativa }).then(() => undefined);
  },

  ativarCondicaoPagamento(id: string): Promise<void> {
    return api.patch(`/condicoes-pagamento/${id}/ativar`).then(() => undefined);
  },

  listarContasReceber(params?: ListarContasReceberParams): Promise<ContaReceberDto[]> {
    return api
      .get<ContaReceberDto[]>('/contas-receber', { params })
      .then((r) => r.data);
  },

  baixarContaReceber(
    id: string,
    payload: BaixarContaReceberPayload,
  ): Promise<ContaReceberDto> {
    return api
      .post<ContaReceberDto>(`/contas-receber/${id}/baixar`, payload)
      .then((r) => r.data);
  },

  cancelarContaReceber(id: string): Promise<ContaReceberDto> {
    return api
      .post<ContaReceberDto>(`/contas-receber/${id}/cancelar`)
      .then((r) => r.data);
  },

  listarContasPagar(params?: ListarContasPagarParams): Promise<ContaPagarDto[]> {
    return api
      .get<ContaPagarDto[]>('/contas-pagar', { params })
      .then((r) => r.data);
  },

  baixarContaPagar(id: string, payload: BaixarContaPagarPayload): Promise<ContaPagarDto> {
    return api
      .post<ContaPagarDto>(`/contas-pagar/${id}/baixar`, payload)
      .then((r) => r.data);
  },

  cancelarContaPagar(id: string): Promise<ContaPagarDto> {
    return api
      .post<ContaPagarDto>(`/contas-pagar/${id}/cancelar`)
      .then((r) => r.data);
  },

  listarFormasPagamentoConfig(): Promise<ConfigFormaPagamentoDto[]> {
    return api
      .get<ConfigFormaPagamentoDto[]>('/formas-pagamento-config')
      .then((r) => r.data);
  },

  obterFormaPagamentoConfig(id: string): Promise<ConfigFormaPagamentoDto> {
    return api
      .get<ConfigFormaPagamentoDto>(`/formas-pagamento-config/${id}`)
      .then((r) => r.data);
  },

  criarFormaPagamentoConfig(
    payload: CriarConfigFormaPagamentoPayload,
  ): Promise<ConfigFormaPagamentoDto> {
    return api
      .post<ConfigFormaPagamentoDto>('/formas-pagamento-config', payload)
      .then((r) => r.data);
  },

  editarFormaPagamentoConfig(
    id: string,
    payload: EditarConfigFormaPagamentoPayload,
  ): Promise<ConfigFormaPagamentoDto> {
    return api
      .put<ConfigFormaPagamentoDto>(`/formas-pagamento-config/${id}`, payload)
      .then((r) => r.data);
  },

  inativarFormaPagamentoConfig(id: string, justificativa: string): Promise<void> {
    return api
      .patch(`/formas-pagamento-config/${id}/inativar`, { justificativa })
      .then(() => undefined);
  },

  ativarFormaPagamentoConfig(id: string): Promise<void> {
    return api.patch(`/formas-pagamento-config/${id}/ativar`).then(() => undefined);
  },

  upsertTaxaFormaPagamento(
    id: string,
    payload: UpsertTaxaFormaPagamentoPayload,
  ): Promise<ConfigFormaPagamentoDto> {
    return api
      .put<ConfigFormaPagamentoDto>(`/formas-pagamento-config/${id}/taxas`, payload)
      .then((r) => r.data);
  },
};
