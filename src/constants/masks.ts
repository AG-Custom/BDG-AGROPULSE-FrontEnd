export const MASCARAS = {
  CNPJ: '##.###.###/####-##',
  CPF: '###.###.###-##',
  CEP: '#####-###',
  TELEFONE_FIXO: '(##) ####-####',
  TELEFONE_CELULAR: '(##) #####-####',
  NUMERO_ENDERECO: '##########',
} as const;

export const TAMANHO_FORMATADO = {
  CNPJ: 18,
  CPF: 14,
  CEP: 9,
  TELEFONE_FIXO: 14,
  TELEFONE_CELULAR: 15,
  NUMERO_ENDERECO: 10,
  MOEDA: 22,
} as const;

export const DIGITOS = {
  CNPJ: 14,
  CPF: 11,
  CEP: 8,
  TELEFONE_MIN: 10,
  TELEFONE_MAX: 11,
  NUMERO_ENDERECO: 10,
  MOEDA_MAX: 15,
} as const;

export function mascaraTelefone(valor: string): string {
  const digitos = valor.replace(/\D/g, '');
  return digitos.length >= 10 ? MASCARAS.TELEFONE_CELULAR : MASCARAS.TELEFONE_FIXO;
}

export function tamanhoFormatadoTelefone(_valor?: string): number {
  return TAMANHO_FORMATADO.TELEFONE_CELULAR;
}
