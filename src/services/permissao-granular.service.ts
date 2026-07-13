import { api } from 'services/api';
import type {
  PermissaoGranularDto,
  SalvarPermissaoGranularPayload,
} from 'types/dtos/permissao-granular.dto';

export const permissaoGranularService = {
  obter(usuarioId: string): Promise<PermissaoGranularDto> {
    return api
      .get<PermissaoGranularDto>(`/permissoes/${usuarioId}`)
      .then((r) => r.data);
  },

  salvar(
    usuarioId: string,
    payload: SalvarPermissaoGranularPayload,
  ): Promise<PermissaoGranularDto> {
    return api
      .put<PermissaoGranularDto>(`/permissoes/${usuarioId}`, payload)
      .then((r) => r.data);
  },
};
