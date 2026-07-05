import { Permissoes } from 'constants/permissoes';

import type {
  AuthUsuarioDto,
  LoginResponseDto,
  RefreshResponseDto,
  SessaoPersistida,
} from 'types/dtos/auth.dto';
import type { UsuarioLogado } from 'types/entidades/usuario';

export function loginParaSessao(resposta: LoginResponseDto): SessaoPersistida {
  return {
    accessToken: resposta.accessToken,
    refreshToken: resposta.refreshToken,
    expiresAt: resposta.expiresAt,
    empresaId: resposta.empresaId,
    unidadeId: resposta.unidadeId,
    usuario: resposta.usuario,
  };
}

export function refreshParaSessao(resposta: RefreshResponseDto, sessaoAtual: SessaoPersistida): SessaoPersistida {
  return {
    ...sessaoAtual,
    accessToken: resposta.accessToken,
    refreshToken: resposta.refreshToken,
    expiresAt: resposta.expiresAt,
    empresaId: resposta.empresaId,
    unidadeId: resposta.unidadeId,
  };
}

export function usuarioDtoParaLogado(usuario: AuthUsuarioDto): UsuarioLogado {
  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    permissoes: [Permissoes.Dashboard.Visualizar],
  };
}
