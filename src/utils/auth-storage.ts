import type { AuthUsuarioDto, SessaoPersistida } from 'types/dtos/auth.dto';

const CHAVE_SESSAO = 'agropulse.sessao';

export function obterSessao(): SessaoPersistida | null {
  const raw = sessionStorage.getItem(CHAVE_SESSAO);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as SessaoPersistida;
  } catch {
    limparSessao();
    return null;
  }
}

export function salvarSessao(sessao: SessaoPersistida): void {
  sessionStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
}

export function limparSessao(): void {
  sessionStorage.removeItem(CHAVE_SESSAO);
}

export function sessaoExpirada(expiresAt: string): boolean {
  return new Date(expiresAt).getTime() <= Date.now();
}

export function obterUsuarioPersistido(): AuthUsuarioDto | null {
  return obterSessao()?.usuario ?? null;
}
