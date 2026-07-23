export function formatarNumero(valor: number): string {
  return new Intl.NumberFormat('pt-BR').format(valor);
}

export function apenasDigitos(valor: string): string {
  return valor.replace(/\D/g, '');
}

import type { TipoPessoaClienteValor, TipoPessoaFornecedorValor } from 'constants/enums';
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

export function formatarDocumento(
  tipoPessoa: TipoPessoaFornecedorValor | TipoPessoaClienteValor,
  valor: string,
): string {
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

export function formatarDataHora(valor: string): string {
  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) {
    return valor;
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(data);
}

export function formatarData(valor: string | null | undefined): string {
  if (!valor) {
    return '—';
  }

  const data = new Date(valor.includes('T') ? valor : `${valor}T00:00:00`);

  if (Number.isNaN(data.getTime())) {
    return valor;
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(data);
}

export function formatarDecimal(valor: number, casas = 2): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: casas,
  }).format(valor);
}

export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
}

const MOEDA_INPUT_FORMATTER = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const DIGITOS_MOEDA_MAX = 15;

export function formatarMoedaParaInput(valor: number | string | null | undefined): string {
  if (valor === null || valor === undefined || valor === '') {
    return '';
  }

  const numero = typeof valor === 'number' ? valor : parseMascaraMoeda(valor);

  if (numero === null) {
    return '';
  }

  return MOEDA_INPUT_FORMATTER.format(numero);
}

export function aplicarMascaraMoeda(valorDigitado: string): string {
  const digitos = apenasDigitos(valorDigitado).slice(0, DIGITOS_MOEDA_MAX);

  if (!digitos) {
    return '';
  }

  return MOEDA_INPUT_FORMATTER.format(Number(digitos) / 100);
}

export function parseMascaraMoeda(valor: string): number | null {
  let texto = valor.trim().replace(/R\$\s?/gi, '').replace(/\s/g, '');

  if (!texto) {
    return null;
  }

  if (texto.includes(',')) {
    texto = texto.replace(/\./g, '').replace(',', '.');
  }

  const numero = Number(texto);
  return Number.isFinite(numero) ? numero : null;
}

export function parseMascaraMoedaObrigatorio(valor: string): number {
  return parseMascaraMoeda(valor) ?? 0;
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

