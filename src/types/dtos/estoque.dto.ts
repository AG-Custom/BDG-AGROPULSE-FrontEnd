import type {
  AtalhoPeriodoEstoqueValor,
  InventarioStatusValor,
  NivelLocalEstoqueValor,
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
  deposito: string | null;
  galpao: string | null;
  corredor: string | null;
  prateleira: string | null;
  localEstoqueId: string | null;
  notaFiscalOrigemId: string | null;
  ativo: boolean;
}

export interface LocalEstoqueDto {
  id: string;
  empresaId: string;
  unidadeId: string;
  parentId: string | null;
  nivel: NivelLocalEstoqueValor;
  codigo: string;
  nome: string;
  ativo: boolean;
  caminho: string;
}

export interface LocalEstoqueNoDto extends LocalEstoqueDto {
  filhos: LocalEstoqueNoDto[];
}

export interface CriarLocalEstoquePayload {
  parentId?: string | null;
  nivel: NivelLocalEstoqueValor;
  codigo: string;
  nome: string;
}

export interface EditarLocalEstoquePayload {
  codigo: string;
  nome: string;
}

export interface ListarLocaisEstoqueParams {
  ativo?: boolean;
  nivel?: NivelLocalEstoqueValor;
  parentId?: string;
  apenasRaizes?: boolean;
  formato?: 'flat' | 'tree';
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
  categoriaProdutoId: string | null;
  deposito: string | null;
  galpao: string | null;
  corredor: string | null;
  prateleira: string | null;
  localEstoqueId: string | null;
  itens: InventarioItemDto[];
}

export interface AlertaEstoqueMinimoDto {
  produtoId: string;
  saldo: number;
  estoqueMinimo: number;
}

export interface AlertaEstoqueZeradoDto {
  produtoId: string;
  saldo: number;
}

export interface TransferenciaEstoqueItemDto {
  id: string;
  transferenciaId: string;
  produtoId: string;
  loteOrigemId: string | null;
  numeroLote: string | null;
  quantidade: number;
  custoUnitario: number;
}

export interface TransferenciaEstoqueDto {
  id: string;
  empresaId: string;
  unidadeOrigemId: string;
  unidadeDestinoId: string;
  status: string;
  justificativa: string | null;
  notaFiscalId: string | null;
  itens: TransferenciaEstoqueItemDto[];
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
  deposito?: string | null;
  galpao?: string | null;
  corredor?: string | null;
  prateleira?: string | null;
  localEstoqueId?: string | null;
  notaFiscalOrigemId?: string | null;
}

export interface SaidaEstoquePayload {
  produtoId: string;
  loteId?: string | null;
  quantidade: number;
  motivo?: OrigemMovimentacaoEstoqueValor | null;
  justificativa?: string | null;
}

export interface IniciarInventarioPayload {
  categoriaProdutoId?: string | null;
  deposito?: string | null;
  galpao?: string | null;
  corredor?: string | null;
  prateleira?: string | null;
  localEstoqueId?: string | null;
}

export interface CriarTransferenciaEstoquePayload {
  unidadeDestinoId: string;
  justificativa?: string | null;
  itens: Array<{
    produtoId: string;
    quantidade: number;
    loteId?: string | null;
    numeroLote?: string | null;
    dataValidade?: string | null;
    dataFabricacao?: string | null;
    custoUnitario?: number | null;
    deposito?: string | null;
    galpao?: string | null;
    corredor?: string | null;
    prateleira?: string | null;
  }>;
}

export interface ConfirmarTransferenciaEstoquePayload {
  emitirNotaFiscal?: boolean;
}

export interface TransferenciaEstoqueItemFormModel {
  chave: string;
  produtoId: string;
  loteId: string;
  quantidade: string;
}

export interface TransferenciaEstoqueFormModel {
  unidadeDestinoId: string;
  justificativa: string;
  itens: TransferenciaEstoqueItemFormModel[];
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
  deposito: string;
  galpao: string;
  corredor: string;
  prateleira: string;
  localEstoqueId: string | null;
}

export interface SaidaEstoqueFormModel {
  produtoId: string;
  loteId: string;
  quantidade: string;
  usarFefo: boolean;
  motivo: OrigemMovimentacaoEstoqueValor;
  justificativa: string;
}

export interface AjusteEstoqueFormModel {
  loteId: string;
  quantidadeNova: string;
  justificativa: string;
}

export interface ContagemInventarioFormModel {
  quantidadeContada: string;
}

export interface ProdutoPorCodigoDto {
  id: string;
  codigo: string;
  descricao: string;
}
