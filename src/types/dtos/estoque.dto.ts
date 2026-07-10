import type {
  AtalhoPeriodoEstoqueValor,
  InventarioStatusValor,
  OrigemMovimentacaoEstoqueValor,
  TipoMovimentacaoEstoqueValor,
} from 'constants/enums';

export interface LoteDto {
  id: string;
  empresaId: string;
  unidadeId: string;
  produtoId: string;
  numeroLote: string;
  dataValidade: string | null;
  dataFabricacao: string | null;
  custoUnitario: number;
  quantidade: number;
  ativo: boolean;
}

export interface SaldoProdutoDto {
  produtoId: string;
  saldo: number;
}

export interface MovimentacaoEstoqueDto {
  id: string;
  empresaId: string;
  unidadeId: string;
  produtoId: string;
  loteId: string | null;
  tipo: TipoMovimentacaoEstoqueValor;
  origem: OrigemMovimentacaoEstoqueValor;
  referenciaId: string | null;
  quantidade: number;
  saldoProdutoApos: number;
  justificativa: string | null;
  ocorridoEm: string;
}

export interface EstoqueInicialStatusDto {
  id: string;
  empresaId: string;
  unidadeId: string;
  jaLancado: boolean;
  lancadoEm: string | null;
}

export interface InventarioItemDto {
  id: string;
  inventarioId: string;
  produtoId: string;
  quantidadeSistema: number;
  quantidadeContada: number | null;
  diferenca: number | null;
  ajustado: boolean;
}

export interface InventarioDto {
  id: string;
  empresaId: string;
  unidadeId: string;
  status: InventarioStatusValor;
  iniciadoEm: string;
  concluidoEm: string | null;
  itens: InventarioItemDto[];
}

export interface AlertaEstoqueMinimoDto {
  produtoId: string;
  saldo: number;
  estoqueMinimo: number;
}

export interface ReservaStatusDto {
  pedidoId: string;
  estoqueBaixado: boolean;
  baixadoEm: string | null;
  devolvidoEm: string | null;
}

export interface EntradaEstoquePayload {
  produtoId: string;
  numeroLote?: string | null;
  dataValidade?: string | null;
  dataFabricacao?: string | null;
  custoUnitario?: number | null;
  quantidade: number;
}

export interface SaidaEstoquePayload {
  produtoId: string;
  loteId?: string | null;
  quantidade: number;
}

export interface AjusteEstoquePayload {
  loteId: string;
  quantidadeNova: number;
  justificativa: string;
}

export interface LancarEstoqueInicialPayload {
  itens: EntradaEstoquePayload[];
}

export interface RegistrarContagemInventarioPayload {
  quantidadeContada: number;
}

export interface ReservarEstoquePedidoItemPayload {
  produtoId: string;
  quantidade: number;
}

export interface ReservarEstoquePedidoPayload {
  pedidoId: string;
  itens: ReservarEstoquePedidoItemPayload[];
}

export interface ListarLotesParams {
  produtoId?: string;
  apenasComSaldo?: boolean;
}

export interface ListarSaldosParams {
  produtoId?: string;
}

export interface ListarMovimentacoesParams {
  produtoId?: string;
  tipo?: TipoMovimentacaoEstoqueValor;
  de?: string;
  ate?: string;
  atalho?: AtalhoPeriodoEstoqueValor;
}

export interface ListarAlertasValidadeParams {
  dias?: number;
}

export interface EntradaEstoqueFormModel {
  produtoId: string;
  numeroLote: string;
  dataValidade: string;
  dataFabricacao: string;
  custoUnitario: string;
  quantidade: string;
}

export interface SaidaEstoqueFormModel {
  produtoId: string;
  loteId: string;
  quantidade: string;
  usarFefo: boolean;
}

export interface AjusteEstoqueFormModel {
  loteId: string;
  quantidadeNova: string;
  justificativa: string;
}

export interface ContagemInventarioFormModel {
  quantidadeContada: string;
}
