import type { FormaPagamentoValor, OrcamentoStatusValor } from 'constants/enums';

export interface OrcamentoItemDto {
  id: string;
  produtoId: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export interface OrcamentoResumoDto {
  id: string;
  clienteId: string;
  vendedorUsuarioId: string;
  valorTotal: number;
  status: OrcamentoStatusValor;
  pedidoVendaId: string | null;
  tabelaPrecoId?: string | null;
  createdAt: string;
}

export interface OrcamentoDto extends OrcamentoResumoDto {
  observacao: string | null;
  convertidoEm: string | null;
  itens: OrcamentoItemDto[];
}

export interface OrcamentoItemPayload {
  produtoId: string;
  quantidade: number;
  precoUnitario?: number | null;
}

export interface CriarOrcamentoPayload {
  clienteId: string;
  vendedorUsuarioId?: string | null;
  tabelaPrecoId?: string | null;
  itens: OrcamentoItemPayload[];
  observacao?: string | null;
}

export type EditarOrcamentoPayload = CriarOrcamentoPayload;

export interface ConverterOrcamentoPayload {
  condicaoPagamentoId: string;
  formaPagamento: FormaPagamentoValor;
}

export interface ListarOrcamentosParams {
  status?: OrcamentoStatusValor;
  clienteId?: string;
}

export interface OrcamentoItemFormModel {
  chave: string;
  produtoId: string;
  quantidade: string;
  precoUnitario: string;
}

export interface OrcamentoFormModel {
  clienteId: string;
  vendedorUsuarioId: string;
  tabelaPrecoId: string;
  observacao: string;
  itens: OrcamentoItemFormModel[];
}
