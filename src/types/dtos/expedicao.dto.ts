import type { PedidoVendaStatusValor } from 'constants/enums';

export interface ExpedicaoPedidoDto {
  id: string;
  clienteId: string;
  vendedorUsuarioId: string;
  valorTotal: number;
  status: PedidoVendaStatusValor;
  aprovadoEm: string | null;
  createdAt: string;
}

export interface RomaneioLoteSugeridoDto {
  loteId: string;
  numeroLote: string | null;
  dataValidade: string | null;
  quantidadeDisponivel: number;
  quantidadeSugerida: number;
}

export interface RomaneioItemDto {
  produtoId: string;
  quantidade: number;
  lotesSugeridos: RomaneioLoteSugeridoDto[];
}

export interface RomaneioDto {
  pedidoId: string;
  clienteId: string;
  itens: RomaneioItemDto[];
}
