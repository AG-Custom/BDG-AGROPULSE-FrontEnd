import type { PerfilUsuarioValor, UsuarioStatusValor } from 'constants/enums';

export interface UsuarioResumoDto {
  id: string;
  nome: string;
  sobrenome: string;
  email: string;
  status: UsuarioStatusValor;
  perfil: PerfilUsuarioValor;
  colaboradorId: string | null;
}

export interface UsuarioDto extends UsuarioResumoDto {
  unidadeIds: string[];
}

export interface CriarUsuarioPayload {
  nome: string;
  sobrenome: string;
  email: string;
  senha: string;
  perfil: PerfilUsuarioValor;
  unidadeIds?: string[];
  colaboradorId?: string;
}

export interface EditarUsuarioPayload {
  nome: string;
  sobrenome: string;
  perfil: PerfilUsuarioValor;
  unidadeIds?: string[];
  colaboradorId?: string | null;
}

export interface UsuarioFormModel {
  nome: string;
  sobrenome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  perfil: PerfilUsuarioValor;
  unidadeIds: string[];
  colaboradorId: string | null;
}
