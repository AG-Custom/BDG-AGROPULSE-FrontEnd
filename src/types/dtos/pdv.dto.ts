import type { PdvVendaStatusValor } from 'constants/enums';

export interface PdvVendaItemDto {
  id: string;
  produtoId: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export interface PdvVendaResumoDto {
  id: string;
  operadorUsuarioId: string;
  clienteId: string | null;
  valorTotal: number;
  status: PdvVendaStatusValor;
  createdAt: string;
}

export interface PdvVendaDto extends PdvVendaResumoDto {
  estoqueBaixado: boolean;
  canceladaEm: string | null;
  itens: PdvVendaItemDto[];
}

export interface PdvItemPayload {
  produtoId: string;
  quantidade: number;
  precoUnitario: number;
  numeroLote?: string | null;
  loteId?: string | null;
}

export interface VenderPdvPayload {
  itens: PdvItemPayload[];
  clienteId?: string | null;
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

export interface PdvVendaFormModel {
  clienteId: string;
  itens: PdvItemFormModel[];
}
