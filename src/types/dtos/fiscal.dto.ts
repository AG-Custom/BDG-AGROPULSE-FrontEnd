import type { RegimeTributarioValor } from 'constants/enums';

export interface SugestaoTributacaoDto {
  produtoId: string;
  cfopSugerido: string | null;
  cfopInterno: string | null;
  cfopExterno: string | null;
  csosn: string | null;
  cstIcms: string | null;
  aliquotaIcms: number | null;
  ncm: string | null;
}

export interface ImportacaoXmlDto {
  itensProcessados: number;
  produtosAtualizados: number;
  entradasEstoque: number;
  avisos: string[];
}

export interface ImportarXmlPayload {
  xmlConteudo: string;
}

export interface Sped0200Dto {
  linhas: string[];
}

export interface NotaFiscalDto {
  id: string;
  pedidoVendaId: string | null;
  tipo: string;
  status: string;
  chaveAcesso: string | null;
  numero: string | null;
  serie: string | null;
  valorTotal: number;
  mensagemErro: string | null;
  emitidaEm: string | null;
  createdAt: string;
}

export interface ConfiguracaoFiscalDto {
  id: string;
  regimeTributario: RegimeTributarioValor;
  possuiTokenFocus: boolean;
  focusNfeHomologacao: boolean;
  ativo: boolean;
  createdAt: string;
}

export interface SalvarConfiguracaoFiscalPayload {
  regimeTributario: RegimeTributarioValor;
  focusNfeToken?: string | null;
  focusNfeHomologacao?: boolean;
}

export interface DocumentoSefazDto {
  chaveAcesso: string;
  tipo: string;
  dataEmissao: string;
  cnpjEmitente?: string | null;
  nomeEmitente?: string | null;
  valorTotal?: number | null;
}

export interface DocumentosSefazDto {
  documentos: DocumentoSefazDto[];
  mensagem: string;
}

export interface ListarDocumentosSefazParams {
  dataInicio?: string;
  dataFim?: string;
}

export interface ConfiguracaoFiscalFormModel {
  regimeTributario: RegimeTributarioValor | '';
  focusNfeToken: string;
  focusNfeHomologacao: boolean;
}
