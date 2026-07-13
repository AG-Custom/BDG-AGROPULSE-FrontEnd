import type { DestinoDevolucaoValor } from 'constants/enums';

export type DevolucaoVendaStatusValor = 'Pendente' | 'Processada' | 'Cancelada';

export interface ItemDevolucaoDto {
  id: string;
  produtoId: string;
  quantidade: number;
  destino: DestinoDevolucaoValor;
}

export interface DevolucaoVendaDto {
  id: string;
  pedidoVendaId: string;
  usuarioId: string;
  status: DevolucaoVendaStatusValor;
  observacao: string | null;
  processadaEm: string | null;
  createdAt: string;
  itens: ItemDevolucaoDto[];
}

export interface DevolucaoItemPayload {
  produtoId: string;
  quantidade: number;
  destino: DestinoDevolucaoValor;
}

export interface CriarDevolucaoVendaPayload {
  pedidoVendaId: string;
  itens: DevolucaoItemPayload[];
  observacao?: string | null;
}

export interface ListarDevolucoesVendaParams {
  pedidoVendaId?: string;
}

export interface DevolucaoItemFormModel {
  chave: string;
  produtoId: string;
  quantidade: string;
  destino: DestinoDevolucaoValor | '';
}

export interface DevolucaoVendaFormModel {
  pedidoVendaId: string;
  observacao: string;
  itens: DevolucaoItemFormModel[];
}
