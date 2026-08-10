import { api } from 'services/api';
import type {
  ListarMetasVendedorParams,
  ListarRepresentantesParams,
  MetaVendedorDto,
  MetaVendedorPayload,
  RepresentanteDto,
} from 'types/dtos/comercial-extras.dto';

export const metaVendedorService = {
  listar(params?: ListarMetasVendedorParams): Promise<MetaVendedorDto[]> {
    return api.get<MetaVendedorDto[]>('/metas-vendedor', { params }).then((r) => r.data);
  },

  obter(id: string): Promise<MetaVendedorDto> {
    return api.get<MetaVendedorDto>(`/metas-vendedor/${id}`).then((r) => r.data);
  },

  criar(payload: MetaVendedorPayload): Promise<MetaVendedorDto> {
    return api.post<MetaVendedorDto>('/metas-vendedor', payload).then((r) => r.data);
  },

  editar(id: string, payload: MetaVendedorPayload): Promise<MetaVendedorDto> {
    return api.put<MetaVendedorDto>(`/metas-vendedor/${id}`, payload).then((r) => r.data);
  },

  excluir(id: string): Promise<void> {
    return api.delete(`/metas-vendedor/${id}`).then(() => undefined);
  },
};

export const representanteService = {
  listar(params?: ListarRepresentantesParams): Promise<RepresentanteDto[]> {
    return api.get<RepresentanteDto[]>('/representantes', { params }).then((r) => r.data);
  },
};
