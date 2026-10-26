import { api } from 'services/api';
import type {
  ContaContabilDto,
  CriarContaContabilPayload,
  EditarContaContabilPayload,
} from 'types/dtos/plano-contas.dto';

export const planoContasService = {
  listar(): Promise<ContaContabilDto[]> {
    return api.get<ContaContabilDto[]>('/fiscal/plano-contas').then((r) => r.data);
  },

  criar(payload: CriarContaContabilPayload): Promise<ContaContabilDto> {
    return api.post<ContaContabilDto>('/fiscal/plano-contas', payload).then((r) => r.data);
  },

  editar(id: string, payload: EditarContaContabilPayload): Promise<ContaContabilDto> {
    return api.put<ContaContabilDto>(`/fiscal/plano-contas/${id}`, payload).then((r) => r.data);
  },

  inativar(id: string): Promise<void> {
    return api.patch(`/fiscal/plano-contas/${id}/inativar`).then(() => undefined);
  },

  ativar(id: string): Promise<void> {
    return api.patch(`/fiscal/plano-contas/${id}/ativar`).then(() => undefined);
  },
};
