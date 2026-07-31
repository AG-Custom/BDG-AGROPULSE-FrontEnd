import type {
  ModeloDocumentoFiscalValor,
  ModoContingenciaFiscalValor,
  RegimeTributarioValor,
  StatusNotaFiscalValor,
  TipoDestinatarioFiscalValor,
  TipoManifestacaoSefazValor,
  TipoNotaFiscalValor,
  TipoSpedFiscalValor,
} from 'constants/enums';

export interface NotaFiscalGestaoDto {
  id: string;
  pedidoVendaId: string | null;
  pdvVendaId: string | null;
  devolucaoVendaId: string | null;
  notaReferenciadaId: string | null;
  tipo: string;
  modeloDocumento: ModeloDocumentoFiscalValor | string;
  status: StatusNotaFiscalValor | string;
  naturezaOperacao: string | null;
  cfop: string | null;
  ufDestino: string | null;
  tipoDestinatario: TipoDestinatarioFiscalValor | string | null;
  modoContingencia: ModoContingenciaFiscalValor | string;
  chaveAcesso: string | null;
  numero: string | null;
  serie: string | null;
  valorTotal: number;
  mensagemErro: string | null;
  emitidaEm: string | null;
  motivoCancelamento: string | null;
  canceladaEm: string | null;
  protocoloAutorizacao: string | null;
  focusReferencia: string | null;
  contingenciaDesde: string | null;
  loteCodigo: string | null;
  cultura: string | null;
  safra: string | null;
  quantidadeCCes: number;
  createdAt: string;
  mensagemStub?: string | null;
  reverterEstoque?: boolean | null;
  observacaoCancelamento?: string | null;
}

export interface ListarNotasFiscaisParams {
  status?: StatusNotaFiscalValor | string;
  modelo?: ModeloDocumentoFiscalValor | string;
  tipo?: TipoNotaFiscalValor | string;
  dataInicio?: string;
  dataFim?: string;
}

export interface EmitirCtePayload {
  remetente: string;
  destinatario: string;
  valor: number;
  ufDestino?: string | null;
}

export interface EmitirMdfePayload {
  veiculo: string;
  ufInicio: string;
  ufFim: string;
  valorCarga: number;
}

export interface EmitirNfprItemPayload {
  produtoId: string;
  quantidade: number;
  valor: number;
}

export interface EmitirNfprPayload {
  clienteId: string;
  itens: EmitirNfprItemPayload[];
  cultura?: string | null;
  safra?: string | null;
  valorTotal?: number | null;
}

export interface CancelarNotaFiscalPayload {
  motivo: string;
}

export interface CartaCorrecaoPayload {
  textoCorrecao: string;
}

export interface NotaComplementarPayload {
  valorAdicional: number;
  motivo: string;
}

export interface CartaCorrecaoDto {
  id: string;
  notaFiscalId: string;
  sequencia: number;
  textoCorrecao: string;
  registradaEm: string;
}

export interface DanfeDto {
  notaFiscalId: string;
  html: string;
  xml: string | null;
}

export interface XmlNotaDto {
  notaFiscalId: string;
  xml: string;
}

export interface SugestaoTributacaoCompletaDto {
  produtoId: string;
  cfop: string | null;
  natureza: string | null;
  csosn: string | null;
  cst: string | null;
  aliquota: number | null;
  ncm: string | null;
  pisCofinsCst: string | null;
  pisCofinsAliquota: number | null;
  icmsSt: boolean;
  difal: number | null;
  diferimento: number | null;
}

export interface SugerirCompletoParams {
  ufDestino?: string;
  tipoDestinatario?: TipoDestinatarioFiscalValor | string;
  naturezaOperacao?: string;
}

export interface CfopOverridePayload {
  produtoId: string;
  cfopAnterior: string;
  cfopNovo: string;
  motivo: string;
  pedidoId?: string | null;
}

export interface CfopOverrideLogDto {
  id: string;
  produtoId: string;
  cfopAnterior: string;
  cfopNovo: string;
  motivo: string;
  pedidoId: string | null;
  createdAt: string;
}

export interface ContingenciaStatusDto {
  id: string;
  modo: ModoContingenciaFiscalValor | string;
  ativo: boolean;
  ativoDesde: string;
  ativoAte: string | null;
}

export interface AtivarContingenciaPayload {
  modo: ModoContingenciaFiscalValor;
}

export interface FilaContingenciaDto {
  id: string;
  notaFiscalId: string;
  tentativas: number;
  proximaTentativa: string;
  status: string;
  ultimoErro: string | null;
}

export interface ReprocessarContingenciaDto {
  processados: number;
}

export interface NumeracaoInutilizadaDto {
  id: string;
  serie: string;
  numeroInicial: number;
  numeroFinal: number;
  justificativa: string;
  modeloDocumento: ModeloDocumentoFiscalValor | string;
  protocoloStub: string;
  createdAt: string;
}

export interface InutilizacaoFormModel {
  serie: string;
  numeroInicial: string;
  numeroFinal: string;
  justificativa: string;
  modeloDocumento: ModeloDocumentoFiscalValor | '';
}

export interface InutilizacaoPayload {
  serie: string;
  numeroInicial: number;
  numeroFinal: number;
  justificativa: string;
  modeloDocumento: ModeloDocumentoFiscalValor;
}

export interface NcmPisCofinsDto {
  id: string;
  ncm: string;
  cstPis: string;
  cstCofins: string;
  aliquotaPis: number;
  aliquotaCofins: number;
  suspenso: boolean;
  vigenciaInicio: string;
  vigenciaFim: string | null;
}

export interface NcmPisCofinsFormModel {
  ncm: string;
  cstPis: string;
  cstCofins: string;
  aliquotaPis: string;
  aliquotaCofins: string;
  suspenso: boolean;
  vigenciaInicio: string;
  vigenciaFim: string;
}

export interface CriarNcmPisCofinsPayload {
  ncm: string;
  cstPis: string;
  cstCofins: string;
  aliquotaPis: number;
  aliquotaCofins: number;
  suspenso: boolean;
  vigenciaInicio: string;
  vigenciaFim?: string | null;
}

export interface EditarNcmPisCofinsPayload {
  cstPis: string;
  cstCofins: string;
  aliquotaPis: number;
  aliquotaCofins: number;
  suspenso: boolean;
  vigenciaInicio: string;
  vigenciaFim?: string | null;
}

export interface MvaNcmUfDto {
  id: string;
  ncm: string;
  ufOrigem: string;
  ufDestino: string;
  mva: number;
  aliquotaInterna: number;
  aliquotaInterestadual: number;
  aliquotaFcp: number;
  vigenciaInicio: string;
  vigenciaFim: string | null;
}

export interface MvaNcmUfFormModel {
  ncm: string;
  ufOrigem: string;
  ufDestino: string;
  mva: string;
  aliquotaInterna: string;
  aliquotaInterestadual: string;
  aliquotaFcp: string;
  vigenciaInicio: string;
  vigenciaFim: string;
}

export interface CriarMvaNcmUfPayload {
  ncm: string;
  ufOrigem: string;
  ufDestino: string;
  mva: number;
  aliquotaInterna: number;
  aliquotaInterestadual: number;
  aliquotaFcp: number;
  vigenciaInicio: string;
  vigenciaFim?: string | null;
}

export interface EditarMvaNcmUfPayload {
  mva: number;
  aliquotaInterna: number;
  aliquotaInterestadual: number;
  aliquotaFcp: number;
  vigenciaInicio: string;
  vigenciaFim?: string | null;
}

export interface CalcularImpostosItemPayload {
  produtoId: string;
  valor: number;
  quantidade: number;
}

export interface CalcularImpostosPayload {
  itens: CalcularImpostosItemPayload[];
  ufDestino: string;
  tipoDestinatario: TipoDestinatarioFiscalValor;
}

export interface CalculoImpostosItemDto {
  produtoId: string;
  baseSt: number;
  valorSt: number;
  difal: number;
  fcp: number;
  diferimento: number;
}

export interface CalculoImpostosDto {
  itens: CalculoImpostosItemDto[];
  totalBaseSt: number;
  totalSt: number;
  totalDifal: number;
  totalFcp: number;
  totalDiferimento: number;
}

export interface GuiaGnreDto {
  id: string;
  notaFiscalId: string | null;
  ufDestino: string;
  valor: number;
  status: string;
  protocolo: string;
  createdAt: string;
}

export interface GerarGnrePayload {
  notaFiscalId: string;
}

export interface ConfigFunruralDto {
  id: string;
  aliquotaFunrural: number;
  aliquotaGilrat: number;
  aliquotaSenar: number;
  vigenciaInicio: string;
  vigenciaFim: string | null;
}

export interface ConfigFunruralFormModel {
  aliquotaFunrural: string;
  aliquotaGilrat: string;
  aliquotaSenar: string;
  vigenciaInicio: string;
  vigenciaFim: string;
}

export interface ConfigFunruralPayload {
  aliquotaFunrural: number;
  aliquotaGilrat: number;
  aliquotaSenar: number;
  vigenciaInicio: string;
  vigenciaFim?: string | null;
}

export interface CalcularFunruralPayload {
  baseCalculo: number;
  isProdutorRural: boolean;
}

export interface FunruralCalculoDto {
  baseCalculo: number;
  funrural: number;
  gilrat: number;
  senar: number;
  total: number;
}

export interface RegimeTributarioCnpjDto {
  id: string;
  cnpjEmpresaId: string;
  regime: RegimeTributarioValor | string;
  vigenciaInicio: string;
  vigenciaFim: string | null;
}

export interface RegimeTributarioCnpjFormModel {
  cnpjEmpresaId: string;
  regime: RegimeTributarioValor | '';
  vigenciaInicio: string;
  vigenciaFim: string;
}

export interface RegimeTributarioCnpjPayload {
  cnpjEmpresaId: string;
  regime: RegimeTributarioValor;
  vigenciaInicio: string;
  vigenciaFim?: string | null;
}

export interface SpedLinhasDto {
  linhas: string[];
}

export interface ListarSpedParams {
  dataInicio: string;
  dataFim: string;
}

export interface EnviarEscritorioFiscalPayload {
  tipo: TipoSpedFiscalValor;
  periodo: string;
  emailEscritorio: string;
}

export interface EnvioEscritorioFiscalDto {
  id: string;
  tipo: string;
  periodo: string;
  emailEscritorio: string;
  status: string;
  mensagem: string | null;
  createdAt: string;
}

export interface ManifestarDestinatarioPayload {
  chaveAcesso: string;
  tipo: TipoManifestacaoSefazValor;
  justificativa?: string | null;
}

export interface ManifestacaoDestinatarioDto {
  id: string;
  chaveAcesso: string;
  tipo: string;
  justificativa: string | null;
  protocoloStub: string;
  createdAt: string;
}

export interface EmitirCteFormModel {
  remetente: string;
  destinatario: string;
  valor: string;
  ufDestino: string;
}

export interface EmitirMdfeFormModel {
  veiculo: string;
  ufInicio: string;
  ufFim: string;
  valorCarga: string;
}

export interface EmitirNfprFormModel {
  clienteId: string;
  produtoId: string;
  quantidade: string;
  valor: string;
  cultura: string;
  safra: string;
}

export interface CancelarNotaFormModel {
  motivo: string;
}

export interface CceFormModel {
  textoCorrecao: string;
}

export interface ComplementarFormModel {
  valorAdicional: string;
  motivo: string;
}
