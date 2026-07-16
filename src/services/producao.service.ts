import { api } from 'services/api';
import type {
  ApontamentoConsumoDto,
  ApontamentoProducaoDto,
  BeneficiamentoLoteDto,
  ConcluirOrdemProducaoPayload,
  CriarApontamentoConsumoPayload,
  CriarApontamentoProducaoPayload,
  CriarBeneficiamentoLotePayload,
  CriarFichaTecnicaProcessoPayload,
  CriarLaudoQualidadePayload,
  CriarOrdemProducaoPayload,
  CriarParadaLinhaPayload,
  CriarReceitaProducaoPayload,
  EditarBeneficiamentoLotePayload,
  EditarFichaTecnicaProcessoPayload,
  EditarLaudoQualidadePayload,
  EditarOrdemProducaoPayload,
  EditarParadaLinhaPayload,
  EditarReceitaProducaoPayload,
  FichaTecnicaProcessoDto,
  LaudoQualidadeDto,
  OeeDto,
  OrdemProducaoDto,
  ParadaLinhaDto,
  ReceitaProducaoDto,
  ReprovarLaudoPayload,
  ResolverParadaLinhaPayload,
} from 'types/dtos/producao.dto';

export const producaoService = {
  listarOrdens(): Promise<OrdemProducaoDto[]> {
    return api.get<OrdemProducaoDto[]>('/producao/ordens').then((r) => r.data);
  },

  obterOrdem(id: string): Promise<OrdemProducaoDto> {
    return api.get<OrdemProducaoDto>(`/producao/ordens/${id}`).then((r) => r.data);
  },

  criarOrdem(payload: CriarOrdemProducaoPayload): Promise<OrdemProducaoDto> {
    return api.post<OrdemProducaoDto>('/producao/ordens', payload).then((r) => r.data);
  },

  editarOrdem(id: string, payload: EditarOrdemProducaoPayload): Promise<OrdemProducaoDto> {
    return api.put<OrdemProducaoDto>(`/producao/ordens/${id}`, payload).then((r) => r.data);
  },

  iniciarOrdem(id: string): Promise<OrdemProducaoDto> {
    return api.post<OrdemProducaoDto>(`/producao/ordens/${id}/iniciar`).then((r) => r.data);
  },

  concluirOrdem(
    id: string,
    payload: ConcluirOrdemProducaoPayload,
  ): Promise<OrdemProducaoDto> {
    return api
      .post<OrdemProducaoDto>(`/producao/ordens/${id}/concluir`, payload)
      .then((r) => r.data);
  },

  cancelarOrdem(id: string): Promise<void> {
    return api.post(`/producao/ordens/${id}/cancelar`).then(() => undefined);
  },

  listarApontamentosConsumo(ordemId: string): Promise<ApontamentoConsumoDto[]> {
    return api
      .get<ApontamentoConsumoDto[]>(`/producao/ordens/${ordemId}/apontamentos-consumo`)
      .then((r) => r.data);
  },

  criarApontamentoConsumo(
    ordemId: string,
    payload: CriarApontamentoConsumoPayload,
  ): Promise<ApontamentoConsumoDto> {
    return api
      .post<ApontamentoConsumoDto>(
        `/producao/ordens/${ordemId}/apontamentos-consumo`,
        payload,
      )
      .then((r) => r.data);
  },

  criarApontamentoProducao(
    ordemId: string,
    payload: CriarApontamentoProducaoPayload,
  ): Promise<ApontamentoProducaoDto> {
    return api
      .post<ApontamentoProducaoDto>(
        `/producao/ordens/${ordemId}/apontamentos-producao`,
        payload,
      )
      .then((r) => r.data);
  },

  listarBeneficiamentos(): Promise<BeneficiamentoLoteDto[]> {
    return api
      .get<BeneficiamentoLoteDto[]>('/producao/beneficiamentos')
      .then((r) => r.data);
  },

  obterBeneficiamento(id: string): Promise<BeneficiamentoLoteDto> {
    return api
      .get<BeneficiamentoLoteDto>(`/producao/beneficiamentos/${id}`)
      .then((r) => r.data);
  },

  criarBeneficiamento(
    payload: CriarBeneficiamentoLotePayload,
  ): Promise<BeneficiamentoLoteDto> {
    return api
      .post<BeneficiamentoLoteDto>('/producao/beneficiamentos', payload)
      .then((r) => r.data);
  },

  editarBeneficiamento(
    id: string,
    payload: EditarBeneficiamentoLotePayload,
  ): Promise<BeneficiamentoLoteDto> {
    return api
      .put<BeneficiamentoLoteDto>(`/producao/beneficiamentos/${id}`, payload)
      .then((r) => r.data);
  },

  removerBeneficiamento(id: string): Promise<void> {
    return api.delete(`/producao/beneficiamentos/${id}`).then(() => undefined);
  },

  confirmarBeneficiamento(id: string): Promise<BeneficiamentoLoteDto> {
    return api
      .post<BeneficiamentoLoteDto>(`/producao/beneficiamentos/${id}/confirmar`)
      .then((r) => r.data);
  },

  listarReceitas(produtoSaidaId?: string): Promise<ReceitaProducaoDto[]> {
    return api
      .get<ReceitaProducaoDto[]>('/producao/receitas', {
        params: produtoSaidaId ? { produtoSaidaId } : undefined,
      })
      .then((r) => r.data);
  },

  obterReceita(id: string): Promise<ReceitaProducaoDto> {
    return api.get<ReceitaProducaoDto>(`/producao/receitas/${id}`).then((r) => r.data);
  },

  criarReceita(payload: CriarReceitaProducaoPayload): Promise<ReceitaProducaoDto> {
    return api.post<ReceitaProducaoDto>('/producao/receitas', payload).then((r) => r.data);
  },

  editarReceita(
    id: string,
    payload: EditarReceitaProducaoPayload,
  ): Promise<ReceitaProducaoDto> {
    return api
      .put<ReceitaProducaoDto>(`/producao/receitas/${id}`, payload)
      .then((r) => r.data);
  },

  removerReceita(id: string): Promise<void> {
    return api.delete(`/producao/receitas/${id}`).then(() => undefined);
  },

  ativarReceita(id: string): Promise<ReceitaProducaoDto> {
    return api
      .post<ReceitaProducaoDto>(`/producao/receitas/${id}/ativar`)
      .then((r) => r.data);
  },

  listarLaudos(): Promise<LaudoQualidadeDto[]> {
    return api.get<LaudoQualidadeDto[]>('/producao/laudos').then((r) => r.data);
  },

  obterLaudo(id: string): Promise<LaudoQualidadeDto> {
    return api.get<LaudoQualidadeDto>(`/producao/laudos/${id}`).then((r) => r.data);
  },

  criarLaudo(payload: CriarLaudoQualidadePayload): Promise<LaudoQualidadeDto> {
    return api.post<LaudoQualidadeDto>('/producao/laudos', payload).then((r) => r.data);
  },

  editarLaudo(
    id: string,
    payload: EditarLaudoQualidadePayload,
  ): Promise<LaudoQualidadeDto> {
    return api.put<LaudoQualidadeDto>(`/producao/laudos/${id}`, payload).then((r) => r.data);
  },

  removerLaudo(id: string): Promise<void> {
    return api.delete(`/producao/laudos/${id}`).then(() => undefined);
  },

  aprovarLaudo(id: string): Promise<LaudoQualidadeDto> {
    return api.post<LaudoQualidadeDto>(`/producao/laudos/${id}/aprovar`).then((r) => r.data);
  },

  reprovarLaudo(id: string, payload?: ReprovarLaudoPayload): Promise<LaudoQualidadeDto> {
    return api
      .post<LaudoQualidadeDto>(`/producao/laudos/${id}/reprovar`, payload ?? {})
      .then((r) => r.data);
  },

  listarFichasTecnicas(): Promise<FichaTecnicaProcessoDto[]> {
    return api
      .get<FichaTecnicaProcessoDto[]>('/producao/fichas-tecnicas')
      .then((r) => r.data);
  },

  obterFichaTecnica(id: string): Promise<FichaTecnicaProcessoDto> {
    return api
      .get<FichaTecnicaProcessoDto>(`/producao/fichas-tecnicas/${id}`)
      .then((r) => r.data);
  },

  criarFichaTecnica(
    payload: CriarFichaTecnicaProcessoPayload,
  ): Promise<FichaTecnicaProcessoDto> {
    return api
      .post<FichaTecnicaProcessoDto>('/producao/fichas-tecnicas', payload)
      .then((r) => r.data);
  },

  editarFichaTecnica(
    id: string,
    payload: EditarFichaTecnicaProcessoPayload,
  ): Promise<FichaTecnicaProcessoDto> {
    return api
      .put<FichaTecnicaProcessoDto>(`/producao/fichas-tecnicas/${id}`, payload)
      .then((r) => r.data);
  },

  removerFichaTecnica(id: string): Promise<void> {
    return api.delete(`/producao/fichas-tecnicas/${id}`).then(() => undefined);
  },

  listarParadas(): Promise<ParadaLinhaDto[]> {
    return api.get<ParadaLinhaDto[]>('/producao/paradas-linha').then((r) => r.data);
  },

  obterParada(id: string): Promise<ParadaLinhaDto> {
    return api.get<ParadaLinhaDto>(`/producao/paradas-linha/${id}`).then((r) => r.data);
  },

  criarParada(payload: CriarParadaLinhaPayload): Promise<ParadaLinhaDto> {
    return api.post<ParadaLinhaDto>('/producao/paradas-linha', payload).then((r) => r.data);
  },

  editarParada(id: string, payload: EditarParadaLinhaPayload): Promise<ParadaLinhaDto> {
    return api
      .put<ParadaLinhaDto>(`/producao/paradas-linha/${id}`, payload)
      .then((r) => r.data);
  },

  removerParada(id: string): Promise<void> {
    return api.delete(`/producao/paradas-linha/${id}`).then(() => undefined);
  },

  resolverParada(
    id: string,
    payload?: ResolverParadaLinhaPayload,
  ): Promise<ParadaLinhaDto> {
    return api
      .post<ParadaLinhaDto>(`/producao/paradas-linha/${id}/resolver`, payload ?? {})
      .then((r) => r.data);
  },

  obterOee(mes: number, ano: number): Promise<OeeDto> {
    return api
      .get<OeeDto>('/producao/oee', { params: { mes, ano } })
      .then((r) => r.data);
  },
};
