import { api } from 'services/api';
import type {
  AplicacaoInsumoDto,
  CriarAplicacaoInsumoPayload,
  CriarTalhaoPayload,
  EditarAplicacaoInsumoPayload,
  EditarTalhaoPayload,
  ListarAplicacoesParams,
  TalhaoDto,
} from 'types/dtos/rastreabilidade.dto';

export const rastreabilidadeService = {
  listarTalhoes(): Promise<TalhaoDto[]> {
    return api
      .get<TalhaoDto[]>('/rastreabilidade/talhoes')
      .then((r) => r.data);
  },

  obterTalhao(id: string): Promise<TalhaoDto> {
    return api
      .get<TalhaoDto>(`/rastreabilidade/talhoes/${id}`)
      .then((r) => r.data);
  },

  criarTalhao(payload: CriarTalhaoPayload): Promise<TalhaoDto> {
    return api
      .post<TalhaoDto>('/rastreabilidade/talhoes', payload)
      .then((r) => r.data);
  },

  editarTalhao(id: string, payload: EditarTalhaoPayload): Promise<TalhaoDto> {
    return api
      .put<TalhaoDto>(`/rastreabilidade/talhoes/${id}`, payload)
      .then((r) => r.data);
  },

  inativarTalhao(id: string): Promise<void> {
    return api
      .patch(`/rastreabilidade/talhoes/${id}/inativar`)
      .then(() => undefined);
  },

  listarAplicacoes(params?: ListarAplicacoesParams): Promise<AplicacaoInsumoDto[]> {
    return api
      .get<AplicacaoInsumoDto[]>('/rastreabilidade/aplicacoes', { params })
      .then((r) => r.data);
  },

  obterAplicacao(id: string): Promise<AplicacaoInsumoDto> {
    return api
      .get<AplicacaoInsumoDto>(`/rastreabilidade/aplicacoes/${id}`)
      .then((r) => r.data);
  },

  criarAplicacao(payload: CriarAplicacaoInsumoPayload): Promise<AplicacaoInsumoDto> {
    return api
      .post<AplicacaoInsumoDto>('/rastreabilidade/aplicacoes', payload)
      .then((r) => r.data);
  },

  editarAplicacao(
    id: string,
    payload: EditarAplicacaoInsumoPayload,
  ): Promise<AplicacaoInsumoDto> {
    return api
      .put<AplicacaoInsumoDto>(`/rastreabilidade/aplicacoes/${id}`, payload)
      .then((r) => r.data);
  },

  removerAplicacao(id: string): Promise<void> {
    return api.delete(`/rastreabilidade/aplicacoes/${id}`).then(() => undefined);
  },
};
