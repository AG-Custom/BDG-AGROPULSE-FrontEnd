import type {
  DestinoCreditoDevolucaoValor,
  DestinoDevolucaoValor,
} from 'constants/enums';

export type DevolucaoVendaStatusValor = 'Pendente' | 'Processada' | 'Cancelada';

export interface ItemDevolucaoDto {
  id: string;
  produtoId: string;
  quantidade: number;
  destino: DestinoDevolucaoValor;
  loteId?: string | null;
  numeroLote?: string | null;
  justificativaDescarte?: string | null;
}

export interface DevolucaoVendaDto {
  id: string;
  pedidoVendaId: string;
  usuarioId: string;
  status: DevolucaoVendaStatusValor;
  observacao: string | null;
  processadaEm: string | null;
  createdAt: string;
  destinoCredito?: DestinoCreditoDevolucaoValor | null;
  notaFiscalNumero?: string | null;
  notaFiscalChave?: string | null;
  itens: ItemDevolucaoDto[];
}

export interface DevolucaoItemPayload {
  produtoId: string;
  quantidade: number;
  destino: DestinoDevolucaoValor;
  loteId?: string | null;
  numeroLote?: string | null;
  justificativaDescarte?: string | null;
}

export interface CriarDevolucaoVendaPayload {
  pedidoVendaId: string;
  itens: DevolucaoItemPayload[];
  observacao?: string | null;
  destinoCredito?: DestinoCreditoDevolucaoValor | null;
  notaFiscalNumero?: string | null;
  notaFiscalChave?: string | null;
}

export interface ListarDevolucoesVendaParams {
  pedidoVendaId?: string;
}

export interface BuscarOrigemDevolucaoParams {
  numeroNf?: string;
  chaveNf?: string;
  clienteId?: string;
}

export interface OrigemDevolucaoDto {
  pedidoVendaId: string;
  clienteId: string;
  clienteNome: string | null;
  notaFiscalNumero: string | null;
  notaFiscalChave: string | null;
  valorTotal: number;
  faturadoEm: string | null;
  itens: Array<{
    produtoId: string;
    quantidade: number;
    precoUnitario: number;
    loteId?: string | null;
    numeroLote?: string | null;
  }>;
}

export interface DevolucaoItemFormModel {
  chave: string;
  produtoId: string;
  quantidade: string;
  destino: DestinoDevolucaoValor | '';
  loteId: string;
  numeroLote: string;
  justificativaDescarte: string;
}

export interface DevolucaoVendaFormModel {
  pedidoVendaId: string;
  buscaNf: string;
  destinoCredito: DestinoCreditoDevolucaoValor | '';
  observacao: string;
  itens: DevolucaoItemFormModel[];
}
