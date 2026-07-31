export const MASCARAS = {
  CNPJ: '##.###.###/####-##',
  CPF: '###.###.###-##',
  CEP: '#####-###',
  TELEFONE_FIXO: '(##) ####-####',
  TELEFONE_CELULAR: '(##) #####-####',
  NUMERO_ENDERECO: '##########',
  PLACA_ANTIGA: 'AAA-####',
  PLACA_MERCOSUL: 'AAA#A##',
  RNTRC: '#########',
  CNH: '###########',
} as const;

export const TAMANHO_FORMATADO = {
  CNPJ: 18,
  CPF: 14,
  CEP: 9,
  TELEFONE_FIXO: 14,
  TELEFONE_CELULAR: 15,
  NUMERO_ENDERECO: 10,
  MOEDA: 22,
  PLACA_ANTIGA: 8,
  PLACA_MERCOSUL: 7,
  RNTRC: 9,
  CNH: 11,
} as const;

export const DIGITOS = {
  CNPJ: 14,
  CPF: 11,
  CEP: 8,
  TELEFONE_MIN: 10,
  TELEFONE_MAX: 11,
  NUMERO_ENDERECO: 10,
  MOEDA_MAX: 15,
  PLACA: 7,
  RNTRC_MIN: 8,
  RNTRC_MAX: 9,
  CNH: 11,
} as const;

export function mascaraTelefone(valor: string): string {
  const digitos = valor.replace(/\D/g, '');
  return digitos.length >= 10 ? MASCARAS.TELEFONE_CELULAR : MASCARAS.TELEFONE_FIXO;
}

export function tamanhoFormatadoTelefone(_valor?: string): number {
  return TAMANHO_FORMATADO.TELEFONE_CELULAR;
}

export function mascaraDocumento(valor: string): string {
  const digitos = valor.replace(/\D/g, '');
  return digitos.length > DIGITOS.CPF ? MASCARAS.CNPJ : MASCARAS.CPF;
}

export function tamanhoFormatadoDocumento(valor: string): number {
  return mascaraDocumento(valor) === MASCARAS.CNPJ
    ? TAMANHO_FORMATADO.CNPJ
    : TAMANHO_FORMATADO.CPF;
}

export function mascaraPlaca(valor: string): string {
  const limpo = valor.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  if (limpo.length >= 5 && /[A-Z]/.test(limpo[4] ?? '')) {
    return MASCARAS.PLACA_MERCOSUL;
  }
  return MASCARAS.PLACA_ANTIGA;
}

export function tamanhoFormatadoPlaca(valor: string): number {
  return mascaraPlaca(valor) === MASCARAS.PLACA_MERCOSUL
    ? TAMANHO_FORMATADO.PLACA_MERCOSUL
    : TAMANHO_FORMATADO.PLACA_ANTIGA;
}
