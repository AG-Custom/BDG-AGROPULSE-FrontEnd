export interface PermissaoGranularDto {
  usuarioId: string;
  empresaId: string;
  editarProdutos: boolean;
  verCustos: boolean;
  ajustarEstoque: boolean;
  emitirNota: boolean;
  aprovarPedido: boolean;
}

export interface SalvarPermissaoGranularPayload {
  editarProdutos: boolean;
  verCustos: boolean;
  ajustarEstoque: boolean;
  emitirNota: boolean;
  aprovarPedido: boolean;
}

export type PermissaoGranularFormModel = SalvarPermissaoGranularPayload;
