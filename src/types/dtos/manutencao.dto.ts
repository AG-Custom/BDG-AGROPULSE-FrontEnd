import type {
  GatilhoPlanoManutencaoValor,
  MetodoDepreciacaoValor,
  PrioridadeOrdemServicoManutencaoValor,
  StatusAtivoManutencaoValor,
  StatusChecklistInspecaoValor,
  StatusOrdemServicoManutencaoValor,
  StatusPlanoManutencaoValor,
  TipoAtivoManutencaoValor,
  TipoOrdemServicoManutencaoValor,
} from 'constants/enums';

export interface AtivoManutencaoDto {
  id: string;
  empresaId: string;
  unidadeId: string;
  nome: string;
  tipo: TipoAtivoManutencaoValor;
  fabricante: string | null;
  modelo: string | null;
  numeroSerie: string | null;
  ano: number | null;
  valorAquisicao: number | null;
  dataAquisicao: string | null;
  vidaUtilAnos: number | null;
  valorResidual: number | null;
  metodoDepreciacao: MetodoDepreciacaoValor;
  horimetroAtual: number | null;
  kmAtual: number | null;
  ultimaManutencao: string | null;
  proximaManutencao: string | null;
  status: StatusAtivoManutencaoValor;
  localizacao: string | null;
}

export interface CriarAtivoManutencaoPayload {
  nome: string;
  tipo: TipoAtivoManutencaoValor;
  fabricante?: string | null;
  modelo?: string | null;
  numeroSerie?: string | null;
  ano?: number | null;
  valorAquisicao?: number | null;
  dataAquisicao?: string | null;
  vidaUtilAnos?: number | null;
  valorResidual?: number | null;
  metodoDepreciacao: MetodoDepreciacaoValor;
  horimetroAtual?: number | null;
  kmAtual?: number | null;
  ultimaManutencao?: string | null;
  proximaManutencao?: string | null;
  status: StatusAtivoManutencaoValor;
  localizacao?: string | null;
}

export type EditarAtivoManutencaoPayload = CriarAtivoManutencaoPayload;

export interface AtivoManutencaoFormModel {
  nome: string;
  tipo: TipoAtivoManutencaoValor | '';
  fabricante: string;
  modelo: string;
  numeroSerie: string;
  ano: string;
  valorAquisicao: string;
  dataAquisicao: string;
  vidaUtilAnos: string;
  valorResidual: string;
  metodoDepreciacao: MetodoDepreciacaoValor | '';
  horimetroAtual: string;
  kmAtual: string;
  status: StatusAtivoManutencaoValor;
  localizacao: string;
}

export interface DepreciacaoAtivoDto {
  ativoId: string;
  valorAquisicao: number;
  valorResidual: number;
  depreciacaoAcumulada: number;
  valorContabilAtual: number;
  baseDepreciavel: number;
  depreciacaoAnual: number;
  depreciacaoMensal: number;
  metodo: MetodoDepreciacaoValor;
  anosDecorridos: number;
}

export interface LeituraHorimetroDto {
  id: string;
  empresaId: string;
  ativoId: string;
  horimetro: number;
  km: number | null;
  lidoEm: string;
  origem: string;
  dispositivoId: string | null;
}

export interface LeituraHorimetroPayload {
  horimetro: number;
  km?: number | null;
  lidoEm?: string | null;
  dispositivoId?: string | null;
}

export interface LeituraHorimetroFormModel {
  horimetro: string;
  km: string;
  lidoEm: string;
}

export interface TelemetriaLeituraPayload {
  ativoId: string;
  horimetro: number;
  km?: number | null;
  lidoEm?: string | null;
  dispositivoId?: string | null;
}

export interface TelemetriaLeituraFormModel {
  horimetro: string;
  km: string;
  dispositivoId: string;
}

export interface PlanoManutencaoDto {
  id: string;
  empresaId: string;
  ativoId: string;
  descricao: string;
  tipoGatilho: GatilhoPlanoManutencaoValor;
  intervalo: number;
  ultimaExecucao: string | null;
  ultimoValor: number | null;
  proximoValor: number | null;
  proximaExecucao: string | null;
  status: StatusPlanoManutencaoValor;
}

export interface CriarPlanoManutencaoPayload {
  ativoId: string;
  descricao: string;
  tipoGatilho: GatilhoPlanoManutencaoValor;
  intervalo: number;
}

export type EditarPlanoManutencaoPayload = CriarPlanoManutencaoPayload;

export interface PlanoManutencaoFormModel {
  ativoId: string;
  descricao: string;
  tipoGatilho: GatilhoPlanoManutencaoValor | '';
  intervalo: string;
}

export interface RegistrarExecucaoPlanoPayload {
  dataExecucao: string;
  valorMedidor?: number | null;
}

export interface RegistrarExecucaoPlanoFormModel {
  dataExecucao: string;
  valorMedidor: string;
}

export interface PecaOrdemServicoDto {
  id: string;
  ordemId: string;
  produtoId: string | null;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  baixaEstoqueRealizada: boolean;
  movimentacaoEstoqueId: string | null;
}

export interface OrdemServicoManutencaoDto {
  id: string;
  empresaId: string;
  unidadeId: string;
  ativoId: string;
  planoId: string | null;
  numero: string;
  tipo: TipoOrdemServicoManutencaoValor;
  prioridade: PrioridadeOrdemServicoManutencaoValor;
  descricao: string;
  causaRaiz: string | null;
  responsavelNome: string | null;
  colaboradorId: string | null;
  dataAbertura: string;
  dataPrevisao: string | null;
  dataConclusao: string | null;
  horasTrabalhadas: number | null;
  custoMaoObra: number;
  custoPecas: number;
  custoTotal: number;
  status: StatusOrdemServicoManutencaoValor;
  pecas: PecaOrdemServicoDto[];
}

export interface CriarOrdemServicoManutencaoPayload {
  ativoId: string;
  tipo: TipoOrdemServicoManutencaoValor;
  prioridade: PrioridadeOrdemServicoManutencaoValor;
  descricao: string;
  dataAbertura: string;
  planoId?: string | null;
  causaRaiz?: string | null;
  responsavelNome?: string | null;
  colaboradorId?: string | null;
  dataPrevisao?: string | null;
  horasTrabalhadas?: number | null;
  custoMaoObra: number;
}

export type EditarOrdemServicoManutencaoPayload = CriarOrdemServicoManutencaoPayload;

export interface OrdemServicoManutencaoFormModel {
  ativoId: string;
  tipo: TipoOrdemServicoManutencaoValor;
  prioridade: PrioridadeOrdemServicoManutencaoValor;
  descricao: string;
  dataAbertura: string;
  planoId: string;
  causaRaiz: string;
  responsavelNome: string;
  colaboradorId: string;
  dataPrevisao: string;
  horasTrabalhadas: string;
  custoMaoObra: string;
}

export interface ConcluirOrdemServicoPayload {
  dataConclusao?: string | null;
  horasTrabalhadas?: number | null;
  custoMaoObra?: number | null;
}

export interface AdicionarPecaOsPayload {
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  produtoId?: string | null;
  baixarAgora: boolean;
}

export interface AdicionarPecaOsFormModel {
  produtoId: string;
  descricao: string;
  quantidade: string;
  valorUnitario: string;
  baixarAgora: boolean;
}

export interface ItemChecklistManutencaoDto {
  id: string;
  descricao: string;
  ok: boolean;
  observacao: string | null;
}

export interface ChecklistManutencaoDto {
  id: string;
  empresaId: string;
  unidadeId: string;
  ativoId: string;
  data: string;
  operadorNome: string;
  horimetro: number;
  status: StatusChecklistInspecaoValor;
  sincronizado: boolean;
  itens: ItemChecklistManutencaoDto[];
}

export interface ItemChecklistFormModel {
  chave: string;
  descricao: string;
  ok: boolean;
  observacao: string;
}

export interface CriarChecklistManutencaoPayload {
  ativoId: string;
  data: string;
  operadorNome: string;
  horimetro: number;
  status: StatusChecklistInspecaoValor;
  itens: Array<{
    descricao: string;
    ok: boolean;
    observacao?: string | null;
  }>;
}

export interface ChecklistManutencaoFormModel {
  ativoId: string;
  data: string;
  operadorNome: string;
  horimetro: string;
  status: StatusChecklistInspecaoValor;
  itens: ItemChecklistFormModel[];
}

export interface CustoManutencaoItemDto {
  ordemId: string;
  numero: string;
  ativoId: string;
  tipo: TipoOrdemServicoManutencaoValor;
  dataAbertura: string;
  dataConclusao: string | null;
  custoMaoObra: number;
  custoPecas: number;
  custoTotal: number;
  status: StatusOrdemServicoManutencaoValor;
}

export interface RelatorioCustosManutencaoDto {
  totalMaoObra: number;
  totalPecas: number;
  totalGeral: number;
  itens: CustoManutencaoItemDto[];
}

export interface ListarCustosManutencaoParams {
  ativoId?: string;
  de?: string;
  ate?: string;
  tipo?: TipoOrdemServicoManutencaoValor | '';
}

export interface ManutencaoDashboardDto {
  totalAtivos: number;
  ativosOperacionais: number;
  ativosEmManutencao: number;
  ordensAbertas: number;
  planosVencidos: number;
}
