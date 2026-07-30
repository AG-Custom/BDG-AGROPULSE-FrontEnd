import { api } from 'services/api';
import type {
  ListarAuditoriaParams,
  LogAuditoriaDto,
} from 'types/dtos/auditoria.dto';

export const auditoriaService = {
  listar(params?: ListarAuditoriaParams): Promise<LogAuditoriaDto[]> {
    return api
      .get<LogAuditoriaDto[]>('/auditoria', { params })
      .then((r) => r.data);
  },
};
