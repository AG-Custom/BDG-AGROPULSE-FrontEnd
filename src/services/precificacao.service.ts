import { api } from 'services/api';
import type {
  ListarTabelasPermitidasParams,
  PrecoResolvidoDto,
  ResolverPrecoParams,
  TabelaPrecoPermitidaDto,
} from 'types/dtos/precificacao.dto';

export const precificacaoService = {
  resolver(params: ResolverPrecoParams): Promise<PrecoResolvidoDto> {
    return api
      .get<PrecoResolvidoDto>('/precificacao/resolver', { params })
      .then((r) => r.data);
  },

  listarTabelasPermitidas(
    params?: ListarTabelasPermitidasParams,
  ): Promise<TabelaPrecoPermitidaDto[]> {
    return api
      .get<TabelaPrecoPermitidaDto[]>('/tabelas-preco/permitidas', { params })
      .then((r) => r.data);
  },
};
