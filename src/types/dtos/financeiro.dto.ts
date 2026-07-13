import type {
  ContaPagarStatusValor,
  ContaReceberStatusValor,
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

export interface ContaReceberDto {
  id: string;
  empresaId: string;
  unidadeId: string;
  clienteId: string;
  pedidoVendaId: string;
  parcela: number;
  valor: number;
  vencimento: string;
  status: ContaReceberStatusValor;
  formaPagamento: FormaPagamentoValor;
}

export interface ListarContasReceberParams {
  clienteId?: string;
  pedidoId?: string;
  status?: ContaReceberStatusValor;
}

export interface ContaPagarDto {
  id: string;
  empresaId: string;
  unidadeId: string;
  fornecedorId: string;
  recebimentoCompraId: string | null;
  notaFiscalId: string | null;
  parcela: number;
  valor: number;
  vencimento: string;
  status: ContaPagarStatusValor;
  descricao: string | null;
}

export interface ListarContasPagarParams {
  fornecedorId?: string;
  recebimentoId?: string;
  status?: ContaPagarStatusValor;
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
