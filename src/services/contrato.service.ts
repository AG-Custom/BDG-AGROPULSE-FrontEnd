import { api } from 'services/api';
import type { FontePrecoValor, TipoContratoValor } from 'constants/enums';
import type {
  ContratoDto,
  CotacaoMercadoDto,
  CriarContratoPayload,
  EditarContratoPayload,
  ListarCotacaoMercadoParams,
} from 'types/dtos/contrato.dto';

function basePath(tipo: TipoContratoValor): string {
  return `/contratos/${tipo}`;
}

export const contratoService = {
  listar(tipo: TipoContratoValor): Promise<ContratoDto[]> {
    return api.get<ContratoDto[]>(basePath(tipo)).then((r) => r.data);
  },

  obter(tipo: TipoContratoValor, id: string): Promise<ContratoDto> {
    return api.get<ContratoDto>(`${basePath(tipo)}/${id}`).then((r) => r.data);
  },

  criar(tipo: TipoContratoValor, payload: CriarContratoPayload): Promise<ContratoDto> {
    return api.post<ContratoDto>(basePath(tipo), payload).then((r) => r.data);
  },

  editar(
    tipo: TipoContratoValor,
    id: string,
    payload: EditarContratoPayload,
  ): Promise<ContratoDto> {
    return api
      .put<ContratoDto>(`${basePath(tipo)}/${id}`, payload)
      .then((r) => r.data);
  },

  liquidar(tipo: TipoContratoValor, id: string): Promise<ContratoDto> {
    return api
      .post<ContratoDto>(`${basePath(tipo)}/${id}/liquidar`)
      .then((r) => r.data);
  },

  entregar(tipo: TipoContratoValor, id: string): Promise<ContratoDto> {
    return api
      .post<ContratoDto>(`${basePath(tipo)}/${id}/entregar`)
      .then((r) => r.data);
  },

  cancelar(tipo: TipoContratoValor, id: string): Promise<void> {
    return api.post(`${basePath(tipo)}/${id}/cancelar`).then(() => undefined);
  },

  cotacaoMercado(
    produto?: string,
    fonte?: FontePrecoValor,
  ): Promise<CotacaoMercadoDto> {
    const params: ListarCotacaoMercadoParams = {};
    if (produto !== undefined) params.produto = produto;
    if (fonte !== undefined) params.fonte = fonte;
    return api
      .get<CotacaoMercadoDto>('/contratos/cotacao-mercado', { params })
      .then((r) => r.data);
  },
};
