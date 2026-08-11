import { api } from 'services/api';
import type {
  ListaAuditoriaPaginadaDto,
  ListarAuditoriaParams,
} from 'types/dtos/auditoria.dto';

export const auditoriaService = {
  listar(params?: ListarAuditoriaParams): Promise<ListaAuditoriaPaginadaDto> {
    return api
      .get<ListaAuditoriaPaginadaDto>('/auditoria', { params })
      .then((r) => r.data);
  },
};
