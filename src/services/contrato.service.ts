import { api } from 'services/api';
import type { FontePrecoValor, TipoContratoValor } from 'constants/enums';
import type {
  AlertaContratoDto,
  ContratoDto,
  CotacaoMercadoDto,
  CriarContratoPayload,
  EditarContratoPayload,
  EntregaContratoDto,
  EntregaPayload,
  ListarContratosParams,
  ListarCotacaoMercadoParams,
  LiquidarContratoPayload,
  PainelContratoItemDto,
  PainelSafraItemDto,
  VinculoPedidoContratoDto,
} from 'types/dtos/contrato.dto';

function basePath(tipo: TipoContratoValor): string {
  return `/contratos/${tipo}`;
}

export const contratoService = {
  listar(tipo: TipoContratoValor, params?: ListarContratosParams): Promise<ContratoDto[]> {
    const query: Record<string, string> = {};
    if (params?.status) query.status = params.status;
    if (params?.safraId) query.safraId = params.safraId;
    return api.get<ContratoDto[]>(basePath(tipo), { params: query }).then((r) => r.data);
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

  liquidar(
    tipo: TipoContratoValor,
    id: string,
    payload?: LiquidarContratoPayload,
  ): Promise<ContratoDto> {
    return api
      .post<ContratoDto>(`${basePath(tipo)}/${id}/liquidar`, payload ?? {})
      .then((r) => r.data);
  },

  entregar(tipo: TipoContratoValor, id: string): Promise<ContratoDto> {
    return api
      .post<ContratoDto>(`${basePath(tipo)}/${id}/entregar`)
      .then((r) => r.data);
  },

  criarEntrega(
    tipo: TipoContratoValor,
    id: string,
    payload: EntregaPayload,
  ): Promise<EntregaContratoDto> {
    return api
      .post<EntregaContratoDto>(`${basePath(tipo)}/${id}/entregas`, payload)
      .then((r) => r.data);
  },

  cancelar(tipo: TipoContratoValor, id: string): Promise<void> {
    return api.post(`${basePath(tipo)}/${id}/cancelar`).then(() => undefined);
  },

  vinculos(tipo: TipoContratoValor, id: string): Promise<VinculoPedidoContratoDto[]> {
    return api
      .get<VinculoPedidoContratoDto[]>(`/contratos/${tipo}/vinculos-pedido/${id}`)
      .then((r) => r.data);
  },

  listarEntregas(tipo: TipoContratoValor, id: string): Promise<EntregaContratoDto[]> {
    return api
      .get<EntregaContratoDto[]>(`/contratos/${tipo}/entregas/${id}`)
      .then((r) => r.data);
  },

  calcularEquivalente(id: string): Promise<ContratoDto> {
    return api
      .post<ContratoDto>(`/contratos/barter/${id}/calcular-equivalente`)
      .then((r) => r.data);
  },

  painel(params?: { tipo?: string; status?: string; safraId?: string }): Promise<PainelContratoItemDto[]> {
    return api
      .get<PainelContratoItemDto[]>('/contratos/painel', { params })
      .then((r) => r.data);
  },

  alertas(): Promise<AlertaContratoDto[]> {
    return api.get<AlertaContratoDto[]>('/contratos/alertas').then((r) => r.data);
  },

  painelSafra(): Promise<PainelSafraItemDto[]> {
    return api.get<PainelSafraItemDto[]>('/contratos/painel-safra').then((r) => r.data);
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

  listarCotacoesMercado(fonte?: FontePrecoValor): Promise<CotacaoMercadoDto[]> {
    const params: ListarCotacaoMercadoParams = {};
    if (fonte !== undefined) params.fonte = fonte;
    return api
      .get<CotacaoMercadoDto[]>('/contratos/cotacao-mercado/lista', { params })
      .then((r) => r.data);
  },
};
