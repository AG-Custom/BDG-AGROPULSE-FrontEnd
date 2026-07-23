import type { FormaPagamentoValor, PdvVendaStatusValor } from 'constants/enums';

export interface PdvVendaItemDto {
  id: string;
  produtoId: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export interface PdvPagamentoDto {
  formaPagamento: FormaPagamentoValor;
  valor: number;
}

export interface PdvVendaResumoDto {
  id: string;
  operadorUsuarioId: string;
  clienteId: string | null;
  clienteNomeAvulso?: string | null;
  clienteDocumentoAvulso?: string | null;
  valorTotal: number;
  status: PdvVendaStatusValor;
  tabelaPrecoId?: string | null;
  aPrazo?: boolean;
  troco?: number | null;
  createdAt: string;
}

export interface PdvVendaDto extends PdvVendaResumoDto {
  estoqueBaixado: boolean;
  canceladaEm: string | null;
  itens: PdvVendaItemDto[];
  pagamentos?: PdvPagamentoDto[];
  nfceId?: string | null;
}

export interface PdvItemPayload {
  produtoId: string;
  quantidade: number;
  precoUnitario?: number | null;
  numeroLote?: string | null;
  loteId?: string | null;
}

export interface PdvPagamentoPayload {
  formaPagamento: FormaPagamentoValor;
  valor: number;
}

export interface VenderPdvPayload {
  itens: PdvItemPayload[];
  clienteId?: string | null;
  clienteNomeAvulso?: string | null;
  clienteDocumentoAvulso?: string | null;
  tabelaPrecoId?: string | null;
  aPrazo?: boolean;
  pagamentos?: PdvPagamentoPayload[];
}

export interface ListarPdvVendasParams {
  status?: PdvVendaStatusValor;
}

export interface PdvItemFormModel {
  chave: string;
  produtoId: string;
  quantidade: string;
  precoUnitario: string;
  numeroLote: string;
  loteId: string;
}

export interface PdvPagamentoFormModel {
  chave: string;
  formaPagamento: FormaPagamentoValor | '';
  valor: string;
}

export interface PdvVendaFormModel {
  clienteId: string;
  clienteBusca: string;
  clienteNomeAvulso: string;
  clienteDocumentoAvulso: string;
  tabelaPrecoId: string;
  aPrazo: boolean;
  codigoBarras: string;
  itens: PdvItemFormModel[];
  pagamentos: PdvPagamentoFormModel[];
}

export interface EmitirNfcePdvDto {
  mensagem: string;
  notaFiscalId?: string | null;
  status?: string | null;
  chaveAcesso?: string | null;
  focusReferencia?: string | null;
}
