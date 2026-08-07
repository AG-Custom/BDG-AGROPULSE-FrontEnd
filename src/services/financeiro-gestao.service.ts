import { api } from 'services/api';
import type {
  AntecipacaoCarteiraDto,
  AntecipacaoDto,
  AplicacaoFinanceiraDto,
  BoletoDto,
  CaixaDto,
  CentroCustoDto,
  ChequeDto,
  ConciliacaoLancamentoDto,
  ConciliacaoOfxResultDto,
  ContaBancariaDto,
  CotacaoMoedaDto,
  CriarAplicacaoPayload,
  CriarCaixaPayload,
  CriarCentroCustoPayload,
  CriarChequePayload,
  CriarContaBancariaPayload,
  AtualizarCotacaoMoedaPayload,
  CriarCotacaoMoedaPayload,
  CriarOrcamentoFinanceiroPayload,
  SincronizarPtaxPayload,
  CriarRenegociacaoPayload,
  CriarTransferenciaPayload,
  DreOrcamentoDto,
  EditarCaixaPayload,
  EditarCentroCustoPayload,
  EditarContaBancariaPayload,
  EditarOrcamentoFinanceiroPayload,
  EmitirBoletoPayload,
  EscopoListagemParams,
  ExposicaoCambialDto,
  FluxoCaixaDto,
  ListarChequesParams,
  ListarFluxoCaixaParams,
  OrcamentoFinanceiroDto,
  ProporLancamentosPayload,
  ProcessarReguaDiaDto,
  ReguaCobrancaConfigEtapaDto,
  ReguaCobrancaPainelDto,
  RemessaBoletoPayload,
  RemessaBoletoResultDto,
  RenegociacaoDto,
  ResgatarAplicacaoPayload,
  RetornoBoletoResultDto,
  SimularAntecipacaoPayload,
  SimularAntecipacaoResultDto,
  TesourariaProjecaoDto,
  TesourariaSaldoIntradayDto,
  TransferenciaFinanceiraDto,
  UpsertReguaCobrancaConfigPayload,
  VincularConciliacaoPayload,
} from 'types/dtos/financeiro-gestao.dto';

export const financeiroGestaoService = {
  listarContasBancarias(params?: EscopoListagemParams): Promise<ContaBancariaDto[]> {
    return api.get<ContaBancariaDto[]>('/contas-bancarias', { params }).then((r) => r.data);
  },

  criarContaBancaria(payload: CriarContaBancariaPayload): Promise<ContaBancariaDto> {
    return api.post<ContaBancariaDto>('/contas-bancarias', payload).then((r) => r.data);
  },

  editarContaBancaria(
    id: string,
    payload: EditarContaBancariaPayload,
  ): Promise<ContaBancariaDto> {
    return api.put<ContaBancariaDto>(`/contas-bancarias/${id}`, payload).then((r) => r.data);
  },

  inativarContaBancaria(id: string, justificativa: string): Promise<void> {
    return api.patch(`/contas-bancarias/${id}/inativar`, { justificativa }).then(() => undefined);
  },

  ativarContaBancaria(id: string): Promise<void> {
    return api.patch(`/contas-bancarias/${id}/ativar`).then(() => undefined);
  },

  listarCaixas(params?: EscopoListagemParams): Promise<CaixaDto[]> {
    return api.get<CaixaDto[]>('/caixas', { params }).then((r) => r.data);
  },

  criarCaixa(payload: CriarCaixaPayload): Promise<CaixaDto> {
    return api.post<CaixaDto>('/caixas', payload).then((r) => r.data);
  },

  editarCaixa(id: string, payload: EditarCaixaPayload): Promise<CaixaDto> {
    return api.put<CaixaDto>(`/caixas/${id}`, payload).then((r) => r.data);
  },

  listarCentrosCusto(params?: EscopoListagemParams): Promise<CentroCustoDto[]> {
    return api.get<CentroCustoDto[]>('/centros-custo', { params }).then((r) => r.data);
  },

  criarCentroCusto(payload: CriarCentroCustoPayload): Promise<CentroCustoDto> {
    return api.post<CentroCustoDto>('/centros-custo', payload).then((r) => r.data);
  },

  editarCentroCusto(
    id: string,
    payload: EditarCentroCustoPayload,
  ): Promise<CentroCustoDto> {
    return api.put<CentroCustoDto>(`/centros-custo/${id}`, payload).then((r) => r.data);
  },

  listarTransferencias(params?: EscopoListagemParams): Promise<TransferenciaFinanceiraDto[]> {
    return api
      .get<TransferenciaFinanceiraDto[]>('/transferencias-financeiras', { params })
      .then((r) => r.data);
  },

  criarTransferencia(
    payload: CriarTransferenciaPayload,
  ): Promise<TransferenciaFinanceiraDto> {
    return api
      .post<TransferenciaFinanceiraDto>('/transferencias-financeiras', payload)
      .then((r) => r.data);
  },

  confirmarTransferencia(id: string): Promise<TransferenciaFinanceiraDto> {
    return api
      .post<TransferenciaFinanceiraDto>(`/transferencias-financeiras/${id}/confirmar`)
      .then((r) => r.data);
  },

  cancelarTransferencia(id: string): Promise<TransferenciaFinanceiraDto> {
    return api
      .post<TransferenciaFinanceiraDto>(`/transferencias-financeiras/${id}/cancelar`)
      .then((r) => r.data);
  },

  listarCheques(params?: ListarChequesParams): Promise<ChequeDto[]> {
    return api.get<ChequeDto[]>('/cheques', { params }).then((r) => r.data);
  },

  criarCheque(payload: CriarChequePayload): Promise<ChequeDto> {
    return api.post<ChequeDto>('/cheques', payload).then((r) => r.data);
  },

  depositarCheque(id: string): Promise<ChequeDto> {
    return api.post<ChequeDto>(`/cheques/${id}/depositar`).then((r) => r.data);
  },

  compensarCheque(id: string): Promise<ChequeDto> {
    return api.post<ChequeDto>(`/cheques/${id}/compensar`).then((r) => r.data);
  },

  devolverCheque(id: string): Promise<ChequeDto> {
    return api.post<ChequeDto>(`/cheques/${id}/devolver`).then((r) => r.data);
  },

  obterFluxoCaixa(params?: ListarFluxoCaixaParams): Promise<FluxoCaixaDto> {
    return api
      .get<FluxoCaixaDto>('/financeiro/fluxo-caixa', { params })
      .then((r) => r.data);
  },

  obterSaldoIntraday(params?: EscopoListagemParams): Promise<TesourariaSaldoIntradayDto> {
    return api
      .get<TesourariaSaldoIntradayDto>('/financeiro/tesouraria/saldo-intraday', { params })
      .then((r) => r.data);
  },

  obterProjecaoTesouraria(
    params?: EscopoListagemParams & { dias?: number },
  ): Promise<TesourariaProjecaoDto> {
    return api
      .get<TesourariaProjecaoDto>('/financeiro/tesouraria/projecao', { params })
      .then((r) => r.data);
  },

  listarAplicacoes(params?: EscopoListagemParams): Promise<AplicacaoFinanceiraDto[]> {
    return api
      .get<AplicacaoFinanceiraDto[]>('/aplicacoes-financeiras', { params })
      .then((r) => r.data);
  },

  criarAplicacao(payload: CriarAplicacaoPayload): Promise<AplicacaoFinanceiraDto> {
    return api
      .post<AplicacaoFinanceiraDto>('/aplicacoes-financeiras', payload)
      .then((r) => r.data);
  },

  resgatarAplicacao(
    id: string,
    payload?: ResgatarAplicacaoPayload,
  ): Promise<AplicacaoFinanceiraDto> {
    return api
      .post<AplicacaoFinanceiraDto>(`/aplicacoes-financeiras/${id}/resgatar`, payload ?? {})
      .then((r) => r.data);
  },

  importarOfx(contaBancariaId: string, arquivo: File): Promise<ConciliacaoOfxResultDto> {
    const form = new FormData();
    form.append('contaBancariaId', contaBancariaId);
    form.append('arquivo', arquivo);
    return api
      .post<ConciliacaoOfxResultDto>('/conciliacoes-bancarias/importar-ofx', form)
      .then((r) => r.data);
  },

  vincularLancamento(
    payload: VincularConciliacaoPayload,
  ): Promise<ConciliacaoLancamentoDto> {
    return api
      .post<ConciliacaoLancamentoDto>('/conciliacoes-bancarias/vincular', payload)
      .then((r) => r.data);
  },

  proporLancamentos(
    payload: ProporLancamentosPayload,
  ): Promise<ConciliacaoOfxResultDto> {
    return api
      .post<ConciliacaoOfxResultDto>('/conciliacoes-bancarias/propor-lancamentos', payload)
      .then((r) => r.data);
  },

  listarBoletos(params?: EscopoListagemParams): Promise<BoletoDto[]> {
    return api.get<BoletoDto[]>('/boletos', { params }).then((r) => r.data);
  },

  emitirBoleto(payload: EmitirBoletoPayload): Promise<BoletoDto> {
    return api.post<BoletoDto>('/boletos/emitir', payload).then((r) => r.data);
  },

  gerarRemessa(payload: RemessaBoletoPayload): Promise<RemessaBoletoResultDto> {
    return api.post<RemessaBoletoResultDto>('/boletos/remessa', payload).then((r) => r.data);
  },

  processarRetorno(arquivo: File): Promise<RetornoBoletoResultDto> {
    const form = new FormData();
    form.append('arquivo', arquivo);
    return api
      .post<RetornoBoletoResultDto>('/boletos/retorno', form)
      .then((r) => r.data);
  },

  obterReguaConfig(): Promise<ReguaCobrancaConfigEtapaDto[]> {
    return api.get<ReguaCobrancaConfigEtapaDto[]>('/regua-cobranca/config').then((r) => r.data);
  },

  salvarReguaConfig(
    payload: UpsertReguaCobrancaConfigPayload,
  ): Promise<ReguaCobrancaConfigEtapaDto[]> {
    return api
      .put<ReguaCobrancaConfigEtapaDto[]>('/regua-cobranca/config', payload)
      .then((r) => r.data);
  },

  obterReguaPainel(): Promise<ReguaCobrancaPainelDto> {
    return api.get<ReguaCobrancaPainelDto>('/regua-cobranca/painel').then((r) => r.data);
  },

  processarReguaDia(): Promise<ProcessarReguaDiaDto> {
    return api
      .post<ProcessarReguaDiaDto>('/regua-cobranca/processar-dia')
      .then((r) => r.data);
  },

  listarRenegociacoes(params?: EscopoListagemParams): Promise<RenegociacaoDto[]> {
    return api.get<RenegociacaoDto[]>('/renegociacoes', { params }).then((r) => r.data);
  },

  criarRenegociacao(payload: CriarRenegociacaoPayload): Promise<RenegociacaoDto> {
    return api.post<RenegociacaoDto>('/renegociacoes', payload).then((r) => r.data);
  },

  aprovarRenegociacao(id: string): Promise<RenegociacaoDto> {
    return api.post<RenegociacaoDto>(`/renegociacoes/${id}/aprovar`).then((r) => r.data);
  },

  rejeitarRenegociacao(id: string): Promise<RenegociacaoDto> {
    return api.post<RenegociacaoDto>(`/renegociacoes/${id}/rejeitar`).then((r) => r.data);
  },

  listarAntecipacoes(params?: EscopoListagemParams): Promise<AntecipacaoDto[]> {
    return api.get<AntecipacaoDto[]>('/antecipacoes', { params }).then((r) => r.data);
  },

  obterCarteiraAntecipacao(): Promise<AntecipacaoCarteiraDto> {
    return api
      .get<AntecipacaoCarteiraDto>('/antecipacoes/carteira')
      .then((r) => r.data);
  },

  simularAntecipacao(
    payload: SimularAntecipacaoPayload,
  ): Promise<SimularAntecipacaoResultDto> {
    return api
      .post<SimularAntecipacaoResultDto>('/antecipacoes/simular', payload)
      .then((r) => r.data);
  },

  cederAntecipacao(id: string): Promise<AntecipacaoDto> {
    return api.post<AntecipacaoDto>(`/antecipacoes/${id}/ceder`).then((r) => r.data);
  },

  listarOrcamentosFinanceiros(
    params?: EscopoListagemParams,
  ): Promise<OrcamentoFinanceiroDto[]> {
    return api
      .get<OrcamentoFinanceiroDto[]>('/orcamentos-financeiros', { params })
      .then((r) => r.data);
  },

  criarOrcamentoFinanceiro(
    payload: CriarOrcamentoFinanceiroPayload,
  ): Promise<OrcamentoFinanceiroDto> {
    return api
      .post<OrcamentoFinanceiroDto>('/orcamentos-financeiros', payload)
      .then((r) => r.data);
  },

  editarOrcamentoFinanceiro(
    id: string,
    payload: EditarOrcamentoFinanceiroPayload,
  ): Promise<OrcamentoFinanceiroDto> {
    return api
      .put<OrcamentoFinanceiroDto>(`/orcamentos-financeiros/${id}`, payload)
      .then((r) => r.data);
  },

  obterDreOrcamento(id: string): Promise<DreOrcamentoDto> {
    return api
      .get<DreOrcamentoDto>(`/orcamentos-financeiros/${id}/dre`)
      .then((r) => r.data);
  },

  listarCotacoesMoeda(): Promise<CotacaoMoedaDto[]> {
    return api.get<CotacaoMoedaDto[]>('/cotacoes-moeda').then((r) => r.data);
  },

  criarCotacaoMoeda(payload: CriarCotacaoMoedaPayload): Promise<CotacaoMoedaDto> {
    return api.post<CotacaoMoedaDto>('/cotacoes-moeda', payload).then((r) => r.data);
  },

  atualizarCotacaoMoeda(
    id: string,
    payload: AtualizarCotacaoMoedaPayload,
  ): Promise<CotacaoMoedaDto> {
    return api
      .put<CotacaoMoedaDto>(`/cotacoes-moeda/${id}`, payload)
      .then((r) => r.data);
  },

  inativarCotacaoMoeda(id: string): Promise<void> {
    return api.post(`/cotacoes-moeda/${id}/inativar`).then(() => undefined);
  },

  sincronizarPtax(payload: SincronizarPtaxPayload = {}): Promise<CotacaoMoedaDto> {
    return api
      .post<CotacaoMoedaDto>('/cotacoes-moeda/sincronizar-ptax', payload)
      .then((r) => r.data);
  },

  obterExposicaoCambial(): Promise<ExposicaoCambialDto> {
    return api
      .get<ExposicaoCambialDto>('/financeiro/exposicao-cambial')
      .then((r) => r.data);
  },
};
