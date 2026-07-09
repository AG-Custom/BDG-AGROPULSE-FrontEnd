import type { CanalVendaValor, GrupoComercialValor } from 'constants/enums';

export interface TabelaPrecoResumoDto {
  id: string;
  empresaId: string;
  codigo: string;
  nome: string;
  vigenciaInicio: string;
  vigenciaFim: string | null;
  ativo: boolean;
}

export interface TabelaPrecoItemDto {
  id: string;
  produtoId: string;
  preco: number;
  margemMinimaPercentual: number | null;
}

export interface TabelaPrecoDto extends TabelaPrecoResumoDto {
  clienteId: string | null;
  grupoComercial: GrupoComercialValor | null;
  canalVenda: CanalVendaValor | null;
  regiao: string | null;
  unidadeId: string;
  itens: TabelaPrecoItemDto[];
}

export interface SalvarTabelaPrecoPayload {
  codigo: string;
  nome: string;
  vigenciaInicio: string;
  vigenciaFim?: string | null;
  clienteId?: string | null;
  grupoComercial?: GrupoComercialValor | null;
  canalVenda?: CanalVendaValor | null;
  regiao?: string | null;
}

export interface TabelaPrecoItemPayload {
  produtoId: string;
  preco: number;
  margemMinimaPercentual?: number | null;
}

export interface EditarTabelaPrecoItemPayload {
  preco: number;
  margemMinimaPercentual?: number | null;
}

export interface ListarTabelasPrecoParams {
  ativo?: boolean;
  busca?: string;
}

export interface TabelaPrecoFormModel {
  codigo: string;
  nome: string;
  vigenciaInicio: string;
  vigenciaFim: string;
  clienteId: string | null;
  grupoComercial: GrupoComercialValor | null;
  canalVenda: CanalVendaValor | null;
  regiao: string;
}

export interface TabelaPrecoItemFormModel {
  produtoId: string | null;
  preco: string;
  margemMinimaPercentual: string;
}

export interface TabelaPrecoItemEdicaoFormModel {
  preco: string;
  margemMinimaPercentual: string;
}
