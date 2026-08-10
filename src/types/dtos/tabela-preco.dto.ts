import type { CanalVendaValor, GrupoComercialValor } from 'constants/enums';

export interface TabelaPrecoResumoDto {
  id: string;
  empresaId: string;
  codigo: string;
  nome: string;
  vigenciaInicio: string;
  vigenciaFim: string | null;
  ativo: boolean;
  ehPadrao?: boolean;
  clienteIds?: string[];
}

export interface TabelaPrecoItemDto {
  id: string;
  produtoId: string;
  preco: number;
  margemMinimaPercentual: number | null;
}

export interface TabelaPrecoDto extends TabelaPrecoResumoDto {
  clienteIds: string[];
  grupoComercial: GrupoComercialValor | null;
  canalVenda: CanalVendaValor | null;
  regiao: string | null;
  unidadeId: string;
  itens: TabelaPrecoItemDto[];
}

export interface SalvarTabelaPrecoPayload {
  nome: string;
  vigenciaInicio: string;
  vigenciaFim?: string | null;
  clienteIds?: string[];
  grupoComercial?: GrupoComercialValor | null;
  canalVenda?: CanalVendaValor | null;
  regiao?: string | null;
}

export interface VincularTabelaPrecoClientePayload {
  clienteId: string;
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
  clienteId?: string;
}

export interface TabelaPrecoFormModel {
  nome: string;
  vigenciaInicio: string;
  vigenciaFim: string;
  clienteIds: string[];
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
