import { api } from 'services/api';
import type {
  AbastecimentoLogisticaDto,
  CriarAbastecimentoLogisticaPayload,
  CriarCargaLogisticaPayload,
  CriarDocTransporteLogisticaPayload,
  CriarRomaneioLogisticaPayload,
  CriarTransportadoraLogisticaPayload,
  CriarVeiculoLogisticaPayload,
  DocTransporteLogisticaDto,
  EditarCargaLogisticaPayload,
  EditarRomaneioLogisticaPayload,
  EditarTransportadoraLogisticaPayload,
  EditarVeiculoLogisticaPayload,
  FreteTransportadoraPayload,
  ListarAbastecimentosParams,
  ListarCargasLogisticaParams,
  ListarCustoLogisticaParams,
  ListarDocsTransporteParams,
  ListarRomaneiosLogisticaParams,
  LogisticaDashboardDto,
  RegistrarOcorrenciaPayload,
  RelatorioCustoLogisticaDto,
  RomaneioLogisticaDto,
  TransportadoraLogisticaDto,
  VeiculoLogisticaDto,
  CargaLogisticaDto,
} from 'types/dtos/logistica.dto';
import type { StatusVeiculoLogisticaValor } from 'constants/enums';

export const logisticaService = {
  dashboard(): Promise<LogisticaDashboardDto> {
    return api.get<LogisticaDashboardDto>('/logistica/dashboard').then((r) => r.data);
  },

  listarVeiculos(status?: StatusVeiculoLogisticaValor): Promise<VeiculoLogisticaDto[]> {
    return api
      .get<VeiculoLogisticaDto[]>('/logistica/veiculos', { params: { status } })
      .then((r) => r.data);
  },

  alertasDocumentos(): Promise<VeiculoLogisticaDto[]> {
    return api
      .get<VeiculoLogisticaDto[]>('/logistica/veiculos/alertas-documentos')
      .then((r) => r.data);
  },

  obterVeiculo(id: string): Promise<VeiculoLogisticaDto> {
    return api.get<VeiculoLogisticaDto>(`/logistica/veiculos/${id}`).then((r) => r.data);
  },

  criarVeiculo(payload: CriarVeiculoLogisticaPayload): Promise<VeiculoLogisticaDto> {
    return api.post<VeiculoLogisticaDto>('/logistica/veiculos', payload).then((r) => r.data);
  },

  editarVeiculo(id: string, payload: EditarVeiculoLogisticaPayload): Promise<VeiculoLogisticaDto> {
    return api.put<VeiculoLogisticaDto>(`/logistica/veiculos/${id}`, payload).then((r) => r.data);
  },

  removerVeiculo(id: string): Promise<void> {
    return api.delete(`/logistica/veiculos/${id}`).then(() => undefined);
  },

  listarCargas(params?: ListarCargasLogisticaParams): Promise<CargaLogisticaDto[]> {
    return api.get<CargaLogisticaDto[]>('/logistica/cargas', { params }).then((r) => r.data);
  },

  obterCarga(id: string): Promise<CargaLogisticaDto> {
    return api.get<CargaLogisticaDto>(`/logistica/cargas/${id}`).then((r) => r.data);
  },

  criarCarga(payload: CriarCargaLogisticaPayload): Promise<CargaLogisticaDto> {
    return api.post<CargaLogisticaDto>('/logistica/cargas', payload).then((r) => r.data);
  },

  editarCarga(id: string, payload: EditarCargaLogisticaPayload): Promise<CargaLogisticaDto> {
    return api.put<CargaLogisticaDto>(`/logistica/cargas/${id}`, payload).then((r) => r.data);
  },

  removerCarga(id: string): Promise<void> {
    return api.delete(`/logistica/cargas/${id}`).then(() => undefined);
  },

  iniciarCarga(id: string): Promise<CargaLogisticaDto> {
    return api.post<CargaLogisticaDto>(`/logistica/cargas/${id}/iniciar`).then((r) => r.data);
  },

  concluirCarga(id: string): Promise<CargaLogisticaDto> {
    return api.post<CargaLogisticaDto>(`/logistica/cargas/${id}/concluir`).then((r) => r.data);
  },

  cancelarCarga(id: string): Promise<CargaLogisticaDto> {
    return api.post<CargaLogisticaDto>(`/logistica/cargas/${id}/cancelar`).then((r) => r.data);
  },

  listarRomaneios(params?: ListarRomaneiosLogisticaParams): Promise<RomaneioLogisticaDto[]> {
    return api
      .get<RomaneioLogisticaDto[]>('/logistica/romaneios', { params })
      .then((r) => r.data);
  },

  obterRomaneio(id: string): Promise<RomaneioLogisticaDto> {
    return api.get<RomaneioLogisticaDto>(`/logistica/romaneios/${id}`).then((r) => r.data);
  },

  criarRomaneio(payload: CriarRomaneioLogisticaPayload): Promise<RomaneioLogisticaDto> {
    return api.post<RomaneioLogisticaDto>('/logistica/romaneios', payload).then((r) => r.data);
  },

  editarRomaneio(
    id: string,
    payload: EditarRomaneioLogisticaPayload,
  ): Promise<RomaneioLogisticaDto> {
    return api
      .put<RomaneioLogisticaDto>(`/logistica/romaneios/${id}`, payload)
      .then((r) => r.data);
  },

  removerRomaneio(id: string): Promise<void> {
    return api.delete(`/logistica/romaneios/${id}`).then(() => undefined);
  },

  iniciarRotaRomaneio(id: string): Promise<RomaneioLogisticaDto> {
    return api
      .post<RomaneioLogisticaDto>(`/logistica/romaneios/${id}/iniciar-rota`)
      .then((r) => r.data);
  },

  entregarRomaneio(id: string, dataHoraEntrega?: string | null): Promise<RomaneioLogisticaDto> {
    return api
      .post<RomaneioLogisticaDto>(`/logistica/romaneios/${id}/entregar`, {
        dataHoraEntrega: dataHoraEntrega ?? null,
      })
      .then((r) => r.data);
  },

  registrarOcorrencia(
    id: string,
    payload: RegistrarOcorrenciaPayload,
  ): Promise<RomaneioLogisticaDto> {
    return api
      .post<RomaneioLogisticaDto>(`/logistica/romaneios/${id}/ocorrencias`, payload)
      .then((r) => r.data);
  },

  listarTransportadoras(): Promise<TransportadoraLogisticaDto[]> {
    return api
      .get<TransportadoraLogisticaDto[]>('/logistica/transportadoras')
      .then((r) => r.data);
  },

  obterTransportadora(id: string): Promise<TransportadoraLogisticaDto> {
    return api
      .get<TransportadoraLogisticaDto>(`/logistica/transportadoras/${id}`)
      .then((r) => r.data);
  },

  criarTransportadora(
    payload: CriarTransportadoraLogisticaPayload,
  ): Promise<TransportadoraLogisticaDto> {
    return api
      .post<TransportadoraLogisticaDto>('/logistica/transportadoras', payload)
      .then((r) => r.data);
  },

  editarTransportadora(
    id: string,
    payload: EditarTransportadoraLogisticaPayload,
  ): Promise<TransportadoraLogisticaDto> {
    return api
      .put<TransportadoraLogisticaDto>(`/logistica/transportadoras/${id}`, payload)
      .then((r) => r.data);
  },

  removerTransportadora(id: string): Promise<void> {
    return api.delete(`/logistica/transportadoras/${id}`).then(() => undefined);
  },

  adicionarFrete(
    transportadoraId: string,
    payload: FreteTransportadoraPayload,
  ): Promise<TransportadoraLogisticaDto> {
    return api
      .post<TransportadoraLogisticaDto>(
        `/logistica/transportadoras/${transportadoraId}/fretes`,
        payload,
      )
      .then((r) => r.data);
  },

  editarFrete(
    transportadoraId: string,
    freteId: string,
    payload: FreteTransportadoraPayload,
  ): Promise<TransportadoraLogisticaDto> {
    return api
      .put<TransportadoraLogisticaDto>(
        `/logistica/transportadoras/${transportadoraId}/fretes/${freteId}`,
        payload,
      )
      .then((r) => r.data);
  },

  removerFrete(transportadoraId: string, freteId: string): Promise<void> {
    return api
      .delete(`/logistica/transportadoras/${transportadoraId}/fretes/${freteId}`)
      .then(() => undefined);
  },

  listarAbastecimentos(params?: ListarAbastecimentosParams): Promise<AbastecimentoLogisticaDto[]> {
    return api
      .get<AbastecimentoLogisticaDto[]>('/logistica/abastecimentos', { params })
      .then((r) => r.data);
  },

  criarAbastecimento(
    payload: CriarAbastecimentoLogisticaPayload,
  ): Promise<AbastecimentoLogisticaDto> {
    return api
      .post<AbastecimentoLogisticaDto>('/logistica/abastecimentos', payload)
      .then((r) => r.data);
  },

  removerAbastecimento(id: string): Promise<void> {
    return api.delete(`/logistica/abastecimentos/${id}`).then(() => undefined);
  },

  listarDocsTransporte(params?: ListarDocsTransporteParams): Promise<DocTransporteLogisticaDto[]> {
    return api
      .get<DocTransporteLogisticaDto[]>('/logistica/docs-transporte', { params })
      .then((r) => r.data);
  },

  criarDocTransporte(
    payload: CriarDocTransporteLogisticaPayload,
  ): Promise<DocTransporteLogisticaDto> {
    return api
      .post<DocTransporteLogisticaDto>('/logistica/docs-transporte', payload)
      .then((r) => r.data);
  },

  autorizarDocTransporte(id: string): Promise<DocTransporteLogisticaDto> {
    return api
      .post<DocTransporteLogisticaDto>(`/logistica/docs-transporte/${id}/autorizar`)
      .then((r) => r.data);
  },

  cancelarDocTransporte(id: string): Promise<DocTransporteLogisticaDto> {
    return api
      .post<DocTransporteLogisticaDto>(`/logistica/docs-transporte/${id}/cancelar`)
      .then((r) => r.data);
  },

  relatorioCusto(params?: ListarCustoLogisticaParams): Promise<RelatorioCustoLogisticaDto> {
    return api
      .get<RelatorioCustoLogisticaDto>('/logistica/relatorios/custo', { params })
      .then((r) => r.data);
  },
};
