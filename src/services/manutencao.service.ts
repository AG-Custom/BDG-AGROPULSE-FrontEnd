import { api } from 'services/api';
import type {
  AdicionarPecaOsPayload,
  AtivoManutencaoDto,
  ChecklistManutencaoDto,
  ConcluirOrdemServicoPayload,
  CriarAtivoManutencaoPayload,
  CriarChecklistManutencaoPayload,
  CriarOrdemServicoManutencaoPayload,
  CriarPlanoManutencaoPayload,
  DepreciacaoAtivoDto,
  EditarAtivoManutencaoPayload,
  EditarOrdemServicoManutencaoPayload,
  EditarPlanoManutencaoPayload,
  LeituraHorimetroDto,
  LeituraHorimetroPayload,
  ListarCustosManutencaoParams,
  ManutencaoDashboardDto,
  OrdemServicoManutencaoDto,
  PlanoManutencaoDto,
  RegistrarExecucaoPlanoPayload,
  RelatorioCustosManutencaoDto,
} from 'types/dtos/manutencao.dto';

export const manutencaoService = {
  listarAtivos(): Promise<AtivoManutencaoDto[]> {
    return api.get<AtivoManutencaoDto[]>('/manutencao/ativos').then((r) => r.data);
  },

  obterAtivo(id: string): Promise<AtivoManutencaoDto> {
    return api.get<AtivoManutencaoDto>(`/manutencao/ativos/${id}`).then((r) => r.data);
  },

  criarAtivo(payload: CriarAtivoManutencaoPayload): Promise<AtivoManutencaoDto> {
    return api.post<AtivoManutencaoDto>('/manutencao/ativos', payload).then((r) => r.data);
  },

  editarAtivo(id: string, payload: EditarAtivoManutencaoPayload): Promise<AtivoManutencaoDto> {
    return api.put<AtivoManutencaoDto>(`/manutencao/ativos/${id}`, payload).then((r) => r.data);
  },

  removerAtivo(id: string): Promise<void> {
    return api.delete(`/manutencao/ativos/${id}`).then(() => undefined);
  },

  obterDepreciacao(ativoId: string): Promise<DepreciacaoAtivoDto> {
    return api
      .get<DepreciacaoAtivoDto>(`/manutencao/ativos/${ativoId}/depreciacao`)
      .then((r) => r.data);
  },

  registrarLeituraHorimetro(
    ativoId: string,
    payload: LeituraHorimetroPayload,
  ): Promise<LeituraHorimetroDto> {
    return api
      .post<LeituraHorimetroDto>(`/manutencao/ativos/${ativoId}/leituras-horimetro`, payload)
      .then((r) => r.data);
  },

  listarPlanos(): Promise<PlanoManutencaoDto[]> {
    return api.get<PlanoManutencaoDto[]>('/manutencao/planos').then((r) => r.data);
  },

  obterPlano(id: string): Promise<PlanoManutencaoDto> {
    return api.get<PlanoManutencaoDto>(`/manutencao/planos/${id}`).then((r) => r.data);
  },

  criarPlano(payload: CriarPlanoManutencaoPayload): Promise<PlanoManutencaoDto> {
    return api.post<PlanoManutencaoDto>('/manutencao/planos', payload).then((r) => r.data);
  },

  editarPlano(id: string, payload: EditarPlanoManutencaoPayload): Promise<PlanoManutencaoDto> {
    return api.put<PlanoManutencaoDto>(`/manutencao/planos/${id}`, payload).then((r) => r.data);
  },

  removerPlano(id: string): Promise<void> {
    return api.delete(`/manutencao/planos/${id}`).then(() => undefined);
  },

  registrarExecucaoPlano(
    id: string,
    payload: RegistrarExecucaoPlanoPayload,
  ): Promise<PlanoManutencaoDto> {
    return api
      .post<PlanoManutencaoDto>(`/manutencao/planos/${id}/registrar-execucao`, payload)
      .then((r) => r.data);
  },

  listarAlertasPreventiva(): Promise<PlanoManutencaoDto[]> {
    return api.get<PlanoManutencaoDto[]>('/manutencao/alertas/preventiva').then((r) => r.data);
  },

  listarOrdensServico(): Promise<OrdemServicoManutencaoDto[]> {
    return api
      .get<OrdemServicoManutencaoDto[]>('/manutencao/ordens-servico')
      .then((r) => r.data);
  },

  obterOrdemServico(id: string): Promise<OrdemServicoManutencaoDto> {
    return api
      .get<OrdemServicoManutencaoDto>(`/manutencao/ordens-servico/${id}`)
      .then((r) => r.data);
  },

  criarOrdemServico(
    payload: CriarOrdemServicoManutencaoPayload,
  ): Promise<OrdemServicoManutencaoDto> {
    return api
      .post<OrdemServicoManutencaoDto>('/manutencao/ordens-servico', payload)
      .then((r) => r.data);
  },

  editarOrdemServico(
    id: string,
    payload: EditarOrdemServicoManutencaoPayload,
  ): Promise<OrdemServicoManutencaoDto> {
    return api
      .put<OrdemServicoManutencaoDto>(`/manutencao/ordens-servico/${id}`, payload)
      .then((r) => r.data);
  },

  iniciarOrdemServico(id: string): Promise<OrdemServicoManutencaoDto> {
    return api
      .post<OrdemServicoManutencaoDto>(`/manutencao/ordens-servico/${id}/iniciar`)
      .then((r) => r.data);
  },

  aguardarPecaOrdemServico(id: string): Promise<OrdemServicoManutencaoDto> {
    return api
      .post<OrdemServicoManutencaoDto>(`/manutencao/ordens-servico/${id}/aguardar-peca`)
      .then((r) => r.data);
  },

  concluirOrdemServico(
    id: string,
    payload?: ConcluirOrdemServicoPayload,
  ): Promise<OrdemServicoManutencaoDto> {
    return api
      .post<OrdemServicoManutencaoDto>(
        `/manutencao/ordens-servico/${id}/concluir`,
        payload ?? {},
      )
      .then((r) => r.data);
  },

  cancelarOrdemServico(id: string): Promise<OrdemServicoManutencaoDto> {
    return api
      .post<OrdemServicoManutencaoDto>(`/manutencao/ordens-servico/${id}/cancelar`)
      .then((r) => r.data);
  },

  adicionarPeca(
    ordemId: string,
    payload: AdicionarPecaOsPayload,
  ): Promise<OrdemServicoManutencaoDto> {
    return api
      .post<OrdemServicoManutencaoDto>(`/manutencao/ordens-servico/${ordemId}/pecas`, payload)
      .then((r) => r.data);
  },

  removerPeca(ordemId: string, pecaId: string): Promise<void> {
    return api
      .delete(`/manutencao/ordens-servico/${ordemId}/pecas/${pecaId}`)
      .then(() => undefined);
  },

  listarChecklists(): Promise<ChecklistManutencaoDto[]> {
    return api.get<ChecklistManutencaoDto[]>('/manutencao/checklists').then((r) => r.data);
  },

  obterChecklist(id: string): Promise<ChecklistManutencaoDto> {
    return api.get<ChecklistManutencaoDto>(`/manutencao/checklists/${id}`).then((r) => r.data);
  },

  criarChecklist(payload: CriarChecklistManutencaoPayload): Promise<ChecklistManutencaoDto> {
    return api
      .post<ChecklistManutencaoDto>('/manutencao/checklists', payload)
      .then((r) => r.data);
  },

  relatorioCustos(params?: ListarCustosManutencaoParams): Promise<RelatorioCustosManutencaoDto> {
    return api
      .get<RelatorioCustosManutencaoDto>('/manutencao/relatorios/custos', { params })
      .then((r) => r.data);
  },

  dashboard(): Promise<ManutencaoDashboardDto> {
    return api.get<ManutencaoDashboardDto>('/manutencao/dashboard').then((r) => r.data);
  },
};
