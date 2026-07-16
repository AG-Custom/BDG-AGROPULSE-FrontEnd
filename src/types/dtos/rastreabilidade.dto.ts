export interface TalhaoDto {
  id: string;
  empresaId: string;
  unidadeId: string;
  nome: string;
  areaHectares: number | null;
  glebaId: string | null;
  coordenadas: string | null;
  culturaAtual: string | null;
  ativo: boolean;
}

export interface CriarTalhaoPayload {
  nome: string;
  areaHectares?: number | null;
  glebaId?: string | null;
  coordenadas?: string | null;
  culturaAtual?: string | null;
}

export type EditarTalhaoPayload = CriarTalhaoPayload;

export interface AplicacaoInsumoDto {
  id: string;
  empresaId: string;
  unidadeId: string;
  talhaoId: string;
  produtoId: string;
  loteId: string | null;
  numeroLote: string | null;
  quantidade: number;
  unidadeMedida: string;
  dataAplicacao: string;
  safraId: string | null;
  safra: string | null;
  cultura: string | null;
  numeroReceita: string | null;
  crea: string | null;
  doseHa: number | null;
  areaAplicadaHa: number | null;
  equipamento: string | null;
  operadorNome: string | null;
  temperaturaC: number | null;
  umidadePct: number | null;
  ventoKmh: number | null;
  observacoes: string | null;
}

export interface CriarAplicacaoInsumoPayload {
  talhaoId: string;
  produtoId: string;
  loteId?: string | null;
  quantidade: number;
  unidadeMedida: string;
  dataAplicacao: string;
  safraId?: string | null;
  safra?: string | null;
  cultura?: string | null;
  numeroReceita?: string | null;
  crea?: string | null;
  doseHa?: number | null;
  areaAplicadaHa?: number | null;
  equipamento?: string | null;
  operadorNome?: string | null;
  temperaturaC?: number | null;
  umidadePct?: number | null;
  ventoKmh?: number | null;
  observacoes?: string | null;
}

export type EditarAplicacaoInsumoPayload = CriarAplicacaoInsumoPayload;

export interface ListarAplicacoesParams {
  talhaoId?: string;
  safraId?: string;
  dataInicio?: string;
  dataFim?: string;
}

export interface TalhaoFormModel {
  nome: string;
  areaHectares: string;
  glebaId: string;
  coordenadas: string;
  culturaAtual: string;
}

export interface AplicacaoInsumoFormModel {
  talhaoId: string;
  produtoId: string;
  loteId: string;
  quantidade: string;
  unidadeMedida: string;
  dataAplicacao: string;
  safraId: string;
  safra: string;
  cultura: string;
  numeroReceita: string;
  crea: string;
  doseHa: string;
  areaAplicadaHa: string;
  equipamento: string;
  operadorNome: string;
  temperaturaC: string;
  umidadePct: string;
  ventoKmh: string;
  observacoes: string;
}
