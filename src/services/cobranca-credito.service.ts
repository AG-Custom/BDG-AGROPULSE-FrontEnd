import { api } from 'services/api';
import type {
  AcordoJudicialDto,
  AgingCarteiraDto,
  AplicarLimitePayload,
  AplicarLimiteResponseDto,
  BureauConsultaDto,
  BureauConsultaPayload,
  CarteiraCreditoDto,
  CobrancaCreditoConfigDto,
  CobrancaCreditoConfigPayload,
  ConcentracaoItemDto,
  CriarAcordoJudicialPayload,
  CriarDisputaTituloPayload,
  CriarEncaminhamentoJuridicoPayload,
  CriarFichaCreditoRuralPayload,
  CriarGarantiaCreditoPayload,
  CriarTentativaCobrancaPayload,
  DisputaTituloDto,
  EditarFichaCreditoRuralPayload,
  EncaminhamentoJuridicoAnexoDto,
  EncaminhamentoJuridicoDto,
  FichaCreditoRuralDto,
  GarantiaCreditoDto,
  InadimplenciaIndiceDto,
  ListaDiariaItemDto,
  PddCarteiraDto,
  ResolverDisputaPayload,
  RevisaoLimiteItemDto,
  TentativaCobrancaDto,
} from 'types/dtos/cobranca-credito.dto';

const BASE = '/cobranca-credito';

export const cobrancaCreditoService = {
  obterConfig(): Promise<CobrancaCreditoConfigDto> {
    return api.get<CobrancaCreditoConfigDto>(`${BASE}/config`).then((r) => r.data);
  },

  salvarConfig(payload: CobrancaCreditoConfigPayload): Promise<CobrancaCreditoConfigDto> {
    return api.put<CobrancaCreditoConfigDto>(`${BASE}/config`, payload).then((r) => r.data);
  },

  obterCarteira(): Promise<CarteiraCreditoDto> {
    return api.get<CarteiraCreditoDto>(`${BASE}/carteira`).then((r) => r.data);
  },

  obterAging(): Promise<AgingCarteiraDto> {
    return api.get<AgingCarteiraDto>(`${BASE}/aging`).then((r) => r.data);
  },

  obterConcentracao(): Promise<ConcentracaoItemDto[]> {
    return api.get<ConcentracaoItemDto[]>(`${BASE}/concentracao`).then((r) => r.data);
  },

  obterInadimplenciaIndice(): Promise<InadimplenciaIndiceDto> {
    return api
      .get<InadimplenciaIndiceDto>(`${BASE}/inadimplencia-indice`)
      .then((r) => r.data);
  },

  gerarSnapshot(): Promise<InadimplenciaIndiceDto> {
    return api
      .post<InadimplenciaIndiceDto>(`${BASE}/snapshots/gerar`, {})
      .then((r) => r.data);
  },

  obterPdd(): Promise<PddCarteiraDto> {
    return api.get<PddCarteiraDto>(`${BASE}/pdd`).then((r) => r.data);
  },

  listarFichas(clienteId?: string): Promise<FichaCreditoRuralDto[]> {
    return api
      .get<FichaCreditoRuralDto[]>(`${BASE}/fichas`, {
        params: clienteId ? { clienteId } : undefined,
      })
      .then((r) => r.data);
  },

  obterFicha(id: string): Promise<FichaCreditoRuralDto> {
    return api.get<FichaCreditoRuralDto>(`${BASE}/fichas/${id}`).then((r) => r.data);
  },

  criarFicha(payload: CriarFichaCreditoRuralPayload): Promise<FichaCreditoRuralDto> {
    return api.post<FichaCreditoRuralDto>(`${BASE}/fichas`, payload).then((r) => r.data);
  },

  editarFicha(
    id: string,
    payload: EditarFichaCreditoRuralPayload,
  ): Promise<FichaCreditoRuralDto> {
    return api.put<FichaCreditoRuralDto>(`${BASE}/fichas/${id}`, payload).then((r) => r.data);
  },

  removerFicha(id: string): Promise<void> {
    return api.delete(`${BASE}/fichas/${id}`).then(() => undefined);
  },

  aplicarLimite(
    analiseId: string,
    payload: AplicarLimitePayload,
  ): Promise<AplicarLimiteResponseDto> {
    return api
      .post<AplicarLimiteResponseDto>(`${BASE}/analises/${analiseId}/aplicar-limite`, payload)
      .then((r) => r.data);
  },

  consultarBureau(payload: BureauConsultaPayload): Promise<BureauConsultaDto> {
    return api
      .post<BureauConsultaDto>(`${BASE}/bureau/consultar`, payload)
      .then((r) => r.data);
  },

  revisarLimites(): Promise<RevisaoLimiteItemDto[]> {
    return api
      .post<RevisaoLimiteItemDto[]>(`${BASE}/revisar-limites`, {})
      .then((r) => r.data);
  },

  listaDiaria(): Promise<ListaDiariaItemDto[]> {
    return api.get<ListaDiariaItemDto[]>(`${BASE}/lista-diaria`).then((r) => r.data);
  },

  listarTentativas(clienteId?: string): Promise<TentativaCobrancaDto[]> {
    return api
      .get<TentativaCobrancaDto[]>(`${BASE}/tentativas`, {
        params: clienteId ? { clienteId } : undefined,
      })
      .then((r) => r.data);
  },

  criarTentativa(payload: CriarTentativaCobrancaPayload): Promise<TentativaCobrancaDto> {
    return api
      .post<TentativaCobrancaDto>(`${BASE}/tentativas`, payload)
      .then((r) => r.data);
  },

  listarDisputas(): Promise<DisputaTituloDto[]> {
    return api.get<DisputaTituloDto[]>(`${BASE}/disputas`).then((r) => r.data);
  },

  criarDisputa(payload: CriarDisputaTituloPayload): Promise<DisputaTituloDto> {
    return api.post<DisputaTituloDto>(`${BASE}/disputas`, payload).then((r) => r.data);
  },

  resolverDisputa(id: string, payload: ResolverDisputaPayload): Promise<DisputaTituloDto> {
    return api
      .post<DisputaTituloDto>(`${BASE}/disputas/${id}/resolver`, payload)
      .then((r) => r.data);
  },

  listarEncaminhamentos(): Promise<EncaminhamentoJuridicoDto[]> {
    return api.get<EncaminhamentoJuridicoDto[]>(`${BASE}/juridico`).then((r) => r.data);
  },

  criarEncaminhamento(
    payload: CriarEncaminhamentoJuridicoPayload,
  ): Promise<EncaminhamentoJuridicoDto> {
    return api
      .post<EncaminhamentoJuridicoDto>(`${BASE}/juridico`, payload)
      .then((r) => r.data);
  },

  encaminharJuridico(id: string): Promise<EncaminhamentoJuridicoDto> {
    return api
      .post<EncaminhamentoJuridicoDto>(`${BASE}/juridico/${id}/encaminhar`, {})
      .then((r) => r.data);
  },

  baixarPacoteJuridico(id: string): Promise<Blob> {
    return api
      .get<Blob>(`${BASE}/juridico/${id}/pacote`, { responseType: 'blob' })
      .then((r) => r.data);
  },

  listarAnexosJuridico(id: string): Promise<EncaminhamentoJuridicoAnexoDto[]> {
    return api
      .get<EncaminhamentoJuridicoAnexoDto[]>(`${BASE}/juridico/${id}/anexos`)
      .then((r) => r.data);
  },

  adicionarAnexoJuridico(id: string, arquivo: File): Promise<EncaminhamentoJuridicoAnexoDto> {
    const formData = new FormData();
    formData.append('arquivo', arquivo);

    return api
      .post<EncaminhamentoJuridicoAnexoDto>(`${BASE}/juridico/${id}/anexos`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },

  removerAnexoJuridico(id: string, anexoId: string): Promise<void> {
    return api.delete(`${BASE}/juridico/${id}/anexos/${anexoId}`);
  },

  listarAcordos(): Promise<AcordoJudicialDto[]> {
    return api.get<AcordoJudicialDto[]>(`${BASE}/acordos-judiciais`).then((r) => r.data);
  },

  criarAcordo(payload: CriarAcordoJudicialPayload): Promise<AcordoJudicialDto> {
    return api
      .post<AcordoJudicialDto>(`${BASE}/acordos-judiciais`, payload)
      .then((r) => r.data);
  },

  listarGarantias(clienteId?: string): Promise<GarantiaCreditoDto[]> {
    return api
      .get<GarantiaCreditoDto[]>(`${BASE}/garantias`, {
        params: clienteId ? { clienteId } : undefined,
      })
      .then((r) => r.data);
  },

  criarGarantia(payload: CriarGarantiaCreditoPayload): Promise<GarantiaCreditoDto> {
    return api.post<GarantiaCreditoDto>(`${BASE}/garantias`, payload).then((r) => r.data);
  },

  removerGarantia(id: string): Promise<void> {
    return api.delete(`${BASE}/garantias/${id}`).then(() => undefined);
  },
};
