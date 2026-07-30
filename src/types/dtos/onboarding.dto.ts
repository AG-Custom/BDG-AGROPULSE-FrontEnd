import type { TipoOperacaoEmpresaValor, TipoUnidadeValor } from 'constants/enums';

export interface UnidadeOnboardingPayload {
  nome: string;
  codigo: string;
  tipo: TipoUnidadeValor;
  telefone: string;
  email: string;
  cep: string;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  complemento?: string | null;
  matriz?: boolean;
}

export interface CriarEmpresaPayload {
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  tipoOperacao: TipoOperacaoEmpresaValor;
  unidades: UnidadeOnboardingPayload[];
}

export interface UnidadeCriadaDto {
  id: string;
  nome: string;
  codigo: string;
  matriz: boolean;
}

export interface CriarEmpresaResponseDto {
  empresaId: string;
  unidades: UnidadeCriadaDto[];
  unidadeMatrizId: string;
  unidadePadraoId: string;
  message: string;
}

export interface OnboardingChecklistItemDto {
  codigo: string;
  titulo: string;
  concluido: boolean;
}

export interface OnboardingDashboardDto {
  mensagem: string;
  empresa: {
    id: string;
    nome: string;
    identificador: string;
  };
  checklist: OnboardingChecklistItemDto[];
}

export interface UnidadeFormModel extends UnidadeOnboardingPayload {
  id: string;
}

export interface EmpresaFormModel {
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  tipoOperacao: TipoOperacaoEmpresaValor;
}

export function criarUnidadeVazia(matriz = false): UnidadeFormModel {
  return {
    id: crypto.randomUUID(),
    nome: '',
    codigo: '',
    tipo: 'Filial',
    telefone: '',
    email: '',
    cep: '',
    endereco: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    complemento: null,
    matriz,
  };
}
