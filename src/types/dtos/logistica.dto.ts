import type {
  StatusCargaLogisticaValor,
  StatusDocTransporteLogisticaValor,
  StatusOcorrenciaEntregaValor,
  StatusRomaneioLogisticaValor,
  StatusVeiculoLogisticaValor,
  TipoCombustivelLogisticaValor,
  TipoDocTransporteLogisticaValor,
  TipoOcorrenciaEntregaValor,
  TipoVeiculoLogisticaValor,
} from 'constants/enums';

export interface VeiculoLogisticaDto {
  id: string;
  empresaId: string;
  unidadeId: string;
  tipo: TipoVeiculoLogisticaValor;
  placa: string;
  marca: string | null;
  modelo: string | null;
  ano: number | null;
  descricao: string | null;
  capacidadeKg: number | null;
  capacidadeM3: number | null;
  vencimentoCrlv: string | null;
  vencimentoTacografo: string | null;
  motoristaNome: string | null;
  motoristaCnh: string | null;
  motoristaCategoria: string | null;
  kmAtual: number | null;
  status: StatusVeiculoLogisticaValor;
}

export interface CriarVeiculoLogisticaPayload {
  tipo: TipoVeiculoLogisticaValor;
  placa: string;
  marca?: string | null;
  modelo?: string | null;
  ano?: number | null;
  descricao?: string | null;
  capacidadeKg?: number | null;
  capacidadeM3?: number | null;
  vencimentoCrlv?: string | null;
  vencimentoTacografo?: string | null;
  motoristaNome?: string | null;
  motoristaCnh?: string | null;
  motoristaCategoria?: string | null;
  kmAtual?: number | null;
  status: StatusVeiculoLogisticaValor;
}

export type EditarVeiculoLogisticaPayload = CriarVeiculoLogisticaPayload;

export interface VeiculoLogisticaFormModel {
  tipo: TipoVeiculoLogisticaValor | '';
  placa: string;
  marca: string;
  modelo: string;
  ano: string;
  descricao: string;
  capacidadeKg: string;
  capacidadeM3: string;
  vencimentoCrlv: string;
  vencimentoTacografo: string;
  motoristaNome: string;
  motoristaCnh: string;
  motoristaCategoria: string;
  kmAtual: string;
  status: StatusVeiculoLogisticaValor;
}

export interface CargaParadaDto {
  id: string;
  cargaId: string;
  ordem: number;
  clienteNome: string;
  cidade: string;
  uf: string;
  kmParcial: number | null;
  pedidoVendaId: string | null;
}

export interface CargaParadaFormModel {
  chave: string;
  ordem: string;
  clienteNome: string;
  cidade: string;
  uf: string;
  kmParcial: string;
  pedidoVendaId: string;
}

export interface CargaLogisticaDto {
  id: string;
  empresaId: string;
  unidadeId: string;
  numero: string;
  veiculoId: string | null;
  motoristaNome: string;
  dataHoraSaida: string;
  regiao: string;
  distanciaKm: number | null;
  pesoKg: number | null;
  qtdParadas: number;
  pedagio: number | null;
  custoMotorista: number | null;
  status: StatusCargaLogisticaValor;
  paradas: CargaParadaDto[];
}

export interface CriarCargaLogisticaPayload {
  motoristaNome: string;
  dataHoraSaida: string;
  regiao: string;
  veiculoId?: string | null;
  distanciaKm?: number | null;
  pesoKg?: number | null;
  pedagio?: number | null;
  custoMotorista?: number | null;
  paradas?: Array<{
    ordem: number;
    clienteNome: string;
    cidade: string;
    uf: string;
    kmParcial?: number | null;
    pedidoVendaId?: string | null;
  }> | null;
}

export type EditarCargaLogisticaPayload = CriarCargaLogisticaPayload;

export interface CargaLogisticaFormModel {
  motoristaNome: string;
  dataHoraSaida: string;
  regiao: string;
  veiculoId: string;
  distanciaKm: string;
  pesoKg: string;
  pedagio: string;
  custoMotorista: string;
  paradas: CargaParadaFormModel[];
}

export interface ListarCargasLogisticaParams {
  status?: StatusCargaLogisticaValor | '';
  de?: string;
  ate?: string;
}

export interface OcorrenciaEntregaDto {
  id: string;
  romaneioId: string;
  tipo: TipoOcorrenciaEntregaValor;
  descricao: string;
  temFoto: boolean;
  temGeolocalizacao: boolean;
  status: StatusOcorrenciaEntregaValor;
}

export interface RomaneioLogisticaDto {
  id: string;
  empresaId: string;
  unidadeId: string;
  numero: string;
  cargaId: string;
  clienteNome: string;
  endereco: string;
  cidade: string;
  uf: string;
  pesoKg: number | null;
  volumes: number | null;
  codigoRastreamento: string;
  dataPrevista: string;
  dataHoraEntrega: string | null;
  temAssinatura: boolean;
  temFoto: boolean;
  pedidoVendaId: string | null;
  expedicaoRomaneioId: string | null;
  status: StatusRomaneioLogisticaValor;
  ocorrencias: OcorrenciaEntregaDto[];
}

export interface CriarRomaneioLogisticaPayload {
  cargaId: string;
  clienteNome: string;
  endereco: string;
  cidade: string;
  uf: string;
  dataPrevista: string;
  pesoKg?: number | null;
  volumes?: number | null;
  temAssinatura?: boolean;
  temFoto?: boolean;
  pedidoVendaId?: string | null;
  expedicaoRomaneioId?: string | null;
}

export type EditarRomaneioLogisticaPayload = CriarRomaneioLogisticaPayload;

export interface RomaneioLogisticaFormModel {
  cargaId: string;
  clienteNome: string;
  endereco: string;
  cidade: string;
  uf: string;
  dataPrevista: string;
  pesoKg: string;
  volumes: string;
  temAssinatura: boolean;
  temFoto: boolean;
}

export interface RegistrarOcorrenciaPayload {
  tipo: TipoOcorrenciaEntregaValor;
  descricao: string;
  temFoto?: boolean;
  temGeolocalizacao?: boolean;
}

export interface RegistrarOcorrenciaFormModel {
  tipo: TipoOcorrenciaEntregaValor | '';
  descricao: string;
  temFoto: boolean;
  temGeolocalizacao: boolean;
}

export interface ListarRomaneiosLogisticaParams {
  cargaId?: string;
  status?: StatusRomaneioLogisticaValor | '';
}

export interface FreteTransportadoraDto {
  id: string;
  transportadoraId: string;
  regiao: string;
  valorPorKg: number;
  valorMinimo: number;
  prazoDias: number;
}

export interface TransportadoraLogisticaDto {
  id: string;
  empresaId: string;
  unidadeId: string;
  nome: string;
  cnpj: string;
  rntrc: string | null;
  telefone: string | null;
  email: string | null;
  fretes: FreteTransportadoraDto[];
}

export interface CriarTransportadoraLogisticaPayload {
  nome: string;
  cnpj: string;
  rntrc?: string | null;
  telefone?: string | null;
  email?: string | null;
}

export type EditarTransportadoraLogisticaPayload = CriarTransportadoraLogisticaPayload;

export interface TransportadoraLogisticaFormModel {
  nome: string;
  cnpj: string;
  rntrc: string;
  telefone: string;
  email: string;
}

export interface FreteTransportadoraPayload {
  regiao: string;
  valorPorKg: number;
  valorMinimo: number;
  prazoDias: number;
}

export interface FreteTransportadoraFormModel {
  regiao: string;
  valorPorKg: string;
  valorMinimo: string;
  prazoDias: string;
}

export interface AbastecimentoLogisticaDto {
  id: string;
  empresaId: string;
  unidadeId: string;
  veiculoId: string;
  data: string;
  kmHodometro: number;
  litros: number;
  precoLitro: number;
  valorTotal: number;
  combustivel: TipoCombustivelLogisticaValor;
  posto: string | null;
  motoristaNome: string | null;
}

export interface CriarAbastecimentoLogisticaPayload {
  veiculoId: string;
  data: string;
  kmHodometro: number;
  litros: number;
  precoLitro: number;
  combustivel: TipoCombustivelLogisticaValor;
  posto?: string | null;
  motoristaNome?: string | null;
}

export interface AbastecimentoLogisticaFormModel {
  veiculoId: string;
  data: string;
  kmHodometro: string;
  litros: string;
  precoLitro: string;
  combustivel: TipoCombustivelLogisticaValor | '';
  posto: string;
  motoristaNome: string;
}

export interface ListarAbastecimentosParams {
  veiculoId?: string;
  de?: string;
  ate?: string;
}

export interface DocTransporteLogisticaDto {
  id: string;
  empresaId: string;
  unidadeId: string;
  tipo: TipoDocTransporteLogisticaValor;
  numero: string;
  serie: string;
  chave: string | null;
  tomador: string;
  ufIni: string;
  ufFim: string;
  valor: number;
  pesoKg: number | null;
  dataEmissao: string;
  cargaId: string | null;
  status: StatusDocTransporteLogisticaValor;
}

export interface CriarDocTransporteLogisticaPayload {
  tipo: TipoDocTransporteLogisticaValor;
  numero: string;
  serie: string;
  tomador: string;
  ufIni: string;
  ufFim: string;
  valor: number;
  dataEmissao: string;
  chave?: string | null;
  pesoKg?: number | null;
  cargaId?: string | null;
}

export interface DocTransporteLogisticaFormModel {
  tipo: TipoDocTransporteLogisticaValor | '';
  numero: string;
  serie: string;
  tomador: string;
  ufIni: string;
  ufFim: string;
  valor: string;
  dataEmissao: string;
  chave: string;
  pesoKg: string;
  cargaId: string;
}

export interface ListarDocsTransporteParams {
  tipo?: TipoDocTransporteLogisticaValor | '';
  status?: StatusDocTransporteLogisticaValor | '';
}

export interface LogisticaDashboardDto {
  totalVeiculos: number;
  veiculosDisponiveis: number;
  veiculosEmRota: number;
  cargasEmRota: number;
  romaneiosPendentes: number;
  alertasDocumentos: number;
}

export interface CustoLogisticaItemDto {
  cargaId: string | null;
  cargaNumero: string | null;
  regiao: string;
  custoAbastecimento: number;
  pedagio: number;
  custoMotorista: number;
  custoTotal: number;
}

export interface RelatorioCustoLogisticaDto {
  totalAbastecimento: number;
  totalPedagio: number;
  totalMotorista: number;
  totalGeral: number;
  itens: CustoLogisticaItemDto[];
}

export interface ListarCustoLogisticaParams {
  periodo?: 'semana' | 'mes' | 'trimestre';
}
