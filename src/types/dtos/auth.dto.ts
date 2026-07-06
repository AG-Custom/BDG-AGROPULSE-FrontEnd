export interface LoginPayload {
  email: string;
  senha: string;
}

export interface RegisterPayload {
  nome: string;
  sobrenome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
}

export interface RegisterResponseDto {
  userId: string;
  message: string;
}

export interface ConfirmEmailPayload {
  userId: string;
  token: string;
}

export interface AuthUsuarioDto {
  id: string;
  nome: string;
  email: string;
}

export interface UnidadeDisponivelDto {
  id: string;
  nome: string;
  codigo: string;
  matriz: boolean;
}

export interface AuthSessionDto {
  expiresAt: string;
  empresaId: string | null;
  unidadeId: string | null;
  requiresUnidadeSelection: boolean;
  unidadesDisponiveis: UnidadeDisponivelDto[] | null;
  usuario: AuthUsuarioDto;
}

export interface AuthContextSessionDto {
  expiresAt: string;
  empresaId: string | null;
  unidadeId: string | null;
  requiresUnidadeSelection: boolean;
  unidadesDisponiveis: UnidadeDisponivelDto[] | null;
}

export interface SessaoPersistida {
  expiresAt: string;
  empresaId: string | null;
  unidadeId: string | null;
  requiresUnidadeSelection: boolean;
  unidadesDisponiveis: UnidadeDisponivelDto[] | null;
  usuario: AuthUsuarioDto;
}

export interface SelecionarUnidadePayload {
  unidadeId: string;
}

export interface SelecionarUnidadeResponseDto {
  expiresAt: string;
  empresaId: string | null;
  unidadeId: string | null;
}

export interface UnidadesDisponiveisResponseDto {
  unidades: UnidadeDisponivelDto[];
}

export type LoginResponseDto = AuthSessionDto;
export type RefreshResponseDto = AuthContextSessionDto;
