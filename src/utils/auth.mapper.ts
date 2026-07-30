import type {
  AuthContextSessionDto,
  AuthSessionDto,
  SelecionarUnidadeResponseDto,
  SessaoPersistida,
} from 'types/dtos/auth.dto';
import type { UsuarioLogado } from 'types/entidades/usuario';
import { PerfilUsuario } from 'constants/enums';
import { resolverPermissoesPorPerfil } from 'utils/permissoes-por-perfil';

export function loginParaSessao(resposta: AuthSessionDto): SessaoPersistida {
  return {
    expiresAt: resposta.expiresAt,
    empresaId: resposta.empresaId,
    unidadeId: resposta.unidadeId,
    requiresUnidadeSelection: resposta.requiresUnidadeSelection,
    unidadesDisponiveis: resposta.unidadesDisponiveis,
    usuario: resposta.usuario,
  };
}

export function refreshParaSessao(
  resposta: AuthContextSessionDto,
  sessaoAtual: SessaoPersistida,
): SessaoPersistida {
  return {
    ...sessaoAtual,
    expiresAt: resposta.expiresAt,
    empresaId: resposta.empresaId,
    unidadeId: resposta.unidadeId,
    requiresUnidadeSelection: resposta.requiresUnidadeSelection,
    unidadesDisponiveis: resposta.unidadesDisponiveis,
  };
}

export function mesclarSessaoRemotaComLocal(
  remota: SessaoPersistida,
  local: SessaoPersistida | null,
): SessaoPersistida {
  const usuario =
    remota.usuario.perfil != null
      ? remota.usuario
      : {
          ...remota.usuario,
          perfil: local?.usuario.perfil ?? remota.usuario.perfil,
        };

  if (!local?.unidadeId || local.requiresUnidadeSelection || remota.unidadeId) {
    return {
      ...remota,
      usuario,
    };
  }

  return {
    ...remota,
    usuario,
    unidadeId: local.unidadeId,
    requiresUnidadeSelection: false,
    unidadesDisponiveis: null,
  };
}

export function selecionarUnidadeParaSessao(
  resposta: SelecionarUnidadeResponseDto,
  sessaoAtual: SessaoPersistida,
): SessaoPersistida {
  return {
    ...sessaoAtual,
    expiresAt: resposta.expiresAt,
    empresaId: resposta.empresaId,
    unidadeId: resposta.unidadeId,
    requiresUnidadeSelection: false,
    unidadesDisponiveis: null,
  };
}

export function usuarioDtoParaLogado(
  usuario: AuthSessionDto['usuario'],
  empresaId?: string | null,
): UsuarioLogado {
  const perfil =
    usuario.perfil ??
    (empresaId ? PerfilUsuario.Administrador : null);

  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    perfil,
    permissoes: resolverPermissoesPorPerfil(perfil),
  };
}
