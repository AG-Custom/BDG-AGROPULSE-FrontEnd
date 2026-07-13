import type { FormaPagamentoValor, PedidoVendaStatusValor, ExportacaoPedidoFormatoValor } from 'constants/enums';

export interface PedidoVendaItemDto {
  id: string;
  produtoId: string;
  quantidade: number;
  precoUnitario: number;
  descontoPercentual: number;
  comissaoPercentual: number;
  valorComissao: number;
  subtotal: number;
}

export interface PedidoVendaResumoDto {
  id: string;
  empresaId: string;
  unidadeId: string;
  clienteId: string;
  vendedorUsuarioId: string;
  condicaoPagamentoId: string;
  formaPagamento: FormaPagamentoValor;
  numeroParcelas: number;
  intervaloDias: number;
  valorTotal: number;
  status: PedidoVendaStatusValor;
  dataExpiracao: string | null;
  estoqueBaixado: boolean;
  observacao: string | null;
  createdAt: string;
}

export interface PedidoVendaDto extends PedidoVendaResumoDto {
  motivoRecusa: string | null;
  aprovadoEm: string | null;
  recusadoEm: string | null;
  expiradoEm: string | null;
  faturadoEm: string | null;
  itens: PedidoVendaItemDto[];
}

export interface PedidoVendaItemPayload {
  produtoId: string;
  quantidade: number;
  precoUnitario: number;
  descontoPercentual?: number;
}

export interface CriarPedidoVendaPayload {
  clienteId: string;
  vendedorUsuarioId?: string | null;
  condicaoPagamentoId: string;
  formaPagamento: FormaPagamentoValor;
  observacao?: string | null;
  itens: PedidoVendaItemPayload[];
}

export type EditarPedidoVendaPayload = CriarPedidoVendaPayload;

export interface RecusarPedidoVendaPayload {
  motivo?: string | null;
}

export interface PedidoVendaItemFormModel {
  chave: string;
  produtoId: string;
  quantidade: string;
  precoUnitario: string;
  descontoPercentual: string;
}

export interface PedidoVendaFormModel {
  clienteId: string;
  vendedorUsuarioId: string;
  condicaoPagamentoId: string;
  formaPagamento: FormaPagamentoValor | '';
  observacao: string;
  itens: PedidoVendaItemFormModel[];
}

export interface ListarPedidosVendaParams {
  de?: string;
  ate?: string;
  clienteId?: string;
  status?: PedidoVendaStatusValor;
  vendedorId?: string;
  exportar?: ExportacaoPedidoFormatoValor;
}
