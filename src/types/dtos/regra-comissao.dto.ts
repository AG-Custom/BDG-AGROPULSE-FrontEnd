import type { CanalVendaValor } from 'constants/enums';

export interface RegraComissaoDto {
  id: string;
  empresaId: string;
  unidadeId: string;
  canal: CanalVendaValor | null;
  descontoDe: number;
  descontoAte: number;
  percentual: number;
  ativo: boolean;
}

export interface CriarRegraComissaoPayload {
  canal?: CanalVendaValor | null;
  descontoDe: number;
  descontoAte: number;
  percentual: number;
}

export type EditarRegraComissaoPayload = CriarRegraComissaoPayload;

export interface ListarRegrasComissaoParams {
  ativo?: boolean;
}

export interface RegraComissaoFormModel {
  canal: CanalVendaValor | '';
  descontoDe: string;
  descontoAte: string;
  percentual: string;
}
