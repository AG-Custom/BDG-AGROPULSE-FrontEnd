import type {
  DreVisaoValor,
  ExportacaoFormatoValor,
  RentabilidadeDimensaoValor,
} from 'constants/enums';

export interface CurvaAbcLucratividadeItemDto {
  produtoId: string;
  produtoCodigo: string | null;
  produtoDescricao: string | null;
  quantidadeVendida: number;
  receita: number;
  custoEstimado: number | null;
  lucro: number | null;
  participacaoReceitaPercentual: number;
  classeAbc: string;
  verCustos: boolean;
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
  dimensao?: string;
  exportar?: ExportacaoFormatoValor;
}

export interface ComissoesRepasseParams {
  produtoId?: string;
  exportar?: ExportacaoFormatoValor;
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
  exportar?: ExportacaoFormatoValor;
}

export interface DashboardKpisDto {
  faturamento: number;
  custoMercadoria: number | null;
  lucroBruto: number | null;
  margemPercentual: number | null;
  totalAReceber: number;
  totalAPagar: number;
  saldoPrevisto: number;
  inadimplenciaValor: number;
  inadimplenciaPercentual: number;
  estoqueItensAbaixoMinimo: number;
  metaAtingimentoPercentual: number | null;
  periodoDias: number;
  verCustos: boolean;
}

export interface DashboardParams {
  dias?: number;
}

export interface MargemPorLoteItemDto {
  loteId: string;
  numeroLote: string;
  produtoId: string;
  produtoCodigo: string | null;
  produtoDescricao: string | null;
  quantidadeVendida: number;
  receita: number;
  custoLote: number | null;
  lucro: number | null;
  margemPercentual: number | null;
  verCustos: boolean;
}

export interface MargemPorLoteParams {
  dias?: number;
  produtoId?: string;
  loteId?: string;
  exportar?: ExportacaoFormatoValor;
}

export interface DreDto {
  receitaBruta: number;
  custoMercadoriaVendida: number | null;
  lucroBruto: number | null;
  margemBrutaPercentual: number | null;
  despesasVariaveis: number;
  totalComissoes: number;
  lucroLiquido: number | null;
  margemLiquidaPercentual: number | null;
  totalPedidosFaturados: number;
  ticketMedio: number;
  mes: number;
  ano: number;
  visao: DreVisaoValor | string;
  verCustos: boolean;
}

export interface DreParams {
  mes?: number;
  ano?: number;
  visao?: DreVisaoValor;
  unidadeId?: string;
  cnpjEmpresaId?: string;
}

export interface RankingUnidadeItemDto {
  unidadeId: string;
  unidadeNome: string;
  faturamento: number;
  margemPercentual: number | null;
  inadimplenciaValor: number;
  ticketMedio: number;
  metaAtingimentoPercentual: number | null;
  verCustos: boolean;
}

export interface RankingUnidadesParams {
  dias?: number;
  exportar?: ExportacaoFormatoValor;
}

export interface RentabilidadeItemDto {
  chave: string;
  nome: string;
  receita: number;
  custo: number | null;
  lucro: number | null;
  margemPercentual: number | null;
  participacaoReceitaPercentual: number;
  verCustos: boolean;
}

export interface RentabilidadeParams {
  dimensao?: RentabilidadeDimensaoValor;
  dias?: number;
  exportar?: ExportacaoFormatoValor;
}

export interface AgingBucketDto {
  quantidade: number;
  total: number;
}

export interface InadimplenciaPorVendedorDto {
  vendedorUsuarioId: string;
  total: number;
  quantidade: number;
}

export interface InadimplenciaDto {
  totalInadimplente: number;
  percentualInadimplencia: number;
  de1a15: AgingBucketDto;
  de16a30: AgingBucketDto;
  de31a60: AgingBucketDto;
  de61a90: AgingBucketDto;
  acima90: AgingBucketDto;
  porVendedor: InadimplenciaPorVendedorDto[];
  porCliente: InadimplenciaClienteRiscoDto[];
}

export interface InadimplenciaClienteRiscoDto {
  clienteId: string;
  clienteNome: string;
  saldoInadimplente: number;
  maiorAtrasoDias: number;
  limiteCredito: number;
  utilizado: number;
  disponivel: number;
  comprometimentoPct: number;
}

export interface RelatorioBarterItemDto {
  contratoId: string;
  clienteId: string;
  clienteNome: string;
  status: string;
  valorInsumos: number;
  quantidadeGrao: number;
  saldoGrao: number;
  ajusteFinanceiro: number | null;
  valorFinanceiro: number | null;
  safraId: string | null;
}

export interface RelatorioBarterDto {
  valorInsumosTotal: number;
  quantidadeGraoTotal: number;
  saldoGraoTotal: number;
  ajusteFinanceiroTotal: number;
  valorFinanceiroTotal: number;
  quantidadeContratos: number;
  contratos: RelatorioBarterItemDto[];
}

export interface DespesaCentroCustoItemDto {
  centroCustoId: string | null;
  codigo: string;
  nome: string;
  valorPago: number;
  quantidadeTitulos: number;
}

export interface ContasFinanceirasFaixaDto {
  quantidade: number;
  valor: number;
  saldo: number;
}

export interface ContasFinanceirasBlocoDto {
  aberto: ContasFinanceirasFaixaDto;
  baixado: ContasFinanceirasFaixaDto;
  renegociado: ContasFinanceirasFaixaDto;
}

export interface ContasFinanceirasDto {
  receber: ContasFinanceirasBlocoDto;
  pagar: ContasFinanceirasBlocoDto;
}

export interface DesempenhoEquipeItemDto {
  vendedorUsuarioId: string;
  faturamento: number;
  pedidosFaturados: number;
  pedidosTotais: number;
  conversaoPercentual: number;
  ticketMedio: number;
  valorComissao: number;
  valorMeta: number | null;
  atingimentoMetaPercentual: number | null;
}

export interface DesempenhoEquipeParams {
  mes?: number;
  ano?: number;
  exportar?: ExportacaoFormatoValor;
}

export interface AlertaGerencialDto {
  tipo: string;
  severidade: string;
  titulo: string;
  descricao: string;
  referenciaId: string | null;
  linkSugerido: string | null;
}
