export interface CurvaAbcLucratividadeItemDto {
  produtoId: string;
  produtoCodigo: string | null;
  produtoDescricao: string | null;
  quantidadeVendida: number;
  receita: number;
  custoEstimado: number;
  lucro: number;
  participacaoReceitaPercentual: number;
  classeAbc: string;
}

export interface ComissaoRepasseItemDto {
  produtoId: string;
  produtoCodigo: string | null;
  produtoDescricao: string | null;
  vendedorUsuarioId: string;
  quantidadeVendida: number;
  valorVendido: number;
  valorComissao: number;
}

export interface CurvaAbcLucratividadeParams {
  dias?: number;
  produtoId?: string;
}

export interface ComissoesRepasseParams {
  produtoId?: string;
}

export interface GiroEstoqueItemDto {
  produtoId: string;
  quantidadeSaida: number;
  saldoAtual: number;
  estoqueMedio: number;
  giro: number;
}

export interface GiroEstoqueParams {
  dataInicio?: string;
  dataFim?: string;
  unidadeId?: string;
  produtoId?: string;
}
