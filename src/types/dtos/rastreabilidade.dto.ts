export interface TalhaoDto {
  id: string;
  empresaId: string;
  unidadeId: string;
  nome: string;
  areaHectares: number | null;
  ativo: boolean;
}

export interface CriarTalhaoPayload {
  nome: string;
  areaHectares?: number | null;
}

export type EditarTalhaoPayload = CriarTalhaoPayload;

export interface AplicacaoInsumoDto {
  id: string;
  empresaId: string;
  unidadeId: string;
  talhaoId: string;
  produtoId: string;
  loteId: string | null;
  quantidade: number;
  unidadeMedida: string;
  dataAplicacao: string;
  safra: string | null;
  cultura: string | null;
  numeroReceita: string | null;
  crea: string | null;
}

export interface CriarAplicacaoInsumoPayload {
  talhaoId: string;
  produtoId: string;
  loteId?: string | null;
  quantidade: number;
  unidadeMedida: string;
  dataAplicacao: string;
  safra?: string | null;
  cultura?: string | null;
  numeroReceita?: string | null;
  crea?: string | null;
}

export type EditarAplicacaoInsumoPayload = CriarAplicacaoInsumoPayload;

export interface TalhaoFormModel {
  nome: string;
  areaHectares: string;
}

export interface AplicacaoInsumoFormModel {
  talhaoId: string;
  produtoId: string;
  loteId: string;
  quantidade: string;
  unidadeMedida: string;
  dataAplicacao: string;
  safra: string;
  cultura: string;
  numeroReceita: string;
  crea: string;
}
