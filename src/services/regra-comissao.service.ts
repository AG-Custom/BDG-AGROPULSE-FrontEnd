import { api } from 'services/api';
import type {
  CriarRegraComissaoPayload,
  EditarRegraComissaoPayload,
  ListarRegrasComissaoParams,
  RegraComissaoDto,
} from 'types/dtos/regra-comissao.dto';

export const regraComissaoService = {
  listar(params?: ListarRegrasComissaoParams): Promise<RegraComissaoDto[]> {
    return api.get<RegraComissaoDto[]>('/regras-comissao', { params }).then((r) => r.data);
  },

  obter(id: string): Promise<RegraComissaoDto> {
    return api.get<RegraComissaoDto>(`/regras-comissao/${id}`).then((r) => r.data);
  },

  criar(payload: CriarRegraComissaoPayload): Promise<RegraComissaoDto> {
    return api.post<RegraComissaoDto>('/regras-comissao', payload).then((r) => r.data);
  },

  editar(id: string, payload: EditarRegraComissaoPayload): Promise<RegraComissaoDto> {
    return api.put<RegraComissaoDto>(`/regras-comissao/${id}`, payload).then((r) => r.data);
  },

  excluir(id: string): Promise<void> {
    return api.delete(`/regras-comissao/${id}`).then(() => undefined);
  },
};
