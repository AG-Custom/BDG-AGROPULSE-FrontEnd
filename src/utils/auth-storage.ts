import type { AuthUsuarioDto, SessaoPersistida } from 'types/dtos/auth.dto';

const CHAVE_SESSAO = 'agropulse.sessao';

export function obterSessao(): SessaoPersistida | null {
  const raw = localStorage.getItem(CHAVE_SESSAO);
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
  localStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
}

export function limparSessao(): void {
  localStorage.removeItem(CHAVE_SESSAO);
}

export function obterAccessToken(): string | null {
  return obterSessao()?.accessToken ?? null;
}

export function obterRefreshToken(): string | null {
  return obterSessao()?.refreshToken ?? null;
}

export function sessaoExpirada(expiresAt: string): boolean {
  return new Date(expiresAt).getTime() <= Date.now();
}

export function obterUsuarioPersistido(): AuthUsuarioDto | null {
  return obterSessao()?.usuario ?? null;
}
