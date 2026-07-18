import type {
  ContratoStatusValor,
  FontePrecoValor,
  SeveridadeAlertaContratoValor,
  TipoContratoValor,
  TipoOperacaoTermoValor,
  UnidadeGraoValor,
} from 'constants/enums';

export interface BarterCampos {
  produtoInsumoId?: string | null;
  quantidadeInsumo?: number | null;
  precoInsumo?: number | null;
  produtoGraoId?: string | null;
  quantidadeGrao?: number | null;
  unidadeGrao?: UnidadeGraoValor | null;
  precoReferenciaGrao?: number | null;
  ajusteFinanceiro?: number | null;
}

export interface CprCampos {
  numeroCpr?: string | null;
  qualidadeMinima?: string | null;
  localEntrega?: string | null;
  dataEntregaPrevista?: string | null;
  emitenteNome?: string | null;
  credorNome?: string | null;
  garantias?: GarantiaContratoPayload[] | null;
}

export interface GarantiaContratoPayload {
  descricao: string;
  valor?: number | null;
  tipoGarantia?: string | null;
}

export interface TermoCampos {
  tipoOperacao?: TipoOperacaoTermoValor | null;
  contraparteNome?: string | null;
}

export interface EntregaContratoDto {
  id: string;
  quantidade: number;
  dataEntrega: string;
  numeroNfe?: string | null;
  observacao?: string | null;
  precoEntrega?: number | null;
  stubNfe?: boolean;
}

export interface VinculoPedidoContratoDto {
  id: string;
  pedidoId: string;
  pedidoNumero?: string | null;
  tipoVinculo?: string | null;
  valor?: number | null;
}

export interface ContratoDto extends CprCampos, BarterCampos, TermoCampos {
  id: string;
  empresaId: string;
  unidadeId: string;
  clienteId: string;
  produtoId: string;
  quantidade: number;
  preco: number;
  fontePreco: FontePrecoValor;
  status: ContratoStatusValor;
  dataInicio: string;
  dataFim: string | null;
  observacao: string | null;
  liquidadoEm: string | null;
  entregueEm: string | null;
  safraId?: string | null;
  quantidadeEntregue?: number;
  quantidadePendente?: number;
  diasParaVencimento?: number | null;
  precoLiquidacao?: number | null;
  fontePrecoLiquidacao?: FontePrecoValor | null;
  entregas?: EntregaContratoDto[];
  vinculosPedido?: VinculoPedidoContratoDto[];
}

export interface CriarContratoPayload extends CprCampos, BarterCampos, TermoCampos {
  clienteId: string;
  produtoId: string;
  quantidade: number;
  preco: number;
  fontePreco: FontePrecoValor;
  dataInicio: string;
  dataFim?: string | null;
  observacao?: string | null;
  safraId?: string | null;
}

export type EditarContratoPayload = CriarContratoPayload;

export interface EntregaPayload {
  quantidade: number;
  dataEntrega: string;
  numeroNfe?: string | null;
  observacao?: string | null;
  precoEntrega?: number | null;
  stubNfe?: boolean;
}

export interface LiquidarContratoPayload {
  precoLiquidacaoManual?: number | null;
}

export interface CotacaoMercadoDto {
  produto: string;
  fonte: FontePrecoValor;
  preco: number;
  consultadoEm: string;
}

export interface ListarCotacaoMercadoParams {
  produto?: string;
  fonte?: FontePrecoValor;
}

export interface AlertaContratoDto {
  id: string;
  tipoContrato: TipoContratoValor | string;
  contratoId: string;
  numero?: string | null;
  severidade: SeveridadeAlertaContratoValor | string;
  titulo: string;
  descricao: string;
  diasRestantes?: number | null;
}

export interface PainelContratoItemDto {
  id: string;
  tipoContrato: TipoContratoValor | string;
  numero?: string | null;
  clienteId: string;
  clienteNome?: string | null;
  produtoId: string;
  produtoNome?: string | null;
  status: ContratoStatusValor | string;
  quantidade: number;
  quantidadeEntregue: number;
  quantidadePendente: number;
  preco: number;
  dataFim?: string | null;
  dataEntregaPrevista?: string | null;
  diasParaVencimento?: number | null;
  safraId?: string | null;
}

export interface PainelSafraItemDto {
  safraId: string;
  safraNome?: string | null;
  quantidadeTravada: number;
  precoMedio: number;
  exposicaoMercado?: number | null;
  contratosAbertos?: number | null;
}

export interface ListarContratosParams {
  status?: ContratoStatusValor | '';
  safraId?: string | '';
}

export interface ContratoFormModel {
  clienteId: string;
  produtoId: string;
  quantidade: string;
  preco: string;
  fontePreco: FontePrecoValor | '';
  dataInicio: string;
  dataFim: string;
  observacao: string;
  safraId: string;
  numeroCpr: string;
  qualidadeMinima: string;
  localEntrega: string;
  dataEntregaPrevista: string;
  partes: string;
  garantias: string;
  valorInsumos: string;
  produtoGraoId: string;
  quantidadeGraos: string;
  unidadeGrao: UnidadeGraoValor | '';
  precoReferencia: string;
  quantidadeEquivalente: string;
  tipoOperacao: TipoOperacaoTermoValor | '';
}

export interface EntregaFormModel {
  quantidade: string;
  dataEntrega: string;
  notaFiscal: string;
  observacao: string;
  precoEntrega: string;
}

export interface LiquidacaoFormModel {
  precoLiquidacao: string;
  fontePreco: FontePrecoValor | '';
  observacao: string;
}
