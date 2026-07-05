export const MASCARAS = {
  CNPJ: '##.###.###/####-##',
  CEP: '#####-###',
  TELEFONE_FIXO: '(##) ####-####',
  TELEFONE_CELULAR: '(##) #####-####',
  NUMERO_ENDERECO: '##########',
} as const;

export const TAMANHO_FORMATADO = {
  CNPJ: 18,
  CEP: 9,
  TELEFONE_FIXO: 14,
  TELEFONE_CELULAR: 15,
  NUMERO_ENDERECO: 10,
} as const;

export const DIGITOS = {
  CNPJ: 14,
  CEP: 8,
  TELEFONE_MIN: 10,
  TELEFONE_MAX: 11,
  NUMERO_ENDERECO: 10,
} as const;

export function mascaraTelefone(valor: string): string {
  const digitos = valor.replace(/\D/g, '');
  return digitos.length > 10 ? MASCARAS.TELEFONE_CELULAR : MASCARAS.TELEFONE_FIXO;
}

export function tamanhoFormatadoTelefone(valor: string): number {
  const digitos = valor.replace(/\D/g, '');
  return digitos.length > 10 ? TAMANHO_FORMATADO.TELEFONE_CELULAR : TAMANHO_FORMATADO.TELEFONE_FIXO;
}
