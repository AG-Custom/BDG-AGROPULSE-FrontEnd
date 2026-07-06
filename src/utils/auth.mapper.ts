import type { AuthContextSessionDto, AuthSessionDto, SessaoPersistida } from 'types/dtos/auth.dto';
import type { UsuarioLogado } from 'types/entidades/usuario';
import { Permissoes } from 'constants/permissoes';

export function loginParaSessao(resposta: AuthSessionDto): SessaoPersistida {
  return {
    expiresAt: resposta.expiresAt,
    empresaId: resposta.empresaId,
    unidadeId: resposta.unidadeId,
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
  };
}

export function usuarioDtoParaLogado(usuario: AuthSessionDto['usuario']): UsuarioLogado {
  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    permissoes: [Permissoes.Dashboard.Visualizar],
  };
}
