export type SolicitacaoCompraStatusValor = 'Aberta' | 'EmCotacao' | 'Atendida' | 'Cancelada';
export type CotacaoCompraStatusValor = 'Aberta' | 'EmResposta' | 'Encerrada' | 'Cancelada';
export type PedidoCompraStatusValor =
  | 'Rascunho'
  | 'Enviado'
  | 'RecebidoParcial'
  | 'Recebido'
  | 'Cancelado';

export interface SolicitacaoCompraItemDto {
  id: string;
  produtoId: string;
  quantidade: number;
}

export interface SolicitacaoCompraDto {
  id: string;
  solicitanteUsuarioId: string;
  status: SolicitacaoCompraStatusValor;
  observacao: string | null;
  createdAt: string;
  itens: SolicitacaoCompraItemDto[];
}

export interface ItemCotacaoDto {
  id: string;
  produtoId: string;
  quantidade: number;
}

export interface RespostaCotacaoDto {
  id: string;
  fornecedorId: string;
  itemCotacaoId: string;
  precoUnitario: number;
  prazoEntregaDias: number;
}

export interface CotacaoCompraDto {
  id: string;
  solicitacaoCompraId: string | null;
  dataLimite: string;
  status: CotacaoCompraStatusValor;
  observacao: string | null;
  createdAt: string;
  itens: ItemCotacaoDto[];
  respostas: RespostaCotacaoDto[];
}

export interface PedidoCompraItemDto {
  id: string;
  produtoId: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export interface PedidoCompraDto {
  id: string;
  fornecedorId: string;
  cotacaoCompraId: string | null;
  status: PedidoCompraStatusValor;
  valorTotal: number;
  observacao: string | null;
  createdAt: string;
  itens: PedidoCompraItemDto[];
}

export interface ItemQuantidadePayload {
  produtoId: string;
  quantidade: number;
}

export interface ItemPedidoCompraPayload {
  produtoId: string;
  quantidade: number;
  precoUnitario: number;
}

export interface CriarSolicitacaoCompraPayload {
  itens: ItemQuantidadePayload[];
  observacao?: string | null;
}

export interface CriarCotacaoCompraPayload {
  dataLimite: string;
  itens: ItemQuantidadePayload[];
  solicitacaoCompraId?: string | null;
  observacao?: string | null;
}

export interface ResponderCotacaoPayload {
  fornecedorId: string;
  itemCotacaoId: string;
  precoUnitario: number;
  prazoEntregaDias: number;
}

export interface CriarPedidoCompraPayload {
  fornecedorId: string;
  itens: ItemPedidoCompraPayload[];
  cotacaoCompraId?: string | null;
  observacao?: string | null;
}

export interface ListarSolicitacoesCompraParams {
  status?: SolicitacaoCompraStatusValor;
}

export interface ListarCotacoesCompraParams {
  status?: CotacaoCompraStatusValor;
}

export interface ListarPedidosCompraParams {
  status?: PedidoCompraStatusValor;
}
