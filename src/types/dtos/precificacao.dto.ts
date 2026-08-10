import type { CanalVendaValor } from 'constants/enums';

export interface ResolverPrecoParams {
  produtoId: string;
  clienteId?: string | null;
  tabelaPrecoId?: string | null;
  canal?: CanalVendaValor | null;
}

export interface PrecoResolvidoDto {
  produtoId: string;
  preco: number;
  tabelaPrecoId: string | null;
  origem: string;
  encontradoNaTabela: boolean;
}

export interface ListarTabelasPermitidasParams {
  clienteId?: string | null;
  canal?: CanalVendaValor | null;
}

export interface TabelaPrecoPermitidaDto {
  id: string;
  codigo: string;
  nome: string;
  ehPadrao: boolean;
  vigenciaInicio: string;
  vigenciaFim: string | null;
  clienteIds?: string[];
}
