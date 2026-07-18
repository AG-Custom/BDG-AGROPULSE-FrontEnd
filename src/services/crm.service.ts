import { api } from 'services/api';
import type {
  AlterarEtapaOportunidadePayload,
  AmostraCampoDto,
  AnaliseCreditoDto,
  CampanhaDto,
  CarteiraAgronomicaDto,
  ClientePerfil360Dto,
  CriarAmostraCampoPayload,
  CriarAnaliseCreditoPayload,
  CriarCampanhaPayload,
  CriarOportunidadePayload,
  CriarPreferenciaClientePayload,
  CrmDashboardDto,
  EditarAmostraCampoPayload,
  EditarAnaliseCreditoPayload,
  EditarCampanhaPayload,
  EditarOportunidadePayload,
  EditarPreferenciaClientePayload,
  ListarCarteiraAgronomicaParams,
  OportunidadeDto,
  PreferenciaClienteDto,
} from 'types/dtos/crm.dto';

export const crmService = {
  dashboard(): Promise<CrmDashboardDto> {
    return api.get<CrmDashboardDto>('/crm/dashboard').then((r) => r.data);
  },

  obterCarteira(params?: ListarCarteiraAgronomicaParams): Promise<CarteiraAgronomicaDto> {
    return api
      .get<CarteiraAgronomicaDto>('/crm/carteira-agronomica', { params })
      .then((r) => r.data);
  },

  obterPerfil360(clienteId: string): Promise<ClientePerfil360Dto> {
    return api
      .get<ClientePerfil360Dto>(`/crm/clientes/${clienteId}/perfil-360`)
      .then((r) => r.data);
  },

  listarOportunidades(): Promise<OportunidadeDto[]> {
    return api.get<OportunidadeDto[]>('/crm/oportunidades').then((r) => r.data);
  },

  obterOportunidade(id: string): Promise<OportunidadeDto> {
    return api.get<OportunidadeDto>(`/crm/oportunidades/${id}`).then((r) => r.data);
  },

  criarOportunidade(payload: CriarOportunidadePayload): Promise<OportunidadeDto> {
    return api.post<OportunidadeDto>('/crm/oportunidades', payload).then((r) => r.data);
  },

  editarOportunidade(id: string, payload: EditarOportunidadePayload): Promise<OportunidadeDto> {
    return api.put<OportunidadeDto>(`/crm/oportunidades/${id}`, payload).then((r) => r.data);
  },

  alterarEtapaOportunidade(
    id: string,
    payload: AlterarEtapaOportunidadePayload,
  ): Promise<OportunidadeDto> {
    return api
      .patch<OportunidadeDto>(`/crm/oportunidades/${id}/etapa`, payload)
      .then((r) => r.data);
  },

  removerOportunidade(id: string): Promise<void> {
    return api.delete(`/crm/oportunidades/${id}`).then(() => undefined);
  },

  listarAmostras(): Promise<AmostraCampoDto[]> {
    return api.get<AmostraCampoDto[]>('/crm/amostras').then((r) => r.data);
  },

  obterAmostra(id: string): Promise<AmostraCampoDto> {
    return api.get<AmostraCampoDto>(`/crm/amostras/${id}`).then((r) => r.data);
  },

  criarAmostra(payload: CriarAmostraCampoPayload): Promise<AmostraCampoDto> {
    return api.post<AmostraCampoDto>('/crm/amostras', payload).then((r) => r.data);
  },

  editarAmostra(id: string, payload: EditarAmostraCampoPayload): Promise<AmostraCampoDto> {
    return api.put<AmostraCampoDto>(`/crm/amostras/${id}`, payload).then((r) => r.data);
  },

  removerAmostra(id: string): Promise<void> {
    return api.delete(`/crm/amostras/${id}`).then(() => undefined);
  },

  listarCampanhas(): Promise<CampanhaDto[]> {
    return api.get<CampanhaDto[]>('/crm/campanhas').then((r) => r.data);
  },

  obterCampanha(id: string): Promise<CampanhaDto> {
    return api.get<CampanhaDto>(`/crm/campanhas/${id}`).then((r) => r.data);
  },

  criarCampanha(payload: CriarCampanhaPayload): Promise<CampanhaDto> {
    return api.post<CampanhaDto>('/crm/campanhas', payload).then((r) => r.data);
  },

  editarCampanha(id: string, payload: EditarCampanhaPayload): Promise<CampanhaDto> {
    return api.put<CampanhaDto>(`/crm/campanhas/${id}`, payload).then((r) => r.data);
  },

  dispararCampanha(id: string): Promise<CampanhaDto> {
    return api.post<CampanhaDto>(`/crm/campanhas/${id}/disparar`).then((r) => r.data);
  },

  removerCampanha(id: string): Promise<void> {
    return api.delete(`/crm/campanhas/${id}`).then(() => undefined);
  },

  listarAnalisesCredito(): Promise<AnaliseCreditoDto[]> {
    return api.get<AnaliseCreditoDto[]>('/crm/analises-credito').then((r) => r.data);
  },

  obterAnaliseCredito(id: string): Promise<AnaliseCreditoDto> {
    return api.get<AnaliseCreditoDto>(`/crm/analises-credito/${id}`).then((r) => r.data);
  },

  criarAnaliseCredito(payload: CriarAnaliseCreditoPayload): Promise<AnaliseCreditoDto> {
    return api
      .post<AnaliseCreditoDto>('/crm/analises-credito', payload)
      .then((r) => r.data);
  },

  editarAnaliseCredito(
    id: string,
    payload: EditarAnaliseCreditoPayload,
  ): Promise<AnaliseCreditoDto> {
    return api
      .put<AnaliseCreditoDto>(`/crm/analises-credito/${id}`, payload)
      .then((r) => r.data);
  },

  recalcularAnaliseCredito(clienteId: string): Promise<AnaliseCreditoDto> {
    return api
      .post<AnaliseCreditoDto>('/crm/analises-credito/recalcular', null, {
        params: { clienteId },
      })
      .then((r) => r.data);
  },

  removerAnaliseCredito(id: string): Promise<void> {
    return api.delete(`/crm/analises-credito/${id}`).then(() => undefined);
  },

  listarPreferencias(clienteId?: string): Promise<PreferenciaClienteDto[]> {
    return api
      .get<PreferenciaClienteDto[]>('/crm/preferencias', {
        params: clienteId ? { clienteId } : undefined,
      })
      .then((r) => r.data);
  },

  criarPreferencia(payload: CriarPreferenciaClientePayload): Promise<PreferenciaClienteDto> {
    return api
      .post<PreferenciaClienteDto>('/crm/preferencias', payload)
      .then((r) => r.data);
  },

  editarPreferencia(
    id: string,
    payload: EditarPreferenciaClientePayload,
  ): Promise<PreferenciaClienteDto> {
    return api
      .put<PreferenciaClienteDto>(`/crm/preferencias/${id}`, payload)
      .then((r) => r.data);
  },

  removerPreferencia(id: string): Promise<void> {
    return api.delete(`/crm/preferencias/${id}`).then(() => undefined);
  },
};
