import type {
  CategoriaCusteioSafraValor,
  StatusOrdemServicoAgricolaValor,
  StatusRecomendacaoValor,
  StatusSafraValor,
  TipoAtividadeDiarioCampoValor,
  TipoGeoImportacaoValor,
  TipoOperacaoSafrasValor,
  TipoOrdemServicoAgricolaValor,
  TipoVisitaTecnicaValor,
} from 'constants/enums';

export interface FazendaDto {
  id: string;
  empresaId: string;
  unidadeId: string;
  nome: string;
  clienteId: string | null;
  municipio: string | null;
  uf: string | null;
  areaTotalHa: number | null;
  ativo: boolean;
}

export interface CriarFazendaPayload {
  nome: string;
  clienteId?: string | null;
  municipio?: string | null;
  uf?: string | null;
  areaTotalHa?: number | null;
}

export type EditarFazendaPayload = CriarFazendaPayload;

export interface FazendaFormModel {
  nome: string;
  clienteId: string;
  municipio: string;
  uf: string;
  areaTotalHa: string;
}

export interface GlebaDto {
  id: string;
  empresaId: string;
  fazendaId: string;
  nome: string;
  areaHa: number | null;
  ativo: boolean;
}

export interface CriarGlebaPayload {
  fazendaId: string;
  nome: string;
  areaHa?: number | null;
}

export interface EditarGlebaPayload {
  nome: string;
  areaHa?: number | null;
}

export interface GlebaFormModel {
  fazendaId: string;
  nome: string;
  areaHa: string;
}

export interface ListarGlebasParams {
  fazendaId?: string;
}

export interface SafraDto {
  id: string;
  empresaId: string;
  unidadeId: string;
  nome: string;
  cultura: string;
  fazendaId: string | null;
  talhaoId: string | null;
  areaPlanejadaHa: number | null;
  areaRealizadaHa: number | null;
  dataInicio: string | null;
  dataFim: string | null;
  produtividadePlanejada: number | null;
  produtividadeRealizada: number | null;
  status: StatusSafraValor;
  observacoes: string | null;
}

export interface CriarSafraPayload {
  nome: string;
  cultura: string;
  fazendaId?: string | null;
  talhaoId?: string | null;
  areaPlanejadaHa?: number | null;
  dataInicio?: string | null;
  dataFim?: string | null;
  produtividadePlanejada?: number | null;
  observacoes?: string | null;
}

export interface EditarSafraPayload extends CriarSafraPayload {
  areaRealizadaHa?: number | null;
  produtividadeRealizada?: number | null;
}

export interface SafraFormModel {
  nome: string;
  cultura: string;
  fazendaId: string;
  talhaoId: string;
  areaPlanejadaHa: string;
  areaRealizadaHa: string;
  dataInicio: string;
  dataFim: string;
  produtividadePlanejada: string;
  produtividadeRealizada: string;
  observacoes: string;
}

export interface VisitaTecnicaDto {
  id: string;
  empresaId: string;
  clienteId: string | null;
  fazendaId: string | null;
  talhaoId: string | null;
  dataVisita: string;
  tipo: TipoVisitaTecnicaValor;
  tecnicoNome: string | null;
  observacoes: string | null;
}

export interface CriarVisitaTecnicaPayload {
  clienteId?: string | null;
  fazendaId?: string | null;
  talhaoId?: string | null;
  dataVisita: string;
  tipo: TipoVisitaTecnicaValor;
  tecnicoNome?: string | null;
  observacoes?: string | null;
}

export type EditarVisitaTecnicaPayload = CriarVisitaTecnicaPayload;

export interface VisitaTecnicaFormModel {
  clienteId: string;
  fazendaId: string;
  talhaoId: string;
  dataVisita: string;
  tipo: TipoVisitaTecnicaValor | '';
  tecnicoNome: string;
  observacoes: string;
}

export interface RecomendacaoDto {
  id: string;
  empresaId: string;
  visitaId: string | null;
  clienteId: string | null;
  fazendaId: string | null;
  talhaoId: string | null;
  safraId: string | null;
  produtoId: string | null;
  descricao: string;
  dose: string | null;
  unidade: string | null;
  status: StatusRecomendacaoValor;
  dataRecomendacao: string;
}

export interface CriarRecomendacaoPayload {
  visitaId?: string | null;
  clienteId?: string | null;
  fazendaId?: string | null;
  talhaoId?: string | null;
  safraId?: string | null;
  produtoId?: string | null;
  descricao: string;
  dose?: string | null;
  unidade?: string | null;
  dataRecomendacao: string;
}

export type EditarRecomendacaoPayload = CriarRecomendacaoPayload;

export interface RecomendacaoFormModel {
  visitaId: string;
  clienteId: string;
  fazendaId: string;
  talhaoId: string;
  safraId: string;
  produtoId: string;
  descricao: string;
  dose: string;
  unidade: string;
  dataRecomendacao: string;
}

export interface OrdemServicoAgricolaDto {
  id: string;
  empresaId: string;
  safraId: string | null;
  talhaoId: string | null;
  tipo: TipoOrdemServicoAgricolaValor;
  status: StatusOrdemServicoAgricolaValor;
  dataPlanejada: string | null;
  dataInicio: string | null;
  dataConclusao: string | null;
  descricao: string | null;
  responsavel: string | null;
}

export interface CriarOrdemServicoAgricolaPayload {
  safraId?: string | null;
  talhaoId?: string | null;
  tipo: TipoOrdemServicoAgricolaValor;
  dataPlanejada?: string | null;
  descricao?: string | null;
  responsavel?: string | null;
}

export type EditarOrdemServicoAgricolaPayload = CriarOrdemServicoAgricolaPayload;

export interface OrdemServicoAgricolaFormModel {
  safraId: string;
  talhaoId: string;
  tipo: TipoOrdemServicoAgricolaValor | '';
  dataPlanejada: string;
  descricao: string;
  responsavel: string;
}

export interface CusteioSafraDto {
  id: string;
  empresaId: string;
  safraId: string;
  talhaoId: string | null;
  categoria: CategoriaCusteioSafraValor;
  descricao: string;
  valor: number;
  data: string | null;
  quantidade: number | null;
  unidade: string | null;
}

export interface CriarCusteioSafraPayload {
  safraId: string;
  talhaoId?: string | null;
  categoria: CategoriaCusteioSafraValor;
  descricao: string;
  valor: number;
  data?: string | null;
  quantidade?: number | null;
  unidade?: string | null;
}

export interface CusteioSafraFormModel {
  safraId: string;
  talhaoId: string;
  categoria: CategoriaCusteioSafraValor | '';
  descricao: string;
  valor: string;
  data: string;
  quantidade: string;
  unidade: string;
}

export interface ListarCusteiosParams {
  safraId?: string;
  talhaoId?: string;
}

export interface CusteioResumoDto {
  safraId: string | null;
  talhaoId: string | null;
  total: number;
  custoPorHa: number | null;
  porCategoria: Array<{
    categoria: CategoriaCusteioSafraValor;
    total: number;
  }>;
}

export interface ProdutividadeSafraDto {
  safraId: string;
  nome: string;
  cultura: string;
  areaHa: number | null;
  produtividadePlanejada: number | null;
  produtividadeRealizada: number | null;
  diferencaPct: number | null;
}

export interface HistoricoProdutividadeDto {
  id: string;
  fazendaId: string | null;
  talhaoId: string | null;
  safraId: string | null;
  safraNome: string | null;
  cultura: string | null;
  ano: number | null;
  produtividade: number | null;
  areaHa: number | null;
}

export interface ListarHistoricoProdutividadeParams {
  fazendaId?: string;
  talhaoId?: string;
}

export interface OeeCampoDto {
  mes: number;
  ano: number;
  disponibilidade: number;
  performance: number;
  qualidade: number;
  oee: number;
  heuristica: string | null;
}

export interface DiarioCampoDto {
  id: string;
  empresaId: string;
  data: string;
  tipoAtividade: TipoAtividadeDiarioCampoValor;
  descricao: string;
  talhaoId: string | null;
  safraId: string | null;
  clientSyncId: string | null;
  sincronizadoEm: string | null;
}

export interface CriarDiarioCampoPayload {
  data: string;
  tipoAtividade: TipoAtividadeDiarioCampoValor;
  descricao: string;
  talhaoId?: string | null;
  safraId?: string | null;
  clientSyncId?: string | null;
}

export interface DiarioCampoSyncItem {
  clientSyncId: string;
  data: string;
  tipoAtividade: TipoAtividadeDiarioCampoValor;
  descricao: string;
  talhaoId?: string | null;
  safraId?: string | null;
}

export interface DiarioCampoFormModel {
  data: string;
  tipoAtividade: TipoAtividadeDiarioCampoValor | '';
  descricao: string;
  talhaoId: string;
  safraId: string;
}

export interface PerfilSafrasDto {
  tipoOperacao: TipoOperacaoSafrasValor;
}

export interface ImportarGeoPayload {
  fileName?: string | null;
  tipoArquivo?: TipoGeoImportacaoValor | string | null;
  conteudoBase64?: string | null;
}

export interface ImportarGeoFormModel {
  nomeArquivo: string;
  tipo: TipoGeoImportacaoValor | '';
  fazendaId: string;
}

export interface EncerrarSafraPayload {
  dataColheitaReal?: string | null;
  produtividadeRealizada?: number | null;
}

export interface HistoricoAplicacaoItemDto {
  id: string;
  dataAplicacao: string;
  produtoId: string;
  produtoNome: string | null;
  talhaoId: string;
  talhaoNome: string | null;
  fazendaId: string | null;
  fazendaNome: string | null;
  safraId: string | null;
  safraNome: string | null;
  quantidade: number;
  unidadeMedida: string;
  numeroLote: string | null;
  doseHa: number | null;
}

export interface ListarHistoricoAplicacoesParams {
  clienteId?: string;
  fazendaId?: string;
  talhaoId?: string;
  safraId?: string;
}
