import { api } from 'services/api';

import type {
  GalpaoDto,
  GalpaoResumoDto,
  ListarGalpoesParams,
  SalvarGalpaoPayload,
} from 'types/dtos/galpao.dto';

export const galpaoService = {
  listar(params?: ListarGalpoesParams): Promise<GalpaoResumoDto[]> {
    return api.get<GalpaoResumoDto[]>('/galpoes', { params }).then((r) => r.data);
  },

  obter(galpaoId: string): Promise<GalpaoDto> {
    return api.get<GalpaoDto>(`/galpoes/${galpaoId}`).then((r) => r.data);
  },

  criar(payload: SalvarGalpaoPayload): Promise<GalpaoDto> {
    return api.post<GalpaoDto>('/galpoes', payload).then((r) => r.data);
  },

  editar(galpaoId: string, payload: SalvarGalpaoPayload): Promise<GalpaoDto> {
    return api.put<GalpaoDto>(`/galpoes/${galpaoId}`, payload).then((r) => r.data);
  },

  inativar(galpaoId: string, justificativa: string): Promise<void> {
    return api.patch(`/galpoes/${galpaoId}/inativar`, { justificativa });
  },

  ativar(galpaoId: string): Promise<void> {
    return api.patch(`/galpoes/${galpaoId}/ativar`);
  },
};
