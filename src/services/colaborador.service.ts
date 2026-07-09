import { api } from 'services/api';

import type {
  ColaboradorDto,
  ColaboradorResumoDto,
  ListarColaboradoresParams,
  SalvarColaboradorPayload,
} from 'types/dtos/colaborador.dto';

export const colaboradorService = {
  listar(params?: ListarColaboradoresParams): Promise<ColaboradorResumoDto[]> {
    return api.get<ColaboradorResumoDto[]>('/colaboradores', { params }).then((r) => r.data);
  },

  obter(colaboradorId: string): Promise<ColaboradorDto> {
    return api.get<ColaboradorDto>(`/colaboradores/${colaboradorId}`).then((r) => r.data);
  },

  criar(payload: SalvarColaboradorPayload): Promise<ColaboradorDto> {
    return api.post<ColaboradorDto>('/colaboradores', payload).then((r) => r.data);
  },

  editar(colaboradorId: string, payload: SalvarColaboradorPayload): Promise<ColaboradorDto> {
    return api.put<ColaboradorDto>(`/colaboradores/${colaboradorId}`, payload).then((r) => r.data);
  },

  inativar(colaboradorId: string): Promise<void> {
    return api.patch(`/colaboradores/${colaboradorId}/inativar`);
  },
};
