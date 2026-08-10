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
      .get<PrecoResolvidoDto>('/precificacao/resolver', {
        params: montarParamsPrecificacao(params),
      })
      .then((r) => r.data);
  },

  listarTabelasPermitidas(
    params?: ListarTabelasPermitidasParams,
  ): Promise<TabelaPrecoPermitidaDto[]> {
    return api
      .get<TabelaPrecoPermitidaDto[]>('/tabelas-preco/permitidas', {
        params: montarParamsPermitidas(params),
      })
      .then((r) => r.data);
  },
};

function montarParamsPermitidas(
  params?: ListarTabelasPermitidasParams,
): Record<string, string> | undefined {
  if (!params) {
    return undefined;
  }

  const query: Record<string, string> = {};
  const clienteId = params.clienteId?.trim();
  const canal = params.canal?.trim();

  if (clienteId) {
    query.clienteId = clienteId;
  }

  if (canal) {
    query.canal = canal;
  }

  return Object.keys(query).length > 0 ? query : undefined;
}

function montarParamsPrecificacao(params: ResolverPrecoParams): Record<string, string> {
  const query: Record<string, string> = {
    produtoId: params.produtoId,
  };

  const clienteId = params.clienteId?.trim();
  const tabelaPrecoId = params.tabelaPrecoId?.trim();
  const canal = params.canal?.trim();

  if (clienteId) {
    query.clienteId = clienteId;
  }

  if (tabelaPrecoId) {
    query.tabelaPrecoId = tabelaPrecoId;
  }

  if (canal) {
    query.canal = canal;
  }

  return query;
}
