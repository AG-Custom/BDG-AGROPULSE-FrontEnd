import { api } from 'services/api';
import type {
  CondicaoPagamentoDto,
  ConfigFormaPagamentoDto,
  ContaPagarDto,
  ContaReceberDto,
  CriarConfigFormaPagamentoPayload,
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

  listarContasReceber(params?: ListarContasReceberParams): Promise<ContaReceberDto[]> {
    return api
      .get<ContaReceberDto[]>('/contas-receber', { params })
      .then((r) => r.data);
  },

  listarContasPagar(params?: ListarContasPagarParams): Promise<ContaPagarDto[]> {
    return api
      .get<ContaPagarDto[]>('/contas-pagar', { params })
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

  inativarFormaPagamentoConfig(id: string): Promise<void> {
    return api
      .patch(`/formas-pagamento-config/${id}/inativar`)
      .then(() => undefined);
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
