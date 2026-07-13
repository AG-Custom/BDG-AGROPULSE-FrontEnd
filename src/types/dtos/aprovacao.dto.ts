import type { TravaAprovacaoTipoValor } from 'constants/enums';

export interface TravaAprovacaoDto {
  tipo: TravaAprovacaoTipoValor;
  motivo: string;
}

export interface PedidoFilaAprovacaoDto {
  pedidoId: string;
  clienteId: string;
  vendedorUsuarioId: string;
  valorTotal: number;
  dataExpiracao: string | null;
  createdAt: string;
  travas: TravaAprovacaoDto[];
}
