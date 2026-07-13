import { api } from 'services/api';
import type {
  BeneficiamentoLoteDto,
  ConcluirOrdemProducaoPayload,
  CriarBeneficiamentoLotePayload,
  CriarOrdemProducaoPayload,
  EditarBeneficiamentoLotePayload,
  EditarOrdemProducaoPayload,
  OrdemProducaoDto,
} from 'types/dtos/producao.dto';

export const producaoService = {
  listarOrdens(): Promise<OrdemProducaoDto[]> {
    return api.get<OrdemProducaoDto[]>('/producao/ordens').then((r) => r.data);
  },

  obterOrdem(id: string): Promise<OrdemProducaoDto> {
    return api.get<OrdemProducaoDto>(`/producao/ordens/${id}`).then((r) => r.data);
  },

  criarOrdem(payload: CriarOrdemProducaoPayload): Promise<OrdemProducaoDto> {
    return api
      .post<OrdemProducaoDto>('/producao/ordens', payload)
      .then((r) => r.data);
  },

  editarOrdem(id: string, payload: EditarOrdemProducaoPayload): Promise<OrdemProducaoDto> {
    return api
      .put<OrdemProducaoDto>(`/producao/ordens/${id}`, payload)
      .then((r) => r.data);
  },

  iniciarOrdem(id: string): Promise<OrdemProducaoDto> {
    return api
      .post<OrdemProducaoDto>(`/producao/ordens/${id}/iniciar`)
      .then((r) => r.data);
  },

  concluirOrdem(
    id: string,
    payload: ConcluirOrdemProducaoPayload,
  ): Promise<OrdemProducaoDto> {
    return api
      .post<OrdemProducaoDto>(`/producao/ordens/${id}/concluir`, payload)
      .then((r) => r.data);
  },

  cancelarOrdem(id: string): Promise<void> {
    return api.post(`/producao/ordens/${id}/cancelar`).then(() => undefined);
  },

  listarBeneficiamentos(): Promise<BeneficiamentoLoteDto[]> {
    return api
      .get<BeneficiamentoLoteDto[]>('/producao/beneficiamentos')
      .then((r) => r.data);
  },

  obterBeneficiamento(id: string): Promise<BeneficiamentoLoteDto> {
    return api
      .get<BeneficiamentoLoteDto>(`/producao/beneficiamentos/${id}`)
      .then((r) => r.data);
  },

  criarBeneficiamento(
    payload: CriarBeneficiamentoLotePayload,
  ): Promise<BeneficiamentoLoteDto> {
    return api
      .post<BeneficiamentoLoteDto>('/producao/beneficiamentos', payload)
      .then((r) => r.data);
  },

  editarBeneficiamento(
    id: string,
    payload: EditarBeneficiamentoLotePayload,
  ): Promise<BeneficiamentoLoteDto> {
    return api
      .put<BeneficiamentoLoteDto>(`/producao/beneficiamentos/${id}`, payload)
      .then((r) => r.data);
  },

  removerBeneficiamento(id: string): Promise<void> {
    return api.delete(`/producao/beneficiamentos/${id}`).then(() => undefined);
  },
};
