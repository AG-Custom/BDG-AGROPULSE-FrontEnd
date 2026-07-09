import type {
  MetodoCusteioValor,
  OrigemMercadoriaValor,
  TipoCodigoProdutoValor,
  TipoDocumentoProdutoValor,
  TipoProdutoValor,
} from 'constants/enums';

export interface ProdutoResumoDto {
  id: string;
  empresaId: string;
  codigo: string;
  descricao: string;
  categoriaProdutoId: string;
  tipoProduto: TipoProdutoValor;
  unidadeMedidaId: string;
  ativo: boolean;
}

export interface ProdutoFiscalDto {
  id: string;
  ncm: string;
  cest: string | null;
  origemMercadoria: OrigemMercadoriaValor;
  csosn: string | null;
  cstIcms: string | null;
  aliquotaIcms: number | null;
  mva: number | null;
  observacoesFiscais: string | null;
}

export interface ProdutoCodigoDto {
  id: string;
  tipo: TipoCodigoProdutoValor;
  valor: string;
  principal: boolean;
}

export interface ProdutoDocumentoDto {
  id: string;
  tipo: TipoDocumentoProdutoValor;
  nomeOriginal: string;
  contentType: string;
  tamanhoBytes: number;
  urlPublica: string | null;
}

export interface ProdutoLimiteEstoqueDto {
  id: string;
  unidadeId: string;
  estoqueMinimo: number;
  estoqueMaximo: number | null;
  ativo: boolean;
}

export interface ProdutoConversaoUnidadeDto {
  id: string;
  unidadeOrigemId: string;
  unidadeDestinoId: string;
  fatorConversao: number;
}

export interface ProdutoDto extends ProdutoResumoDto {
  exigeLote: boolean;
  exigeValidade: boolean;
  exigeFabricacao: boolean;
  metodoCusteio: MetodoCusteioValor | null;
  margemMinimaPercentual: number | null;
  fiscal: ProdutoFiscalDto | null;
  codigos: ProdutoCodigoDto[];
  documentos: ProdutoDocumentoDto[];
  limitesEstoque: ProdutoLimiteEstoqueDto[];
  conversoesUnidade: ProdutoConversaoUnidadeDto[];
}

export interface CriarProdutoPayload {
  codigo: string;
  descricao: string;
  categoriaProdutoId: string;
  tipoProduto: TipoProdutoValor;
  unidadeMedidaId: string;
  exigeLote: boolean;
  exigeValidade: boolean;
  exigeFabricacao: boolean;
  margemMinimaPercentual?: number | null;
}

export interface EditarProdutoPayload extends CriarProdutoPayload {
  metodoCusteio?: MetodoCusteioValor | null;
}

export interface ProdutoFiscalPayload {
  ncm: string;
  cest?: string | null;
  origemMercadoria: OrigemMercadoriaValor;
  csosn?: string | null;
  cstIcms?: string | null;
  aliquotaIcms?: number | null;
  mva?: number | null;
  observacoesFiscais?: string | null;
}

export interface ProdutoCodigoPayload {
  tipo: TipoCodigoProdutoValor;
  valor: string;
  principal: boolean;
}

export interface ProdutoLimiteEstoqueItemPayload {
  unidadeId: string;
  estoqueMinimo: number;
  estoqueMaximo?: number | null;
}

export interface SincronizarLimitesEstoquePayload {
  limites: ProdutoLimiteEstoqueItemPayload[];
}

export interface ProdutoConversaoPayload {
  unidadeOrigemId: string;
  unidadeDestinoId: string;
  fatorConversao: number;
}

export interface EditarProdutoConversaoPayload {
  fatorConversao: number;
}

export interface ListarProdutosParams {
  ativo?: boolean;
  busca?: string;
  categoriaProdutoId?: string;
}

export interface ProdutoFormModel {
  codigo: string;
  descricao: string;
  categoriaProdutoId: string | null;
  tipoProduto: TipoProdutoValor;
  unidadeMedidaId: string | null;
  exigeLote: boolean;
  exigeValidade: boolean;
  exigeFabricacao: boolean;
  margemMinimaPercentual: string;
  metodoCusteio: MetodoCusteioValor | null;
}

export interface ProdutoFiscalFormModel {
  ncm: string;
  cest: string;
  origemMercadoria: OrigemMercadoriaValor;
  csosn: string;
  cstIcms: string;
  aliquotaIcms: string;
  mva: string;
  observacoesFiscais: string;
}

export interface ProdutoCodigoFormModel {
  tipo: TipoCodigoProdutoValor;
  valor: string;
  principal: boolean;
}

export interface ProdutoLimiteEstoqueFormModel {
  unidadeId: string | null;
  estoqueMinimo: string;
  estoqueMaximo: string;
}

export interface ProdutoConversaoFormModel {
  unidadeOrigemId: string | null;
  unidadeDestinoId: string | null;
  fatorConversao: string;
}

export interface ProdutoConversaoEdicaoFormModel {
  fatorConversao: string;
}

export interface ProdutoDocumentoRascunho {
  id: string;
  tipo: TipoDocumentoProdutoValor;
  nomeOriginal: string;
  contentType: string;
  tamanhoBytes: number;
  arquivo: File;
}

export type ProdutoDocumentoListaItem = ProdutoDocumentoDto | ProdutoDocumentoRascunho;

export interface ProdutoComplementosFormModel {
  fiscal: ProdutoFiscalFormModel;
  codigos: ProdutoCodigoDto[];
  documentos: ProdutoDocumentoListaItem[];
  limites: ProdutoLimiteEstoqueFormModel[];
  conversoes: ProdutoConversaoUnidadeDto[];
}
