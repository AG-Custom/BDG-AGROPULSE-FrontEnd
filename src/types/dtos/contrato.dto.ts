import type { ContratoStatusValor, FontePrecoValor } from 'constants/enums';

export interface ContratoDto {
  id: string;
  empresaId: string;
  unidadeId: string;
  clienteId: string;
  produtoId: string;
  quantidade: number;
  preco: number;
  fontePreco: FontePrecoValor;
  status: ContratoStatusValor;
  dataInicio: string;
  dataFim: string | null;
  observacao: string | null;
  liquidadoEm: string | null;
  entregueEm: string | null;
}

export interface CriarContratoPayload {
  clienteId: string;
  produtoId: string;
  quantidade: number;
  preco: number;
  fontePreco: FontePrecoValor;
  dataInicio: string;
  dataFim?: string | null;
  observacao?: string | null;
}

export type EditarContratoPayload = CriarContratoPayload;

export interface CotacaoMercadoDto {
  produto: string;
  fonte: FontePrecoValor;
  preco: number;
  consultadoEm: string;
}

export interface ListarCotacaoMercadoParams {
  produto?: string;
  fonte?: FontePrecoValor;
}

export interface ContratoFormModel {
  clienteId: string;
  produtoId: string;
  quantidade: string;
  preco: string;
  fontePreco: FontePrecoValor | '';
  dataInicio: string;
  dataFim: string;
  observacao: string;
}
