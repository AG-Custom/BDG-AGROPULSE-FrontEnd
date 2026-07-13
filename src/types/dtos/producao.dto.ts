import type { OrdemProducaoStatusValor } from 'constants/enums';

export interface ItemOrdemProducaoDto {
  id: string;
  produtoInsumoId: string;
  quantidade: number;
}

export interface OrdemProducaoDto {
  id: string;
  empresaId: string;
  unidadeId: string;
  produtoSaidaId: string;
  quantidadePlanejada: number;
  quantidadeProduzida: number | null;
  status: OrdemProducaoStatusValor;
  dataPrevista: string | null;
  concluidaEm: string | null;
  observacao: string | null;
  itens: ItemOrdemProducaoDto[];
}

export interface ItemOrdemProducaoPayload {
  produtoInsumoId: string;
  quantidade: number;
}

export interface CriarOrdemProducaoPayload {
  produtoSaidaId: string;
  quantidadePlanejada: number;
  dataPrevista?: string | null;
  observacao?: string | null;
  itens: ItemOrdemProducaoPayload[];
}

export type EditarOrdemProducaoPayload = CriarOrdemProducaoPayload;

export interface ConcluirOrdemProducaoPayload {
  quantidadeProduzida: number;
}

export interface BeneficiamentoLoteDto {
  id: string;
  empresaId: string;
  unidadeId: string;
  produtoEntradaId: string;
  produtoSaidaId: string;
  quantidadeEntrada: number;
  quantidadeSaida: number;
  rendimentoPercentual: number;
  observacao: string | null;
}

export interface CriarBeneficiamentoLotePayload {
  produtoEntradaId: string;
  produtoSaidaId: string;
  quantidadeEntrada: number;
  quantidadeSaida: number;
  observacao?: string | null;
}

export type EditarBeneficiamentoLotePayload = CriarBeneficiamentoLotePayload;

export interface ItemOrdemProducaoFormModel {
  chave: string;
  produtoInsumoId: string;
  quantidade: string;
}

export interface OrdemProducaoFormModel {
  produtoSaidaId: string;
  quantidadePlanejada: string;
  dataPrevista: string;
  observacao: string;
  itens: ItemOrdemProducaoFormModel[];
}

export interface BeneficiamentoLoteFormModel {
  produtoEntradaId: string;
  produtoSaidaId: string;
  quantidadeEntrada: string;
  quantidadeSaida: string;
  observacao: string;
}
