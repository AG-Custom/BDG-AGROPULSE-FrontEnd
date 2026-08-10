export interface HistoricoComercialItemDto {
  id: string;
  tipo: 'Pedido' | 'Orcamento' | 'Pdv' | 'Devolucao' | 'Negociacao' | string;
  data: string;
  valor: number;
  status: string;
}

export type HistoricoComercialDto = HistoricoComercialItemDto[];

export const TipoMetaVendedor = {
  Valor: 'Valor',
  Produto: 'Produto',
} as const;

export type TipoMetaVendedorValor = (typeof TipoMetaVendedor)[keyof typeof TipoMetaVendedor];

export const TipoMetaVendedorOpcoes = [
  { label: 'Por valor (R$)', value: TipoMetaVendedor.Valor },
  { label: 'Por produto (quantidade)', value: TipoMetaVendedor.Produto },
] as const;

export const EscopoMetaVendedor = {
  Unidade: 'Unidade',
  Vendedor: 'Vendedor',
} as const;

export type EscopoMetaVendedorValor =
  (typeof EscopoMetaVendedor)[keyof typeof EscopoMetaVendedor];

export const EscopoMetaVendedorOpcoes = [
  { label: 'Unidade (toda a loja/filial)', value: EscopoMetaVendedor.Unidade },
  { label: 'Vendedor específico', value: EscopoMetaVendedor.Vendedor },
] as const;

export interface MetaVendedorDto {
  id: string;
  empresaId: string;
  unidadeId: string;
  vendedorUsuarioId: string | null;
  periodoInicio: string;
  periodoFim: string;
  tipo: TipoMetaVendedorValor | string;
  valorMeta: number;
  produtoId: string | null;
  quantidadeMeta: number | null;
}

export interface MetaVendedorFormModel {
  escopo: EscopoMetaVendedorValor;
  vendedorUsuarioId: string;
  periodoInicio: string;
  periodoFim: string;
  tipo: TipoMetaVendedorValor;
  valorMeta: string;
  produtoId: string;
  quantidadeMeta: string;
}

export interface MetaVendedorPayload {
  vendedorUsuarioId?: string | null;
  periodoInicio: string;
  periodoFim: string;
  tipo: TipoMetaVendedorValor;
  valorMeta?: number | null;
  produtoId?: string | null;
  quantidadeMeta?: number | null;
}

export interface ListarMetasVendedorParams {
  vendedorUsuarioId?: string;
}

export interface RepresentanteDto {
  id: string;
  nome: string;
  documento: string | null;
  telefone: string | null;
  email: string | null;
  ativo: boolean;
  usuarioId: string | null;
}

export interface ListarRepresentantesParams {
  ativo?: boolean;
  busca?: string;
}
