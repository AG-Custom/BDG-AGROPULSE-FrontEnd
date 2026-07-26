import { api } from 'services/api';

import type {
  CriarUnidadePayload,
  EditarUnidadePayload,
  ListarUnidadesParams,
  UnidadeDto,
} from 'types/dtos/unidade.dto';

export const unidadeService = {
  listar(params?: ListarUnidadesParams): Promise<UnidadeDto[]> {
    return api.get<UnidadeDto[]>('/empresas/unidades', { params }).then((r) => r.data);
  },

  obter(unidadeId: string): Promise<UnidadeDto> {
    return api.get<UnidadeDto>(`/empresas/unidades/${unidadeId}`).then((r) => r.data);
  },

  criar(payload: CriarUnidadePayload): Promise<UnidadeDto> {
    return api.post<UnidadeDto>('/empresas/unidades', payload).then((r) => r.data);
  },

  editar(unidadeId: string, payload: EditarUnidadePayload): Promise<UnidadeDto> {
    return api.put<UnidadeDto>(`/empresas/unidades/${unidadeId}`, payload).then((r) => r.data);
  },

  inativar(unidadeId: string, justificativa: string): Promise<void> {
    return api.post(`/empresas/unidades/${unidadeId}/inativar`, { justificativa });
  },

  ativar(unidadeId: string): Promise<void> {
    return api.post(`/empresas/unidades/${unidadeId}/ativar`);
  },
};
