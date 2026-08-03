import type { TipoOperacaoEmpresaValor } from 'constants/enums';
import type { UnidadeOnboardingPayload } from 'types/dtos/onboarding.dto';

export type EmpresaStatusPlataforma = 'Rascunho' | 'Ativo' | 'Suspenso';

export interface EmpresaPlataformaListItemDto {
  id: string;
  nomeFantasia: string;
  razaoSocial: string;
  cnpj: string;
  status: EmpresaStatusPlataforma;
  tipoOperacao: TipoOperacaoEmpresaValor;
  qtdUnidades: number;
  criadoEm: string;
}

export interface ListarEmpresasPlataformaResponseDto {
  items: EmpresaPlataformaListItemDto[];
}

export interface UnidadePlataformaResumoDto {
  id: string;
  nome: string;
  codigo: string;
  matriz: boolean;
  ativo: boolean;
}

export interface EmpresaPlataformaDetalheDto {
  id: string;
  nomeFantasia: string;
  razaoSocial: string;
  cnpj: string;
  status: EmpresaStatusPlataforma;
  tipoOperacao: TipoOperacaoEmpresaValor;
  criadoEm: string;
  unidades: UnidadePlataformaResumoDto[];
}

export interface AdminEmpresaPlataformaPayload {
  nome: string;
  sobrenome: string;
  email: string;
}

export interface CriarEmpresaPlataformaPayload {
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  tipoOperacao: TipoOperacaoEmpresaValor;
  unidades: UnidadeOnboardingPayload[];
  admin: AdminEmpresaPlataformaPayload;
}

export interface UnidadeCriadaPlataformaDto {
  id: string;
  nome: string;
  codigo: string;
  matriz: boolean;
}

export interface CriarEmpresaPlataformaResponseDto {
  empresaId: string;
  unidades: UnidadeCriadaPlataformaDto[];
  unidadeMatrizId: string;
  adminUsuarioId: string;
  message: string;
}

export interface AdminEmpresaFormModel {
  nome: string;
  sobrenome: string;
  email: string;
}

export function criarAdminVazio(): AdminEmpresaFormModel {
  return {
    nome: '',
    sobrenome: '',
    email: '',
  };
}
