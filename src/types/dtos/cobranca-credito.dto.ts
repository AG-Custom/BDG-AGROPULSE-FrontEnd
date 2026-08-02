import type {
  BureauCreditoValor,
  CanalTentativaCobrancaValor,
  StatusAcordoJudicialValor,
  StatusAdimplenciaCarteiraValor,
  StatusDisputaTituloValor,
  StatusEncaminhamentoJuridicoValor,
  TipoGarantiaCreditoValor,
} from 'constants/enums';

export interface CobrancaCreditoConfigDto {
  id: string;
  pesoHistoricoPagamento: number;
  pesoTempoRelacionamento: number;
  pesoVolumeCompras: number;
  pesoDadosCadastrais: number;
  maxConcentracaoPct: number;
  pddFaixa1a15: number;
  pddFaixa16a30: number;
  pddFaixa31a60: number;
  pddFaixa61a90: number;
  pddFaixa91a180: number;
  pddFaixaAcima180: number;
  diasAtrasoBloqueioPorPerfil: string | null;
  bloqueioEfetivo: boolean;
  limiteGerente: number;
  limiteDiretor: number;
  limiteCeo: number;
  scoreMinimoRevisao: number;
}

export type CobrancaCreditoConfigPayload = Omit<CobrancaCreditoConfigDto, 'id'>;

export interface CobrancaCreditoConfigFormModel {
  pesoHistoricoPagamento: string;
  pesoTempoRelacionamento: string;
  pesoVolumeCompras: string;
  pesoDadosCadastrais: string;
  maxConcentracaoPct: string;
  pddFaixa1a15: string;
  pddFaixa16a30: string;
  pddFaixa31a60: string;
  pddFaixa61a90: string;
  pddFaixa91a180: string;
  pddFaixaAcima180: string;
  diasAtrasoBloqueioPorPerfil: string;
  bloqueioEfetivo: boolean;
  limiteGerente: string;
  limiteDiretor: string;
  limiteCeo: string;
  scoreMinimoRevisao: string;
}

export interface CarteiraClienteItemDto {
  clienteId: string;
  clienteNome: string;
  telefone: string | null;
  limiteCredito: number;
  utilizado: number;
  disponivel: number;
  maiorAtrasoDias: number;
  statusAdimplencia: StatusAdimplenciaCarteiraValor | string;
}

export interface CarteiraCreditoDto {
  clientes: CarteiraClienteItemDto[];
  limiteTotal: number;
  utilizadoTotal: number;
  disponivelTotal: number;
  inadimplenciaPct: number;
}

export interface AgingFaixaDto {
  quantidade: number;
  valor: number;
}

export interface AgingCarteiraDto {
  aVencer: AgingFaixaDto;
  de1a15: AgingFaixaDto;
  de16a30: AgingFaixaDto;
  de31a60: AgingFaixaDto;
  de61a90: AgingFaixaDto;
  de91a180: AgingFaixaDto;
  acima180: AgingFaixaDto;
}

export interface ConcentracaoItemDto {
  clienteId: string;
  clienteNome: string;
  exposicao: number;
  percentualCarteira: number;
  acimaLimite: boolean;
}

export interface InadimplenciaSnapshotDto {
  id: string;
  data: string;
  indicePct: number;
  valorVencido: number;
  valorCarteira: number;
  qtdTitulosVencidos: number;
}

export interface InadimplenciaIndiceDto {
  data: string;
  indicePct: number;
  valorVencido: number;
  valorCarteira: number;
  qtdTitulosVencidos: number;
  historicoMensal: InadimplenciaSnapshotDto[];
}

export interface PddFaixaDto {
  faixa: string;
  quantidade: number;
  valor: number;
  percentualProvisionamento: number;
  valorProvisionado: number;
}

export interface PddCarteiraDto {
  faixas: PddFaixaDto[];
  totalExposicao: number;
  totalProvisionado: number;
}

export interface FichaCreditoRuralDto {
  id: string;
  clienteId: string;
  analiseCreditoId: string | null;
  areaPlantadaHa: number | null;
  culturaPrincipal: string | null;
  produtividadeEsperada: number | null;
  rendaEstimada: number | null;
  endividamentoTotal: number | null;
  observacoesGarantias: string | null;
}

export interface CriarFichaCreditoRuralPayload {
  clienteId: string;
  analiseCreditoId?: string | null;
  areaPlantadaHa?: number | null;
  culturaPrincipal?: string | null;
  produtividadeEsperada?: number | null;
  rendaEstimada?: number | null;
  endividamentoTotal?: number | null;
  observacoesGarantias?: string | null;
}

export type EditarFichaCreditoRuralPayload = CriarFichaCreditoRuralPayload;

export interface FichaCreditoRuralFormModel {
  clienteId: string;
  analiseCreditoId: string;
  areaPlantadaHa: string;
  culturaPrincipal: string;
  produtividadeEsperada: string;
  rendaEstimada: string;
  endividamentoTotal: string;
  observacoesGarantias: string;
}

export interface AplicarLimitePayload {
  limiteAprovado: number;
  aprovar: boolean;
}

export interface AplicarLimiteResponseDto {
  analiseId: string;
  clienteId: string;
  status: string;
  limiteAprovado: number | null;
  limiteAplicado: number;
}

export interface BureauConsultaPayload {
  clienteId: string;
  bureau: BureauCreditoValor;
}

export interface BureauConsultaDto {
  stub: boolean;
  scoreExterno: number;
  mensagem: string;
  consultadoEm: string;
  bureau: BureauCreditoValor | string;
  clienteId: string;
}

export interface ListaDiariaItemDto {
  contaReceberId: string;
  clienteId: string;
  clienteNome: string;
  telefone: string | null;
  saldo: number;
  vencimento: string;
  diasAtraso: number;
  prioridade: number;
}

export interface TentativaCobrancaDto {
  id: string;
  contaReceberId: string;
  clienteId: string;
  canal: CanalTentativaCobrancaValor | string;
  resultado: string;
  observacao: string | null;
  ocorridoEm: string;
}

export interface CriarTentativaCobrancaPayload {
  contaReceberId: string;
  clienteId: string;
  canal: CanalTentativaCobrancaValor;
  resultado: string;
  observacao?: string | null;
  ocorridoEm?: string | null;
}

export interface TentativaCobrancaFormModel {
  canal: CanalTentativaCobrancaValor;
  resultado: string;
  observacao: string;
}

export interface DisputaTituloDto {
  id: string;
  contaReceberId: string;
  motivo: string;
  status: StatusDisputaTituloValor | string;
  abertoEm: string;
  resolvidoEm: string | null;
  resolucao: string | null;
}

export interface CriarDisputaTituloPayload {
  contaReceberId: string;
  motivo: string;
}

export interface ResolverDisputaPayload {
  resolucao?: string | null;
  encerrar: boolean;
}

export interface EncaminhamentoJuridicoDto {
  id: string;
  clienteId: string;
  contaReceberIds: string;
  status: StatusEncaminhamentoJuridicoValor | string;
  pacoteDocsUrl: string | null;
  observacoes: string | null;
  encaminhadoEm: string;
}

export interface EncaminhamentoJuridicoAnexoDto {
  id: string;
  nomeOriginal: string;
  contentType: string;
  tamanhoBytes: number;
  urlPublica: string | null;
}

export interface CriarEncaminhamentoJuridicoPayload {
  clienteId: string;
  contaReceberIds: string[];
  pacoteDocsUrl?: string | null;
  observacoes?: string | null;
}

export interface AcordoJudicialDto {
  id: string;
  clienteId: string;
  renegociacaoId: string | null;
  valorOriginal: number;
  valorAcordado: number;
  parcelas: number;
  status: StatusAcordoJudicialValor | string;
  inicio: string;
  fim: string | null;
  observacoes: string | null;
}

export interface CriarAcordoJudicialPayload {
  clienteId: string;
  renegociacaoId?: string | null;
  valorOriginal: number;
  valorAcordado: number;
  parcelas: number;
  status?: StatusAcordoJudicialValor;
  inicio: string;
  fim?: string | null;
  observacoes?: string | null;
}

export interface AcordoJudicialFormModel {
  clienteId: string;
  valorOriginal: string;
  valorAcordado: string;
  parcelas: string;
  inicio: string;
  observacoes: string;
}

export interface GarantiaCreditoDto {
  id: string;
  clienteId: string;
  tipo: TipoGarantiaCreditoValor | string;
  descricao: string;
  valor: number;
  vigenciaInicio: string | null;
  vigenciaFim: string | null;
  ativo: boolean;
}

export interface CriarGarantiaCreditoPayload {
  clienteId: string;
  tipo: TipoGarantiaCreditoValor;
  descricao: string;
  valor: number;
  vigenciaInicio?: string | null;
  vigenciaFim?: string | null;
  ativo?: boolean;
}

export interface GarantiaCreditoFormModel {
  clienteId: string;
  tipo: TipoGarantiaCreditoValor | '';
  descricao: string;
  valor: string;
  vigenciaInicio: string;
  vigenciaFim: string;
  ativo: boolean;
}

export interface RevisaoLimiteItemDto {
  clienteId: string;
  clienteNome: string;
  limiteCredito: number;
  utilizado: number;
  maiorAtrasoDias: number;
  scoreRecente: number | null;
  motivo: string;
}
