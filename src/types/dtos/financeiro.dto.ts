import type {
  ContaPagarStatusValor,
  ContaReceberStatusValor,
  EscopoFinanceiroValor,
  FormaPagamentoValor,
} from 'constants/enums';

export interface CondicaoPagamentoDto {
  id: string;
  empresaId: string;
  unidadeId: string;
  codigo: string;
  nome: string;
  numeroParcelas: number;
  intervaloDias: number;
  ativo: boolean;
}

export interface CriarCondicaoPagamentoPayload {
  nome: string;
  numeroParcelas: number;
  intervaloDias: number;
}

export interface EditarCondicaoPagamentoPayload {
  nome: string;
  numeroParcelas: number;
  intervaloDias: number;
}

export interface CondicaoPagamentoFormModel {
  nome: string;
  numeroParcelas: string;
  intervaloDias: string;
}

export interface FiltroEscopoFinanceiro {
  escopo?: EscopoFinanceiroValor;
  cnpjId?: string;
  unidadeId?: string;
  centroCustoId?: string;
}

export interface ContaReceberDto {
  id: string;
  empresaId: string;
  unidadeId: string;
  cnpjId?: string | null;
  clienteId: string;
  pedidoVendaId: string | null;
  parcela: number;
  valor: number;
  valorPago?: number | null;
  vencimento: string;
  status: ContaReceberStatusValor;
  formaPagamento: FormaPagamentoValor;
  centroCustoId?: string | null;
}

export interface ListarContasReceberParams extends FiltroEscopoFinanceiro {
  clienteId?: string;
  pedidoId?: string;
  status?: ContaReceberStatusValor;
}

export interface FormaBaixaReceberPayload {
  formaPagamento: FormaPagamentoValor;
  valor: number;
  contaBancariaId?: string | null;
}

export interface BaixarContaReceberPayload {
  valor?: number;
  formas?: FormaBaixaReceberPayload[];
  contaBancariaId?: string | null;
  dataPagamento?: string | null;
  juros?: number | null;
  multa?: number | null;
  observacao?: string | null;
}

export interface ContaPagarDto {
  id: string;
  empresaId: string;
  unidadeId: string;
  cnpjId?: string | null;
  fornecedorId: string;
  recebimentoCompraId: string | null;
  notaFiscalId: string | null;
  parcela: number;
  valor: number;
  valorPago?: number | null;
  vencimento: string;
  status: ContaPagarStatusValor;
  descricao: string | null;
  formaPagamento?: FormaPagamentoValor | null;
  centroCustoId?: string | null;
}

export interface ListarContasPagarParams extends FiltroEscopoFinanceiro {
  fornecedorId?: string;
  recebimentoId?: string;
  status?: ContaPagarStatusValor;
}

export interface BaixarContaPagarPayload {
  valor?: number;
  formaPagamento?: FormaPagamentoValor | null;
  contaBancariaId?: string | null;
  dataPagamento?: string | null;
  juros?: number | null;
  multa?: number | null;
  observacao?: string | null;
}

export interface BaixaContaPagarFormModel {
  valor: string;
  formaPagamento: FormaPagamentoValor | '';
  contaBancariaId: string;
  dataPagamento: string;
  juros: string;
  multa: string;
  observacao: string;
}

export interface FormaBaixaReceberFormModel {
  formaPagamento: FormaPagamentoValor | '';
  valor: string;
  contaBancariaId: string;
}

export interface BaixaContaReceberFormModel {
  valor: string;
  dataPagamento: string;
  juros: string;
  multa: string;
  observacao: string;
  formas: FormaBaixaReceberFormModel[];
}

export interface TaxaFormaPagamentoDto {
  id: string;
  parcelas: number;
  taxaPercentual: number;
  taxaFixa: number;
}

export interface ConfigFormaPagamentoDto {
  id: string;
  empresaId: string;
  unidadeId: string;
  formaPagamento: FormaPagamentoValor;
  repassarTaxaCliente: boolean;
  ativo: boolean;
  taxas: TaxaFormaPagamentoDto[];
}

export interface CriarConfigFormaPagamentoPayload {
  formaPagamento: FormaPagamentoValor;
  repassarTaxaCliente: boolean;
}

export interface EditarConfigFormaPagamentoPayload {
  repassarTaxaCliente: boolean;
}

export interface UpsertTaxaFormaPagamentoPayload {
  parcelas: number;
  taxaPercentual: number;
  taxaFixa: number;
}

export interface ConfigFormaPagamentoFormModel {
  formaPagamento: FormaPagamentoValor | '';
  repassarTaxaCliente: boolean;
}

export interface TaxaFormaPagamentoFormModel {
  parcelas: string;
  taxaPercentual: string;
  taxaFixa: string;
}
