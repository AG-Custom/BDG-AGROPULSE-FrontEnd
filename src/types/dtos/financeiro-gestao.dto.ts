import type {
  EscopoFinanceiroValor,
  PeriodoFluxoCaixaValor,
  StatusAntecipacaoValor,
  StatusAplicacaoValor,
  StatusBoletoValor,
  StatusChequeValor,
  StatusRenegociacaoValor,
  StatusTransferenciaValor,
  TipoAplicacaoValor,
  TipoChequeValor,
  TipoContaBancariaValor,
  VersaoOrcamentoFinanceiroValor,
} from 'constants/enums';
import type { FiltroEscopoFinanceiro } from 'types/dtos/financeiro.dto';

export interface ContaBancariaDto {
  id: string;
  empresaId: string;
  cnpjId: string | null;
  unidadeId: string | null;
  banco: string;
  agencia: string;
  conta: string;
  tipo: TipoContaBancariaValor;
  saldoAtual: number;
  saldoMinimo: number;
  ativo: boolean;
  abaixoSaldoMinimo: boolean;
}

export interface ContaBancariaFormModel {
  cnpjId: string;
  unidadeId: string;
  banco: string;
  agencia: string;
  conta: string;
  tipo: TipoContaBancariaValor | '';
  saldoAtual: string;
  saldoMinimo: string;
}

export interface CriarContaBancariaPayload {
  cnpjId?: string | null;
  unidadeId?: string | null;
  banco: string;
  agencia: string;
  conta: string;
  tipo: TipoContaBancariaValor;
  saldoAtual: number;
  saldoMinimo: number;
}

export interface EditarContaBancariaPayload {
  cnpjId?: string | null;
  unidadeId?: string | null;
  banco: string;
  agencia: string;
  conta: string;
  tipo: TipoContaBancariaValor;
  saldoMinimo: number;
}

export interface CaixaDto {
  id: string;
  empresaId: string;
  unidadeId: string;
  nome: string;
  saldoAtual: number;
  ativo: boolean;
}

export interface CaixaFormModel {
  nome: string;
  unidadeId: string;
}

export interface CriarCaixaPayload {
  nome: string;
  unidadeId?: string | null;
}

export interface EditarCaixaPayload {
  nome: string;
  ativo: boolean;
}

export interface CentroCustoDto {
  id: string;
  empresaId: string;
  unidadeId: string | null;
  codigo: string;
  nome: string;
  ativo: boolean;
}

export interface CentroCustoFormModel {
  nome: string;
  unidadeId: string;
}

export interface CriarCentroCustoPayload {
  nome: string;
  unidadeId?: string | null;
}

export interface EditarCentroCustoPayload {
  nome: string;
  ativo: boolean;
}

export interface TransferenciaFinanceiraDto {
  id: string;
  empresaId: string;
  origemContaBancariaId: string | null;
  origemCaixaId: string | null;
  destinoContaBancariaId: string | null;
  destinoCaixaId: string | null;
  valor: number;
  data: string;
  status: StatusTransferenciaValor;
  observacao: string | null;
}

export interface TransferenciaFormModel {
  origemContaBancariaId: string;
  origemCaixaId: string;
  destinoContaBancariaId: string;
  destinoCaixaId: string;
  valor: string;
  data: string;
  observacao: string;
}

export interface CriarTransferenciaPayload {
  origemContaBancariaId?: string | null;
  origemCaixaId?: string | null;
  destinoContaBancariaId?: string | null;
  destinoCaixaId?: string | null;
  valor: number;
  data: string;
  observacao?: string | null;
}

export interface ChequeDto {
  id: string;
  empresaId: string;
  unidadeId: string;
  tipo: TipoChequeValor;
  numero: string;
  banco: string;
  agencia: string;
  valor: number;
  bomPara: string;
  status: StatusChequeValor;
  emitente: string | null;
  contaBancariaId: string | null;
  observacao: string | null;
}

export interface ChequeFormModel {
  tipo: TipoChequeValor | '';
  numero: string;
  banco: string;
  agencia: string;
  valor: string;
  bomPara: string;
  emitente: string;
  contaBancariaId: string;
  observacao: string;
}

export interface CriarChequePayload {
  tipo: TipoChequeValor;
  numero: string;
  banco: string;
  agencia: string;
  valor: number;
  bomPara: string;
  emitente?: string | null;
  contaBancariaId?: string | null;
  observacao?: string | null;
}

export interface ListarChequesParams extends FiltroEscopoFinanceiro {
  status?: StatusChequeValor;
  tipo?: TipoChequeValor;
}

export interface FluxoCaixaItemDto {
  data: string;
  entradasPrevistas: number;
  saidasPrevistas: number;
  saldoProjetado: number;
}

export interface FluxoCaixaDto {
  periodo: PeriodoFluxoCaixaValor;
  dias: number;
  saldoContas: number;
  saldoCaixas: number;
  itens: FluxoCaixaItemDto[];
  stub: boolean;
  mensagemStub: string | null;
}

export interface ListarFluxoCaixaParams extends FiltroEscopoFinanceiro {
  periodo?: PeriodoFluxoCaixaValor;
  dias?: number;
}

export interface TesourariaSaldoIntradayDto {
  contas: ContaBancariaDto[];
  stub: boolean;
  mensagem: string;
}

export interface TesourariaProjecaoItemDto {
  data: string;
  entradasPrevistas: number;
  saidasPrevistas: number;
  saldoProjetado: number;
}

export interface TesourariaProjecaoDto {
  dias: number;
  itens: TesourariaProjecaoItemDto[];
  stub: boolean;
  mensagem: string;
}

export interface AplicacaoFinanceiraDto {
  id: string;
  empresaId: string;
  contaBancariaId: string;
  tipo: TipoAplicacaoValor;
  descricao: string;
  valorAplicado: number;
  taxa: number;
  dataAplicacao: string;
  dataVencimento: string | null;
  status: StatusAplicacaoValor;
}

export interface AplicacaoFormModel {
  contaBancariaId: string;
  tipo: TipoAplicacaoValor | '';
  descricao: string;
  valorAplicado: string;
  dataAplicacao: string;
  dataVencimento: string;
  taxa: string;
}

export interface CriarAplicacaoPayload {
  contaBancariaId: string;
  tipo: TipoAplicacaoValor;
  descricao: string;
  valorAplicado: number;
  taxa: number;
  dataAplicacao: string;
  dataVencimento?: string | null;
}

export interface ResgatarAplicacaoPayload {
  valor?: number | null;
  dataResgate?: string | null;
}

export interface ConciliacaoOfxResultDto {
  id: string;
  contaBancariaId: string;
  importadoEm: string;
  lancamentos: ConciliacaoLancamentoDto[];
  stub?: boolean;
  mensagem?: string | null;
}

export interface ConciliacaoLancamentoDto {
  id: string;
  data: string;
  valor: number;
  descricao: string;
  vinculado: boolean;
  contaPagarId: string | null;
  contaReceberId: string | null;
  proposto: boolean;
}

export interface VincularConciliacaoPayload {
  lancamentoId: string;
  contaPagarId?: string | null;
  contaReceberId?: string | null;
}

export interface ProporLancamentosPayload {
  conciliacaoId: string;
}

export interface BoletoDto {
  id: string;
  empresaId: string;
  unidadeId: string;
  contaReceberId: string;
  nossoNumero: string | null;
  linhaDigitavel: string | null;
  valor: number;
  vencimento: string;
  status: StatusBoletoValor;
  stub?: boolean;
}

export interface EmitirBoletoPayload {
  contaReceberId: string;
  contaBancariaId?: string | null;
}

export interface RemessaBoletoPayload {
  boletoIds: string[];
}

export interface RemessaBoletoResultDto {
  arquivo: string;
  quantidade: number;
  stub?: boolean;
  mensagem?: string | null;
}

export interface RetornoBoletoResultDto {
  processados: number;
  pagos: number;
  rejeitados: number;
  stub?: boolean;
  mensagem?: string | null;
}

export interface ReguaCobrancaEtapaDto {
  diasAtraso: number;
  avisoGerente: boolean;
  avisoVendedor: boolean;
  bloquearPedidos: boolean;
}

export interface ReguaCobrancaConfigDto {
  id: string;
  empresaId: string;
  ativo: boolean;
  etapas: ReguaCobrancaEtapaDto[];
}

export interface ReguaCobrancaConfigFormModel {
  ativo: boolean;
  etapas: Array<{
    diasAtraso: string;
    avisoGerente: boolean;
    avisoVendedor: boolean;
    bloquearPedidos: boolean;
  }>;
}

export interface UpsertReguaCobrancaConfigPayload {
  ativo: boolean;
  etapas: ReguaCobrancaEtapaDto[];
}

export interface ReguaCobrancaPainelItemDto {
  clienteId: string;
  clienteNome: string;
  diasAtraso: number;
  valorEmAberto: number;
  etapaAtual: number | null;
  ultimoAvisoEm: string | null;
}

export interface ReguaCobrancaPainelDto {
  itens: ReguaCobrancaPainelItemDto[];
  processadoEm: string | null;
}

export interface RenegociacaoDto {
  id: string;
  empresaId: string;
  unidadeId: string;
  clienteId: string;
  contasReceberIds: string[];
  valorOriginal: number;
  valorMora: number;
  valorMulta: number;
  valorTotal: number;
  numeroParcelas: number;
  status: StatusRenegociacaoValor;
  observacao: string | null;
  criadoEm: string;
}

export interface RenegociacaoFormModel {
  clienteId: string;
  contasReceberIds: string[];
  valorMora: string;
  valorMulta: string;
  numeroParcelas: string;
  observacao: string;
}

export interface CriarRenegociacaoPayload {
  clienteId: string;
  contasReceberIds: string[];
  valorMora?: number | null;
  valorMulta?: number | null;
  numeroParcelas: number;
  observacao?: string | null;
}

export interface AntecipacaoCarteiraItemDto {
  contaReceberId: string;
  clienteId: string;
  valor: number;
  vencimento: string;
  elegivel: boolean;
}

export interface AntecipacaoCarteiraDto {
  itens: AntecipacaoCarteiraItemDto[];
  valorTotal: number;
}

export interface AntecipacaoDto {
  id: string;
  empresaId: string;
  unidadeId: string;
  contasReceberIds: string[];
  valorBruto: number;
  desagioPercentual: number;
  valorLiquido: number;
  status: StatusAntecipacaoValor;
  criadoEm: string;
}

export interface SimularAntecipacaoPayload {
  contasReceberIds: string[];
  desagioPercentual: number;
}

export interface SimularAntecipacaoResultDto {
  valorBruto: number;
  desagioPercentual: number;
  valorLiquido: number;
  contasReceberIds: string[];
}

export interface OrcamentoFinanceiroDto {
  id: string;
  empresaId: string;
  unidadeId: string | null;
  ano: number;
  versao: VersaoOrcamentoFinanceiroValor;
  descricao: string;
  ativo: boolean;
}

export interface OrcamentoFinanceiroFormModel {
  ano: string;
  versao: VersaoOrcamentoFinanceiroValor | '';
  descricao: string;
  unidadeId: string;
}

export interface CriarOrcamentoFinanceiroPayload {
  ano: number;
  versao: VersaoOrcamentoFinanceiroValor;
  descricao: string;
  unidadeId?: string | null;
}

export interface EditarOrcamentoFinanceiroPayload {
  descricao: string;
  ativo: boolean;
}

export interface DreLinhaDto {
  conta: string;
  orcado: number;
  realizado: number;
  variacaoPercentual: number;
  alerta80: boolean;
  alerta100: boolean;
}

export interface DreOrcamentoDto {
  orcamentoId: string;
  linhas: DreLinhaDto[];
  totalOrcado: number;
  totalRealizado: number;
}

export type OrigemCotacaoMoeda = 'Manual' | 'Bacen';

export interface CotacaoMoedaDto {
  id: string;
  empresaId?: string;
  moeda: string;
  data: string;
  taxaCompra: number;
  taxaVenda: number;
  taxaPtax?: number;
  origem?: OrigemCotacaoMoeda;
  fonte: string | null;
}

export interface CotacaoMoedaFormModel {
  moeda: string;
  data: string;
  taxaCompra: string;
  taxaVenda: string;
}

export interface CriarCotacaoMoedaPayload {
  moeda: string;
  data: string;
  taxaCompra: number;
  taxaVenda: number;
}

export interface AtualizarCotacaoMoedaPayload {
  taxaCompra: number;
  taxaVenda: number;
}

export interface SincronizarPtaxPayload {
  moeda?: string;
  data?: string;
}

export interface ExposicaoCambialItemDto {
  moeda: string;
  valorExposto: number;
  valorEmReais: number;
  variacaoCambial: number;
  taxa?: number;
}

export interface ExposicaoCambialDto {
  itens: ExposicaoCambialItemDto[];
  totalExpostoReais: number;
  cotacaoPendente?: boolean;
  mensagem?: string | null;
}

export type EscopoListagemParams = FiltroEscopoFinanceiro & {
  escopo?: EscopoFinanceiroValor;
};
