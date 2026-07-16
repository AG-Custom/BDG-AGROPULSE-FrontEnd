export interface HistoricoComercialItemDto {
  id: string;
  tipo: 'Pedido' | 'Orcamento' | 'Pdv' | 'Devolucao' | 'Negociacao' | string;
  referencia: string | null;
  status: string | null;
  valorTotal: number;
  data: string;
  observacao: string | null;
}

export interface HistoricoComercialDto {
  clienteId: string;
  itens: HistoricoComercialItemDto[];
}

export interface MetaVendedorDto {
  id: string;
  vendedorUsuarioId: string;
  vendedorNome?: string | null;
  ano: number;
  mes: number;
  valorMeta: number;
  valorRealizado: number | null;
  percentualAtingido: number | null;
}

export interface ListarMetasVendedorParams {
  ano?: number;
  mes?: number;
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
