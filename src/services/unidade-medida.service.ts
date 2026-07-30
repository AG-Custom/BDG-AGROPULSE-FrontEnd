import { api } from 'services/api';

import type {
  ListarUnidadesMedidaParams,
  SalvarUnidadeMedidaPayload,
  UnidadeMedidaDto,
  UnidadeMedidaResumoDto,
} from 'types/dtos/unidade-medida.dto';

export const unidadeMedidaService = {
  listar(params?: ListarUnidadesMedidaParams): Promise<UnidadeMedidaResumoDto[]> {
    return api.get<UnidadeMedidaResumoDto[]>('/unidades-medida', { params }).then((r) => r.data);
  },

  obter(unidadeMedidaId: string): Promise<UnidadeMedidaDto> {
    return api.get<UnidadeMedidaDto>(`/unidades-medida/${unidadeMedidaId}`).then((r) => r.data);
  },

  criar(payload: SalvarUnidadeMedidaPayload): Promise<UnidadeMedidaDto> {
    return api.post<UnidadeMedidaDto>('/unidades-medida', payload).then((r) => r.data);
  },

  editar(unidadeMedidaId: string, payload: SalvarUnidadeMedidaPayload): Promise<UnidadeMedidaDto> {
    return api
      .put<UnidadeMedidaDto>(`/unidades-medida/${unidadeMedidaId}`, payload)
      .then((r) => r.data);
  },

  inativar(unidadeMedidaId: string, justificativa: string): Promise<void> {
    return api.patch(`/unidades-medida/${unidadeMedidaId}/inativar`, { justificativa });
  },

  ativar(unidadeMedidaId: string): Promise<void> {
    return api.patch(`/unidades-medida/${unidadeMedidaId}/ativar`);
  },
};
