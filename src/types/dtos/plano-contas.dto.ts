import type { NaturezaContaContabilValor } from 'constants/enums';

export interface ContaContabilDto {
  id: string;
  codigo: string;
  nome: string;
  natureza: NaturezaContaContabilValor;
  analitica: boolean;
  nivel: number;
  paiId: string | null;
  ativo: boolean;
  dataAlteracao: string | null;
}

export interface CriarContaContabilPayload {
  codigo: string;
  nome: string;
  natureza: NaturezaContaContabilValor;
  analitica: boolean;
  paiId: string | null;
}

export interface EditarContaContabilPayload {
  nome: string;
  natureza: NaturezaContaContabilValor;
  analitica: boolean;
}

export interface ContaContabilFormModel {
  codigo: string;
  nome: string;
  natureza: NaturezaContaContabilValor;
  analitica: boolean;
  paiId: string | null;
}
