const CHAVE_EMAIL_PENDENTE = 'agropulse.pendingEmail';

export function salvarEmailPendente(email: string): void {
  sessionStorage.setItem(CHAVE_EMAIL_PENDENTE, email);
}

export function obterEmailPendente(): string | null {
  return sessionStorage.getItem(CHAVE_EMAIL_PENDENTE);
}

export function limparEmailPendente(): void {
  sessionStorage.removeItem(CHAVE_EMAIL_PENDENTE);
}
