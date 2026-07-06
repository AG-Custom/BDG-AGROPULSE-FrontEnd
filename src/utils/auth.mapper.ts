import type {
  AuthContextSessionDto,
  AuthSessionDto,
  SelecionarUnidadeResponseDto,
  SessaoPersistida,
} from 'types/dtos/auth.dto';
import type { UsuarioLogado } from 'types/entidades/usuario';
import { Permissoes } from 'constants/permissoes';

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
  if (!local?.unidadeId || local.requiresUnidadeSelection || remota.unidadeId) {
    return remota;
  }

  return {
    ...remota,
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

export function usuarioDtoParaLogado(usuario: AuthSessionDto['usuario']): UsuarioLogado {
  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    permissoes: [
      Permissoes.Dashboard.Visualizar,
      Permissoes.Unidades.Visualizar,
      Permissoes.Cnpjs.Visualizar,
      Permissoes.Fornecedores.Visualizar,
    ],
  };
}
