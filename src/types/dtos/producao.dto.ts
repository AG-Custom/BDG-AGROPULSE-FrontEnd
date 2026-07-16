import type {
  BeneficiamentoLoteStatusValor,
  LaudoQualidadeStatusValor,
  OrdemProducaoStatusValor,
  OrigemGenealogiaLoteValor,
  TipoSaidaBeneficiamentoValor,
} from 'constants/enums';

export interface ItemOrdemProducaoDto {
  id: string;
  produtoInsumoId: string;
  quantidade: number;
}

export interface ApontamentoConsumoDto {
  id: string;
  produtoInsumoId: string;
  loteId: string | null;
  quantidade: number;
  etapa: string | null;
  apontadoEm: string;
}

export interface ApontamentoProducaoDto {
  id: string;
  quantidade: number;
  dispositivoId: string | null;
  apontadoEm: string;
}

export interface OrdemProducaoDto {
  id: string;
  empresaId: string;
  unidadeId: string;
  produtoSaidaId: string;
  receitaId?: string | null;
  quantidadePlanejada: number;
  quantidadeProduzida: number | null;
  status: OrdemProducaoStatusValor;
  dataPrevista: string | null;
  concluidaEm: string | null;
  observacao: string | null;
  custoInsumosPlanejado?: number | null;
  custoInsumosReal?: number | null;
  custoMaoObra?: number | null;
  custoOverhead?: number | null;
  custoTotalPlanejado?: number | null;
  custoTotalReal?: number | null;
  itens: ItemOrdemProducaoDto[];
  apontamentosConsumo?: ApontamentoConsumoDto[];
  apontamentosProducao?: ApontamentoProducaoDto[];
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
  receitaId?: string | null;
  itens: ItemOrdemProducaoPayload[];
}

export type EditarOrdemProducaoPayload = CriarOrdemProducaoPayload;

export interface ConcluirOrdemProducaoPayload {
  quantidadeProduzida: number;
  custoMaoObra?: number | null;
  custoOverhead?: number | null;
}

export interface CriarApontamentoConsumoPayload {
  produtoInsumoId: string;
  loteId?: string | null;
  quantidade: number;
  etapa?: string | null;
}

export interface CriarApontamentoProducaoPayload {
  quantidade: number;
  dispositivoId?: string | null;
}

export interface BeneficiamentoLoteSaidaDto {
  id: string;
  produtoId: string;
  loteId: string | null;
  numeroLote: string | null;
  quantidade: number;
  tipo: TipoSaidaBeneficiamentoValor;
  destinoPerda: string | null;
}

export interface BeneficiamentoLoteDto {
  id: string;
  empresaId: string;
  unidadeId: string;
  produtoEntradaId: string;
  produtoSaidaId: string;
  loteEntradaId: string | null;
  quantidadeEntrada: number;
  quantidadeSaida: number;
  rendimentoPercentual: number;
  status?: BeneficiamentoLoteStatusValor;
  observacao: string | null;
  saidas?: BeneficiamentoLoteSaidaDto[];
}

export interface SaidaBeneficiamentoPayload {
  produtoId: string;
  quantidade: number;
  tipo: TipoSaidaBeneficiamentoValor;
  numeroLote?: string | null;
  destinoPerda?: string | null;
}

export interface CriarBeneficiamentoLotePayload {
  produtoEntradaId: string;
  produtoSaidaId: string;
  quantidadeEntrada: number;
  quantidadeSaida: number;
  loteEntradaId?: string | null;
  observacao?: string | null;
  saidas: SaidaBeneficiamentoPayload[];
}

export type EditarBeneficiamentoLotePayload = CriarBeneficiamentoLotePayload;

export interface ItemReceitaProducaoDto {
  id: string;
  produtoInsumoId: string;
  quantidade: number;
  toleranciaPct: number | null;
  quantidadeMin: number;
  quantidadeMax: number;
}

export interface ReceitaProducaoDto {
  id: string;
  empresaId: string;
  produtoSaidaId: string;
  versao: number;
  ativa: boolean;
  observacao: string | null;
  itens: ItemReceitaProducaoDto[];
}

export interface ItemReceitaProducaoPayload {
  produtoInsumoId: string;
  quantidade: number;
  toleranciaPct?: number | null;
}

export interface CriarReceitaProducaoPayload {
  produtoSaidaId: string;
  versao: number;
  observacao?: string | null;
  itens: ItemReceitaProducaoPayload[];
}

export type EditarReceitaProducaoPayload = CriarReceitaProducaoPayload;

export interface ParametroLaudoDto {
  id: string;
  nome: string;
  valor: string;
  unidade: string | null;
  minimo: string | null;
  maximo: string | null;
}

export interface LaudoQualidadeDto {
  id: string;
  empresaId: string;
  unidadeId: string;
  loteId: string;
  produtoId: string;
  ordemProducaoId: string | null;
  dataAnalise: string;
  resultado: string | null;
  status: LaudoQualidadeStatusValor;
  parametros: ParametroLaudoDto[];
}

export interface ParametroLaudoPayload {
  nome: string;
  valor: string;
  unidade?: string | null;
  minimo?: string | null;
  maximo?: string | null;
}

export interface CriarLaudoQualidadePayload {
  loteId: string;
  produtoId: string;
  ordemProducaoId?: string | null;
  dataAnalise: string;
  resultado?: string | null;
  parametros: ParametroLaudoPayload[];
}

export type EditarLaudoQualidadePayload = CriarLaudoQualidadePayload;

export interface ReprovarLaudoPayload {
  resultado?: string | null;
}

export interface FichaTecnicaProcessoDto {
  id: string;
  empresaId: string;
  unidadeId: string;
  produtoId: string | null;
  receitaId: string | null;
  temperaturaMin: number | null;
  temperaturaMax: number | null;
  umidadeMin: number | null;
  umidadeMax: number | null;
  tempoMinutos: number | null;
  observacao: string | null;
}

export interface CriarFichaTecnicaProcessoPayload {
  produtoId?: string | null;
  receitaId?: string | null;
  temperaturaMin?: number | null;
  temperaturaMax?: number | null;
  umidadeMin?: number | null;
  umidadeMax?: number | null;
  tempoMinutos?: number | null;
  observacao?: string | null;
}

export type EditarFichaTecnicaProcessoPayload = CriarFichaTecnicaProcessoPayload;

export interface ParadaLinhaDto {
  id: string;
  empresaId: string;
  unidadeId: string;
  ordemProducaoId: string;
  causa: string;
  inicio: string;
  fim: string | null;
  impactoUnidades: number | null;
  resolvida: boolean;
  equipamento: string | null;
}

export interface CriarParadaLinhaPayload {
  ordemProducaoId: string;
  causa: string;
  inicio: string;
  fim?: string | null;
  impactoUnidades?: number | null;
  equipamento?: string | null;
}

export type EditarParadaLinhaPayload = CriarParadaLinhaPayload;

export interface ResolverParadaLinhaPayload {
  fim?: string | null;
  impactoUnidades?: number | null;
}

export interface OeeDto {
  mes: number;
  ano: number;
  disponibilidade: number;
  performance: number;
  qualidade: number;
  oee: number;
  heuristica?: string;
  tempoTotalMinutos?: number;
  tempoParadaMinutos?: number;
  quantidadePlanejada?: number;
  quantidadeProduzida?: number;
  laudosAprovados?: number;
  laudosTotal?: number;
}

export interface GenealogiaVinculoDto {
  id: string;
  lotePaiId: string;
  loteFilhoId: string;
  quantidade: number;
  origem: OrigemGenealogiaLoteValor | string;
  referenciaId: string;
}

export interface GenealogiaLoteDto {
  loteId: string;
  pais: GenealogiaVinculoDto[];
  filhos: GenealogiaVinculoDto[];
}

export interface ItemOrdemProducaoFormModel {
  chave: string;
  produtoInsumoId: string;
  quantidade: string;
}

export interface OrdemProducaoFormModel {
  produtoSaidaId: string;
  receitaId: string;
  quantidadePlanejada: string;
  dataPrevista: string;
  observacao: string;
  itens: ItemOrdemProducaoFormModel[];
}

export interface SaidaBeneficiamentoFormModel {
  chave: string;
  produtoId: string;
  quantidade: string;
  tipo: TipoSaidaBeneficiamentoValor;
  numeroLote: string;
  destinoPerda: string;
}

export interface BeneficiamentoLoteFormModel {
  produtoEntradaId: string;
  produtoSaidaId: string;
  loteEntradaId: string;
  quantidadeEntrada: string;
  quantidadeSaida: string;
  observacao: string;
  saidas: SaidaBeneficiamentoFormModel[];
}

export interface ItemReceitaFormModel {
  chave: string;
  produtoInsumoId: string;
  quantidade: string;
  toleranciaPct: string;
}

export interface ReceitaProducaoFormModel {
  produtoSaidaId: string;
  versao: string;
  observacao: string;
  itens: ItemReceitaFormModel[];
}

export interface ParametroLaudoFormModel {
  chave: string;
  nome: string;
  valor: string;
  unidade: string;
  minimo: string;
  maximo: string;
}

export interface LaudoQualidadeFormModel {
  loteId: string;
  produtoId: string;
  ordemProducaoId: string;
  dataAnalise: string;
  resultado: string;
  parametros: ParametroLaudoFormModel[];
}

export interface FichaTecnicaFormModel {
  produtoId: string;
  receitaId: string;
  temperaturaMin: string;
  temperaturaMax: string;
  umidadeMin: string;
  umidadeMax: string;
  tempoMinutos: string;
  observacao: string;
}

export interface ParadaLinhaFormModel {
  ordemProducaoId: string;
  causa: string;
  inicio: string;
  fim: string;
  impactoUnidades: string;
  equipamento: string;
}
