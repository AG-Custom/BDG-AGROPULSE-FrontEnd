import { api } from 'services/api';
import type {
  CheckInVisitaTecnicaPayload,
  CriarCusteioSafraPayload,
  CriarDiarioCampoPayload,
  CriarFazendaPayload,
  CriarGlebaPayload,
  CriarOrdemServicoAgricolaPayload,
  CriarRecomendacaoPayload,
  CriarSafraPayload,
  CriarVisitaTecnicaPayload,
  CusteioResumoDto,
  CusteioSafraDto,
  DiarioCampoDto,
  DiarioCampoSyncItem,
  EditarFazendaPayload,
  EditarGlebaPayload,
  EditarOrdemServicoAgricolaPayload,
  EditarRecomendacaoPayload,
  EditarSafraPayload,
  EditarVisitaTecnicaPayload,
  EncerrarSafraPayload,
  FazendaDto,
  GlebaDto,
  HistoricoAplicacaoItemDto,
  HistoricoProdutividadeDto,
  ImportarGeoPayload,
  ListarCusteiosParams,
  ListarGlebasParams,
  ListarHistoricoAplicacoesParams,
  ListarHistoricoProdutividadeParams,
  OeeCampoDto,
  OrdemServicoAgricolaDto,
  PerfilSafrasDto,
  ProdutividadeSafraDto,
  RecomendacaoDto,
  SafraDto,
  VisitaTecnicaDto,
  VisitaTecnicaFotoDto,
} from 'types/dtos/safras.dto';

export const safrasService = {
  listarFazendas(): Promise<FazendaDto[]> {
    return api.get<FazendaDto[]>('/safras/fazendas').then((r) => r.data);
  },

  obterFazenda(id: string): Promise<FazendaDto> {
    return api.get<FazendaDto>(`/safras/fazendas/${id}`).then((r) => r.data);
  },

  criarFazenda(payload: CriarFazendaPayload): Promise<FazendaDto> {
    return api.post<FazendaDto>('/safras/fazendas', payload).then((r) => r.data);
  },

  editarFazenda(id: string, payload: EditarFazendaPayload): Promise<FazendaDto> {
    return api.put<FazendaDto>(`/safras/fazendas/${id}`, payload).then((r) => r.data);
  },

  inativarFazenda(id: string): Promise<void> {
    return api.patch(`/safras/fazendas/${id}/inativar`).then(() => undefined);
  },

  listarGlebas(params?: ListarGlebasParams): Promise<GlebaDto[]> {
    return api.get<GlebaDto[]>('/safras/glebas', { params }).then((r) => r.data);
  },

  criarGleba(payload: CriarGlebaPayload): Promise<GlebaDto> {
    return api.post<GlebaDto>('/safras/glebas', payload).then((r) => r.data);
  },

  editarGleba(id: string, payload: EditarGlebaPayload): Promise<GlebaDto> {
    return api.put<GlebaDto>(`/safras/glebas/${id}`, payload).then((r) => r.data);
  },

  inativarGleba(id: string): Promise<void> {
    return api.patch(`/safras/glebas/${id}/inativar`).then(() => undefined);
  },

  listarSafras(): Promise<SafraDto[]> {
    return api.get<SafraDto[]>('/safras').then((r) => r.data);
  },

  obterSafra(id: string): Promise<SafraDto> {
    return api.get<SafraDto>(`/safras/${id}`).then((r) => r.data);
  },

  criarSafra(payload: CriarSafraPayload): Promise<SafraDto> {
    return api.post<SafraDto>('/safras', payload).then((r) => r.data);
  },

  editarSafra(id: string, payload: EditarSafraPayload): Promise<SafraDto> {
    return api.put<SafraDto>(`/safras/${id}`, payload).then((r) => r.data);
  },

  encerrarSafra(id: string, payload: EncerrarSafraPayload = {}): Promise<void> {
    return api.patch(`/safras/${id}/encerrar`, payload).then(() => undefined);
  },

  cancelarSafra(id: string): Promise<void> {
    return api.patch(`/safras/${id}/cancelar`).then(() => undefined);
  },

  listarVisitas(): Promise<VisitaTecnicaDto[]> {
    return api.get<VisitaTecnicaDto[]>('/safras/visitas-tecnicas').then((r) => r.data);
  },

  criarVisita(payload: CriarVisitaTecnicaPayload): Promise<VisitaTecnicaDto> {
    return api
      .post<VisitaTecnicaDto>('/safras/visitas-tecnicas', payload)
      .then((r) => r.data);
  },

  editarVisita(id: string, payload: EditarVisitaTecnicaPayload): Promise<VisitaTecnicaDto> {
    return api
      .put<VisitaTecnicaDto>(`/safras/visitas-tecnicas/${id}`, payload)
      .then((r) => r.data);
  },

  removerVisita(id: string): Promise<void> {
    return api.delete(`/safras/visitas-tecnicas/${id}`).then(() => undefined);
  },

  checkInVisita(id: string, payload: CheckInVisitaTecnicaPayload): Promise<VisitaTecnicaDto> {
    return api
      .patch<VisitaTecnicaDto>(`/safras/visitas-tecnicas/${id}/check-in`, payload)
      .then((r) => r.data);
  },

  adicionarFotoVisita(
    id: string,
    arquivo: File,
    legenda?: string | null,
  ): Promise<VisitaTecnicaFotoDto> {
    const formData = new FormData();
    formData.append('arquivo', arquivo);
    if (legenda?.trim()) {
      formData.append('legenda', legenda.trim());
    }

    return api
      .post<VisitaTecnicaFotoDto>(`/safras/visitas-tecnicas/${id}/fotos`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },

  removerFotoVisita(id: string, fotoId: string): Promise<void> {
    return api
      .delete(`/safras/visitas-tecnicas/${id}/fotos/${fotoId}`)
      .then(() => undefined);
  },

  listarRecomendacoes(): Promise<RecomendacaoDto[]> {
    return api.get<RecomendacaoDto[]>('/safras/recomendacoes').then((r) => r.data);
  },

  criarRecomendacao(payload: CriarRecomendacaoPayload): Promise<RecomendacaoDto> {
    return api
      .post<RecomendacaoDto>('/safras/recomendacoes', payload)
      .then((r) => r.data);
  },

  editarRecomendacao(
    id: string,
    payload: EditarRecomendacaoPayload,
  ): Promise<RecomendacaoDto> {
    return api
      .put<RecomendacaoDto>(`/safras/recomendacoes/${id}`, payload)
      .then((r) => r.data);
  },

  aplicarRecomendacao(id: string): Promise<void> {
    return api.patch(`/safras/recomendacoes/${id}/aplicar`).then(() => undefined);
  },

  cancelarRecomendacao(id: string): Promise<void> {
    return api.patch(`/safras/recomendacoes/${id}/cancelar`).then(() => undefined);
  },

  listarOrdensServico(): Promise<OrdemServicoAgricolaDto[]> {
    return api
      .get<OrdemServicoAgricolaDto[]>('/safras/ordens-servico')
      .then((r) => r.data);
  },

  criarOrdemServico(
    payload: CriarOrdemServicoAgricolaPayload,
  ): Promise<OrdemServicoAgricolaDto> {
    return api
      .post<OrdemServicoAgricolaDto>('/safras/ordens-servico', payload)
      .then((r) => r.data);
  },

  editarOrdemServico(
    id: string,
    payload: EditarOrdemServicoAgricolaPayload,
  ): Promise<OrdemServicoAgricolaDto> {
    return api
      .put<OrdemServicoAgricolaDto>(`/safras/ordens-servico/${id}`, payload)
      .then((r) => r.data);
  },

  iniciarOrdemServico(id: string): Promise<void> {
    return api.post(`/safras/ordens-servico/${id}/iniciar`).then(() => undefined);
  },

  concluirOrdemServico(id: string): Promise<void> {
    return api.post(`/safras/ordens-servico/${id}/concluir`).then(() => undefined);
  },

  cancelarOrdemServico(id: string): Promise<void> {
    return api.post(`/safras/ordens-servico/${id}/cancelar`).then(() => undefined);
  },

  listarCusteios(params?: ListarCusteiosParams): Promise<CusteioSafraDto[]> {
    return api.get<CusteioSafraDto[]>('/safras/custeios', { params }).then((r) => r.data);
  },

  criarCusteio(payload: CriarCusteioSafraPayload): Promise<CusteioSafraDto> {
    return api.post<CusteioSafraDto>('/safras/custeios', payload).then((r) => r.data);
  },

  removerCusteio(id: string): Promise<void> {
    return api.delete(`/safras/custeios/${id}`).then(() => undefined);
  },

  obterResumoCusteio(params?: ListarCusteiosParams): Promise<CusteioResumoDto> {
    return api
      .get<CusteioResumoDto>('/safras/custeios/resumo', { params })
      .then((r) => r.data);
  },

  obterProdutividade(safraId: string): Promise<ProdutividadeSafraDto> {
    return api
      .get<ProdutividadeSafraDto>('/safras/produtividade', { params: { safraId } })
      .then((r) => r.data);
  },

  listarHistoricoProdutividade(
    params?: ListarHistoricoProdutividadeParams,
  ): Promise<HistoricoProdutividadeDto[]> {
    return api
      .get<HistoricoProdutividadeDto[]>('/safras/historico-produtividade', { params })
      .then((r) => r.data);
  },

  obterOeeCampo(mes: number, ano: number): Promise<OeeCampoDto> {
    return api
      .get<OeeCampoDto>('/safras/oee-campo', { params: { mes, ano } })
      .then((r) => r.data);
  },

  listarDiarioCampo(): Promise<DiarioCampoDto[]> {
    return api.get<DiarioCampoDto[]>('/safras/diario-campo').then((r) => r.data);
  },

  criarDiarioCampo(payload: CriarDiarioCampoPayload): Promise<DiarioCampoDto> {
    return api
      .post<DiarioCampoDto>('/safras/diario-campo', payload)
      .then((r) => r.data);
  },

  syncDiarioCampo(itens: DiarioCampoSyncItem[]): Promise<DiarioCampoDto[]> {
    return api
      .post<DiarioCampoDto[]>('/safras/diario-campo/sync', itens)
      .then((r) => r.data);
  },

  importarGeo(payload: ImportarGeoPayload): Promise<void> {
    return api.post('/safras/geo/importar', payload).then(() => undefined);
  },

  obterPerfil(): Promise<PerfilSafrasDto> {
    return api.get<PerfilSafrasDto>('/safras/perfil').then((r) => r.data);
  },

  listarHistoricoAplicacoes(
    params?: ListarHistoricoAplicacoesParams,
  ): Promise<HistoricoAplicacaoItemDto[]> {
    return api
      .get<HistoricoAplicacaoItemDto[]>('/safras/aplicacoes/historico', { params })
      .then((r) => r.data);
  },
};
