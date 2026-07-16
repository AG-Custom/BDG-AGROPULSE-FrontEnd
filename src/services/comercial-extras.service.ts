import { api } from 'services/api';
import type {
  ListarMetasVendedorParams,
  ListarRepresentantesParams,
  MetaVendedorDto,
  RepresentanteDto,
} from 'types/dtos/comercial-extras.dto';

export const metaVendedorService = {
  listar(params?: ListarMetasVendedorParams): Promise<MetaVendedorDto[]> {
    return api.get<MetaVendedorDto[]>('/metas-vendedor', { params }).then((r) => r.data);
  },
};

export const representanteService = {
  listar(params?: ListarRepresentantesParams): Promise<RepresentanteDto[]> {
    return api.get<RepresentanteDto[]>('/representantes', { params }).then((r) => r.data);
  },
};
