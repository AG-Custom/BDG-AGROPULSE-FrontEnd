export type DirecaoEscrituracao = 'Entrada' | 'Saida';
export type GravidadePendenciaEscrituracao = 'Bloqueante' | 'Alerta';
export type SituacaoDocumentoEscriturado = 'Regular' | 'Cancelado';

export interface CompetenciaEscrituracaoDto {
  competencia: string;
  documentos: number;
  documentosComPendenciaBloqueante: number;
  pendenciasBloqueantes: number;
  pendenciasAlerta: number;
}

export interface PendenciaEscrituracaoDto {
  id: string;
  codigo: string;
  gravidade: GravidadePendenciaEscrituracao;
  descricao: string;
  numeroItem: number | null;
}

export interface DocumentoEscrituradoResumoDto {
  id: string;
  notaFiscalId: string;
  competencia: string;
  direcao: DirecaoEscrituracao;
  modelo: string;
  situacao: SituacaoDocumentoEscriturado;
  emissaoPropria: boolean;
  chaveAcesso: string | null;
  numero: string | null;
  serie: string | null;
  dataEmissao: string;
  naturezaOperacao: string | null;
  cfop: string | null;
  participanteDocumento: string | null;
  participanteNome: string | null;
  participanteUf: string | null;
  valorTotal: number;
  baseIcms: number;
  valorIcms: number;
  valorIcmsSt: number;
  valorIpi: number;
  valorPis: number;
  valorCofins: number;
  xmlPresente: boolean;
  gerarLancamentosEfdContribuicoes: boolean;
  pendenciasBloqueantes: number;
  pendenciasAlerta: number;
}

export interface ItemEscrituradoDto {
  id: string;
  numeroItem: number;
  produtoId: string | null;
  codigoProduto: string;
  descricao: string | null;
  ncm: string | null;
  cfop: string | null;
  unidade: string | null;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  origem: string | null;
  cstIcms: string | null;
  csosn: string | null;
  baseIcms: number | null;
  aliquotaIcms: number | null;
  valorIcms: number | null;
  baseIcmsSt: number | null;
  valorIcmsSt: number | null;
  valorDifal: number | null;
  cstIpi: string | null;
  baseIpi: number | null;
  aliquotaIpi: number | null;
  valorIpi: number | null;
  cstPis: string | null;
  basePis: number | null;
  aliquotaPis: number | null;
  valorPis: number | null;
  cstCofins: string | null;
  baseCofins: number | null;
  aliquotaCofins: number | null;
  valorCofins: number | null;
}

export interface DocumentoEscrituradoDetalheDto {
  documento: DocumentoEscrituradoResumoDto;
  itens: ItemEscrituradoDto[];
  pendencias: PendenciaEscrituracaoDto[];
}

export interface TotaisEscrituracaoDto {
  documentos: number;
  valorTotal: number;
  baseIcms: number;
  valorIcms: number;
  valorIcmsSt: number;
  valorIpi: number;
  valorPis: number;
  valorCofins: number;
}

export interface LivroFiscalDto {
  competencia: string;
  entradas: TotaisEscrituracaoDto;
  saidas: TotaisEscrituracaoDto;
  pendenciasBloqueantes: number;
  pendenciasAlerta: number;
  documentos: DocumentoEscrituradoResumoDto[];
}

export interface ReprocessamentoEscrituracaoDto {
  competencia: string;
  documentosEscriturados: number;
  documentosComPendenciaBloqueante: number;
}
