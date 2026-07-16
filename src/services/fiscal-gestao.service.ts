import { api } from 'services/api';
import type {
  AtivarContingenciaPayload,
  CalcularFunruralPayload,
  CalcularImpostosPayload,
  CalculoImpostosDto,
  CancelarNotaFiscalPayload,
  CartaCorrecaoDto,
  CartaCorrecaoPayload,
  CfopOverrideLogDto,
  CfopOverridePayload,
  ConfigFunruralDto,
  ConfigFunruralPayload,
  ContingenciaStatusDto,
  CriarMvaNcmUfPayload,
  CriarNcmPisCofinsPayload,
  DanfeDto,
  EditarMvaNcmUfPayload,
  EditarNcmPisCofinsPayload,
  EmitirCtePayload,
  EmitirMdfePayload,
  EmitirNfprPayload,
  EnviarEscritorioFiscalPayload,
  EnvioEscritorioFiscalDto,
  FilaContingenciaDto,
  FunruralCalculoDto,
  GerarGnrePayload,
  GuiaGnreDto,
  InutilizacaoPayload,
  ListarNotasFiscaisParams,
  ListarSpedParams,
  ManifestacaoDestinatarioDto,
  ManifestarDestinatarioPayload,
  MvaNcmUfDto,
  NcmPisCofinsDto,
  NotaComplementarPayload,
  NotaFiscalGestaoDto,
  NumeracaoInutilizadaDto,
  RegimeTributarioCnpjDto,
  RegimeTributarioCnpjPayload,
  ReprocessarContingenciaDto,
  SpedLinhasDto,
  SugerirCompletoParams,
  SugestaoTributacaoCompletaDto,
  XmlNotaDto,
} from 'types/dtos/fiscal-gestao.dto';

export const fiscalGestaoService = {
  listarNotas(params?: ListarNotasFiscaisParams): Promise<NotaFiscalGestaoDto[]> {
    return api.get<NotaFiscalGestaoDto[]>('/notas-fiscais', { params }).then((r) => r.data);
  },

  obterNota(id: string): Promise<NotaFiscalGestaoDto> {
    return api.get<NotaFiscalGestaoDto>(`/notas-fiscais/${id}`).then((r) => r.data);
  },

  emitirNfe(pedidoId: string): Promise<NotaFiscalGestaoDto> {
    return api
      .post<NotaFiscalGestaoDto>(`/notas-fiscais/emitir-nfe/${pedidoId}`)
      .then((r) => r.data);
  },

  emitirNfce(pdvVendaId: string): Promise<NotaFiscalGestaoDto> {
    return api
      .post<NotaFiscalGestaoDto>(`/notas-fiscais/emitir-nfce/${pdvVendaId}`)
      .then((r) => r.data);
  },

  emitirCte(payload: EmitirCtePayload): Promise<NotaFiscalGestaoDto> {
    return api.post<NotaFiscalGestaoDto>('/notas-fiscais/emitir-cte', payload).then((r) => r.data);
  },

  emitirMdfe(payload: EmitirMdfePayload): Promise<NotaFiscalGestaoDto> {
    return api
      .post<NotaFiscalGestaoDto>('/notas-fiscais/emitir-mdfe', payload)
      .then((r) => r.data);
  },

  emitirNfpr(payload: EmitirNfprPayload): Promise<NotaFiscalGestaoDto> {
    return api
      .post<NotaFiscalGestaoDto>('/notas-fiscais/emitir-nfpr', payload)
      .then((r) => r.data);
  },

  emitirNfeDevolucao(devolucaoId: string): Promise<NotaFiscalGestaoDto> {
    return api
      .post<NotaFiscalGestaoDto>(`/notas-fiscais/nfe-devolucao/${devolucaoId}`)
      .then((r) => r.data);
  },

  cancelarNota(
    id: string,
    payload: CancelarNotaFiscalPayload,
  ): Promise<NotaFiscalGestaoDto> {
    return api
      .post<NotaFiscalGestaoDto>(`/notas-fiscais/${id}/cancelar`, payload)
      .then((r) => r.data);
  },

  registrarCce(id: string, payload: CartaCorrecaoPayload): Promise<CartaCorrecaoDto> {
    return api
      .post<CartaCorrecaoDto>(`/notas-fiscais/${id}/cce`, payload)
      .then((r) => r.data);
  },

  emitirComplementar(
    id: string,
    payload: NotaComplementarPayload,
  ): Promise<NotaFiscalGestaoDto> {
    return api
      .post<NotaFiscalGestaoDto>(`/notas-fiscais/${id}/complementar`, payload)
      .then((r) => r.data);
  },

  obterDanfe(id: string): Promise<DanfeDto> {
    return api.get<DanfeDto>(`/notas-fiscais/${id}/danfe`).then((r) => r.data);
  },

  obterXml(id: string): Promise<XmlNotaDto> {
    return api.get<XmlNotaDto>(`/notas-fiscais/${id}/xml`).then((r) => r.data);
  },

  sugerirCompleto(
    produtoId: string,
    params?: SugerirCompletoParams,
  ): Promise<SugestaoTributacaoCompletaDto> {
    return api
      .get<SugestaoTributacaoCompletaDto>(`/fiscal/sugerir-completo/${produtoId}`, { params })
      .then((r) => r.data);
  },

  cfopOverride(payload: CfopOverridePayload): Promise<CfopOverrideLogDto> {
    return api.post<CfopOverrideLogDto>('/fiscal/cfop-override', payload).then((r) => r.data);
  },

  statusContingencia(): Promise<ContingenciaStatusDto> {
    return api
      .get<ContingenciaStatusDto>('/fiscal/contingencia/status')
      .then((r) => r.data);
  },

  ativarContingencia(payload: AtivarContingenciaPayload): Promise<ContingenciaStatusDto> {
    return api
      .post<ContingenciaStatusDto>('/fiscal/contingencia/ativar', payload)
      .then((r) => r.data);
  },

  desativarContingencia(): Promise<ContingenciaStatusDto> {
    return api
      .post<ContingenciaStatusDto>('/fiscal/contingencia/desativar')
      .then((r) => r.data);
  },

  pendentesContingencia(): Promise<FilaContingenciaDto[]> {
    return api
      .get<FilaContingenciaDto[]>('/fiscal/contingencia/pendentes')
      .then((r) => r.data);
  },

  reprocessarContingencia(): Promise<ReprocessarContingenciaDto> {
    return api
      .post<ReprocessarContingenciaDto>('/fiscal/contingencia/reprocessar')
      .then((r) => r.data);
  },

  alertaContingencia168h(): Promise<NotaFiscalGestaoDto[]> {
    return api
      .get<NotaFiscalGestaoDto[]>('/fiscal/contingencia/alerta-168h')
      .then((r) => r.data);
  },

  listarInutilizacoes(): Promise<NumeracaoInutilizadaDto[]> {
    return api
      .get<NumeracaoInutilizadaDto[]>('/fiscal/inutilizacoes')
      .then((r) => r.data);
  },

  criarInutilizacao(payload: InutilizacaoPayload): Promise<NumeracaoInutilizadaDto> {
    return api
      .post<NumeracaoInutilizadaDto>('/fiscal/inutilizacoes', payload)
      .then((r) => r.data);
  },

  listarNcmPisCofins(): Promise<NcmPisCofinsDto[]> {
    return api.get<NcmPisCofinsDto[]>('/fiscal/ncm-pis-cofins').then((r) => r.data);
  },

  criarNcmPisCofins(payload: CriarNcmPisCofinsPayload): Promise<NcmPisCofinsDto> {
    return api.post<NcmPisCofinsDto>('/fiscal/ncm-pis-cofins', payload).then((r) => r.data);
  },

  editarNcmPisCofins(id: string, payload: EditarNcmPisCofinsPayload): Promise<NcmPisCofinsDto> {
    return api
      .put<NcmPisCofinsDto>(`/fiscal/ncm-pis-cofins/${id}`, payload)
      .then((r) => r.data);
  },

  listarMvaNcmUf(): Promise<MvaNcmUfDto[]> {
    return api.get<MvaNcmUfDto[]>('/fiscal/mva-ncm-uf').then((r) => r.data);
  },

  criarMvaNcmUf(payload: CriarMvaNcmUfPayload): Promise<MvaNcmUfDto> {
    return api.post<MvaNcmUfDto>('/fiscal/mva-ncm-uf', payload).then((r) => r.data);
  },

  editarMvaNcmUf(id: string, payload: EditarMvaNcmUfPayload): Promise<MvaNcmUfDto> {
    return api.put<MvaNcmUfDto>(`/fiscal/mva-ncm-uf/${id}`, payload).then((r) => r.data);
  },

  calcularImpostos(payload: CalcularImpostosPayload): Promise<CalculoImpostosDto> {
    return api
      .post<CalculoImpostosDto>('/fiscal/calcular-impostos', payload)
      .then((r) => r.data);
  },

  listarGnre(): Promise<GuiaGnreDto[]> {
    return api.get<GuiaGnreDto[]>('/fiscal/gnre').then((r) => r.data);
  },

  gerarGnre(payload: GerarGnrePayload): Promise<GuiaGnreDto> {
    return api.post<GuiaGnreDto>('/fiscal/gnre/gerar', payload).then((r) => r.data);
  },

  obterFunrural(): Promise<ConfigFunruralDto> {
    return api.get<ConfigFunruralDto>('/fiscal/funrural/config').then((r) => r.data);
  },

  salvarFunrural(payload: ConfigFunruralPayload): Promise<ConfigFunruralDto> {
    return api
      .put<ConfigFunruralDto>('/fiscal/funrural/config', payload)
      .then((r) => r.data);
  },

  calcularFunrural(payload: CalcularFunruralPayload): Promise<FunruralCalculoDto> {
    return api
      .post<FunruralCalculoDto>('/fiscal/funrural/calcular', payload)
      .then((r) => r.data);
  },

  listarRegimesCnpj(): Promise<RegimeTributarioCnpjDto[]> {
    return api
      .get<RegimeTributarioCnpjDto[]>('/fiscal/regimes-cnpj')
      .then((r) => r.data);
  },

  criarRegimeCnpj(payload: RegimeTributarioCnpjPayload): Promise<RegimeTributarioCnpjDto> {
    return api
      .post<RegimeTributarioCnpjDto>('/fiscal/regimes-cnpj', payload)
      .then((r) => r.data);
  },

  editarRegimeCnpj(
    id: string,
    payload: RegimeTributarioCnpjPayload,
  ): Promise<RegimeTributarioCnpjDto> {
    return api
      .put<RegimeTributarioCnpjDto>(`/fiscal/regimes-cnpj/${id}`, payload)
      .then((r) => r.data);
  },

  spedEfdIcmsIpi(params: ListarSpedParams): Promise<SpedLinhasDto> {
    return api.get<SpedLinhasDto>('/fiscal/sped/efd-icms-ipi', { params }).then((r) => r.data);
  },

  spedEfdContribuicoes(params: ListarSpedParams): Promise<SpedLinhasDto> {
    return api
      .get<SpedLinhasDto>('/fiscal/sped/efd-contribuicoes', { params })
      .then((r) => r.data);
  },

  spedContabil(params: ListarSpedParams): Promise<SpedLinhasDto> {
    return api.get<SpedLinhasDto>('/fiscal/sped/contabil', { params }).then((r) => r.data);
  },

  enviarEscritorio(
    payload: EnviarEscritorioFiscalPayload,
  ): Promise<EnvioEscritorioFiscalDto> {
    return api
      .post<EnvioEscritorioFiscalDto>('/fiscal/sped/enviar-escritorio', payload)
      .then((r) => r.data);
  },

  manifestar(payload: ManifestarDestinatarioPayload): Promise<ManifestacaoDestinatarioDto> {
    return api
      .post<ManifestacaoDestinatarioDto>('/fiscal/sefaz/manifestar', payload)
      .then((r) => r.data);
  },
};
