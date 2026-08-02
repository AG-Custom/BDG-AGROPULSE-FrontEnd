import { apenasDigitos } from 'utils/formatters';

export function normalizarTelefoneWhatsApp(
  telefone: string | null | undefined,
): string | null {
  if (!telefone) {
    return null;
  }

  const digits = apenasDigitos(telefone);

  if (!digits) {
    return null;
  }

  if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) {
    return digits;
  }

  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`;
  }

  return null;
}

export function montarUrlWhatsAppWeb(
  telefone: string | null | undefined,
  mensagem?: string,
): string | null {
  const digits = normalizarTelefoneWhatsApp(telefone);

  if (!digits) {
    return null;
  }

  const base = `https://wa.me/${digits}`;
  const texto = mensagem?.trim();

  if (!texto) {
    return base;
  }

  return `${base}?text=${encodeURIComponent(texto)}`;
}

export function abrirWhatsAppWeb(
  telefone: string | null | undefined,
  mensagem?: string,
): boolean {
  const url = montarUrlWhatsAppWeb(telefone, mensagem);

  if (!url) {
    return false;
  }

  window.open(url, '_blank', 'noopener,noreferrer');
  return true;
}
