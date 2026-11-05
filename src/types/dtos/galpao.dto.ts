export interface GalpaoResumoDto {
  id: string;
  empresaId: string;
  unidadeId: string;
  codigo: string;
  nome: string;
  ativo: boolean;
}

export type GalpaoDto = GalpaoResumoDto;

export interface SalvarGalpaoPayload {
  nome: string;
}

export interface ListarGalpoesParams {
  ativo?: boolean;
  busca?: string;
}

export interface GalpaoFormModel {
  nome: string;
}
