export interface CategoriaProdutoResumoDto {
  id: string;
  empresaId: string;
  codigo: string;
  nome: string;
  margemMinimaPercentual: number | null;
  ativo: boolean;
}

export type CategoriaProdutoDto = CategoriaProdutoResumoDto;

export interface SalvarCategoriaProdutoPayload {
  nome: string;
  margemMinimaPercentual?: number | null;
}

export interface ListarCategoriasProdutoParams {
  ativo?: boolean;
  busca?: string;
}

export interface CategoriaProdutoFormModel {
  nome: string;
  margemMinimaPercentual: string;
}
