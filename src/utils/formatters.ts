export function formatarNumero(valor: number): string {
  return new Intl.NumberFormat('pt-BR').format(valor);
}

export function apenasDigitos(valor: string): string {
  return valor.replace(/\D/g, '');
}

import type { TipoPessoaFornecedorValor } from 'constants/enums';
import { TipoPessoaFornecedor } from 'constants/enums';

export function formatarCnpj(valor: string): string {
  const digits = apenasDigitos(valor).slice(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

export function formatarCpf(valor: string): string {
  const digits = apenasDigitos(valor).slice(0, 11);
  return digits
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2');
}

export function formatarDocumento(tipoPessoa: TipoPessoaFornecedorValor, valor: string): string {
  return tipoPessoa === TipoPessoaFornecedor.PessoaFisica
    ? formatarCpf(valor)
    : formatarCnpj(valor);
}

export function formatarCep(valor: string): string {
  const digits = apenasDigitos(valor).slice(0, 8);
  return digits.replace(/^(\d{5})(\d{1,3})/, '$1-$2');
}

export function formatarTelefone(valor: string): string {
  const digits = apenasDigitos(valor).slice(0, 11);
  if (digits.length <= 10) {
    return digits.replace(/^(\d{2})(\d{4})(\d)/, '($1) $2-$3');
  }
  return digits.replace(/^(\d{2})(\d{5})(\d)/, '($1) $2-$3');
}

export function slugify(valor: string): string {
  return valor
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function gerarCodigoUnidade(tipo: string, nome: string): string {
  const tipoSlug = slugify(tipo);
  const nomeSlug = slugify(nome);

  if (!tipoSlug && !nomeSlug) {
    return '';
  }

  if (!nomeSlug) {
    return tipoSlug;
  }

  if (!tipoSlug) {
    return nomeSlug;
  }

  return `${tipoSlug}-${nomeSlug}`;
}

