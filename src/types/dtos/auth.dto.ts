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

export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  empresaId: string | null;
  unidadeId: string | null;
  requiresUnidadeSelection: boolean;
  unidadesDisponiveis: UnidadeDisponivelDto[] | null;
  usuario: AuthUsuarioDto;
}

export interface RefreshResponseDto {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  empresaId: string | null;
  unidadeId: string | null;
  requiresUnidadeSelection: boolean;
  unidadesDisponiveis: UnidadeDisponivelDto[] | null;
}

export interface RefreshPayload {
  refreshToken: string;
}

export interface SessaoPersistida {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  empresaId: string | null;
  unidadeId: string | null;
  usuario: AuthUsuarioDto;
}
