import type {
  ClassificacaoCreditoValor,
  EtapaOportunidadeValor,
  StatusAmostraCampoValor,
  StatusAnaliseCreditoValor,
  StatusCampanhaValor,
  TipoCanalCampanhaValor,
} from 'constants/enums';

export interface CrmDashboardDto {
  visitasMes: number;
  oportunidadesAbertas: number;
  valorPipeline: number;
  amostrasAtivas: number;
  conversaoAmostrasPct: number;
  scoreMedioCredito: number | null;
  campanhasAtivas: number;
}

export interface SafraResumoDto {
  id: string;
  nome: string;
  cultura: string;
  areaHa: number | null;
  status: string;
}

export interface FazendaCarteiraDto {
  id: string;
  nome: string;
  clienteId: string | null;
  areaTotalHa: number | null;
  municipio: string | null;
  uf: string | null;
}

export interface CarteiraClienteItemDto {
  clienteId: string;
  clienteNome: string;
  vendedorUsuarioId: string | null;
  areaTotalHa: number;
  culturas: string[];
  qtdFazendas: number;
  safraAtual: string | null;
}

export interface CarteiraAgronomicaDto {
  clienteId: string | null;
  vendedorId: string | null;
  areaTotalHa: number;
  culturas: string[];
  safrasResumo: SafraResumoDto[];
  fazendas: FazendaCarteiraDto[];
  itens: CarteiraClienteItemDto[];
}

export interface ListarCarteiraAgronomicaParams {
  clienteId?: string;
  vendedorId?: string;
}

export interface OportunidadeDto {
  id: string;
  empresaId: string;
  clienteId: string;
  vendedorUsuarioId: string | null;
  produtoId: string | null;
  produtoNome: string | null;
  cultura: string | null;
  safraRef: string | null;
  valorEstimado: number;
  etapa: EtapaOportunidadeValor;
  probabilidade: number;
  dataPrevista: string | null;
  observacoes: string | null;
}

export interface CriarOportunidadePayload {
  clienteId: string;
  vendedorUsuarioId?: string | null;
  produtoId?: string | null;
  produtoNome?: string | null;
  cultura?: string | null;
  safraRef?: string | null;
  valorEstimado: number;
  etapa: EtapaOportunidadeValor;
  probabilidade: number;
  dataPrevista?: string | null;
  observacoes?: string | null;
}

export type EditarOportunidadePayload = CriarOportunidadePayload;

export interface AlterarEtapaOportunidadePayload {
  etapa: EtapaOportunidadeValor;
  probabilidade?: number | null;
}

export interface OportunidadeFormModel {
  clienteId: string;
  vendedorUsuarioId: string;
  produtoId: string;
  produtoNome: string;
  cultura: string;
  safraRef: string;
  valorEstimado: string;
  etapa: EtapaOportunidadeValor;
  probabilidade: string;
  dataPrevista: string;
  observacoes: string;
}

export interface AmostraCampoDto {
  id: string;
  empresaId: string;
  clienteId: string;
  vendedorUsuarioId: string | null;
  produtoId: string | null;
  produtoNome: string | null;
  quantidade: number;
  unidade: string | null;
  cultura: string | null;
  dataEntrega: string;
  dataRetorno: string | null;
  status: StatusAmostraCampoValor;
  resultado: string | null;
  pedidoVendaId: string | null;
}

export interface CriarAmostraCampoPayload {
  clienteId: string;
  vendedorUsuarioId?: string | null;
  produtoId?: string | null;
  produtoNome?: string | null;
  quantidade: number;
  unidade?: string | null;
  cultura?: string | null;
  dataEntrega: string;
  dataRetorno?: string | null;
  status: StatusAmostraCampoValor;
  resultado?: string | null;
  pedidoVendaId?: string | null;
}

export type EditarAmostraCampoPayload = CriarAmostraCampoPayload;

export interface AmostraCampoFormModel {
  clienteId: string;
  vendedorUsuarioId: string;
  produtoId: string;
  produtoNome: string;
  quantidade: string;
  unidade: string;
  cultura: string;
  dataEntrega: string;
  dataRetorno: string;
  status: StatusAmostraCampoValor;
  resultado: string;
  pedidoVendaId: string;
}

export interface CampanhaDto {
  id: string;
  empresaId: string;
  nome: string;
  tipoCanal: TipoCanalCampanhaValor;
  segmento: string | null;
  status: StatusCampanhaValor;
  dataInicio: string | null;
  dataFim: string | null;
  envios: number;
  aberturas: number;
  respostas: number;
  conversoes: number;
}

export interface CriarCampanhaPayload {
  nome: string;
  tipoCanal: TipoCanalCampanhaValor;
  segmento?: string | null;
  status: StatusCampanhaValor;
  dataInicio?: string | null;
  dataFim?: string | null;
}

export type EditarCampanhaPayload = CriarCampanhaPayload;

export interface CampanhaFormModel {
  nome: string;
  tipoCanal: TipoCanalCampanhaValor;
  segmento: string;
  status: StatusCampanhaValor;
  dataInicio: string;
  dataFim: string;
}

export interface AnaliseCreditoDto {
  id: string;
  empresaId: string;
  clienteId: string;
  score: number;
  classificacao: ClassificacaoCreditoValor | string;
  limiteSugerido: number;
  limiteAprovado: number | null;
  adimplenciaPct: number | null;
  parcelasAtraso: number | null;
  status: StatusAnaliseCreditoValor;
  observacoes: string | null;
  analisadoEm: string;
  analistaUsuarioId: string | null;
}

export interface CriarAnaliseCreditoPayload {
  clienteId: string;
  score: number;
  classificacao: string;
  limiteSugerido: number;
  limiteAprovado?: number | null;
  adimplenciaPct?: number | null;
  parcelasAtraso?: number | null;
  status: StatusAnaliseCreditoValor;
  observacoes?: string | null;
  analisadoEm?: string | null;
  analistaUsuarioId?: string | null;
}

export type EditarAnaliseCreditoPayload = CriarAnaliseCreditoPayload;

export interface PreferenciaClienteDto {
  id: string;
  empresaId: string;
  clienteId: string;
  chave: string;
  valor: string;
  observacoes: string | null;
}

export interface CriarPreferenciaClientePayload {
  clienteId: string;
  chave: string;
  valor: string;
  observacoes?: string | null;
}

export type EditarPreferenciaClientePayload = CriarPreferenciaClientePayload;

export interface PreferenciaClienteFormModel {
  chave: string;
  valor: string;
  observacoes: string;
}

export interface ClientePerfil360Dto {
  clienteId: string;
  preferencias: PreferenciaClienteDto[];
  ultimaAnaliseCredito: AnaliseCreditoDto | null;
  qtdOportunidades: number;
  qtdAmostras: number;
  qtdVisitas: number;
}
