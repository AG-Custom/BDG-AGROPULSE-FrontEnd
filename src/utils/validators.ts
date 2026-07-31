export function obrigatorio(val: unknown): true | string {
  if (val === null || val === undefined) {
    return 'Campo obrigatório';
  }

  if (typeof val === 'string' && val.trim() === '') {
    return 'Campo obrigatório';
  }

  return true;
}

export function email(val: string): true | string {
  if (!val) {
    return true;
  }

  const padrao = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return padrao.test(val.trim()) || 'Informe um e-mail válido';
}

export function senhaContrato(val: string): true | string {
  if (!val) {
    return true;
  }

  if (val.length < 8) {
    return 'A senha deve ter no mínimo 8 caracteres';
  }

  if (!/[A-Z]/.test(val)) {
    return 'A senha deve conter ao menos uma letra maiúscula';
  }

  if (!/[a-z]/.test(val)) {
    return 'A senha deve conter ao menos uma letra minúscula';
  }

  if (!/[0-9]/.test(val)) {
    return 'A senha deve conter ao menos um número';
  }

  return true;
}

export function confirmarSenha(senha: string) {
  return (val: string): true | string => {
    if (!val) {
      return true;
    }

    return val === senha || 'As senhas não conferem';
  };
}

export function cep(val: string): true | string {
  if (!val) {
    return true;
  }

  const digits = val.replace(/\D/g, '');
  return digits.length === 8 || 'Informe um CEP com 8 dígitos';
}

export function telefone(val: string): true | string {
  if (!val) {
    return true;
  }

  const digits = val.replace(/\D/g, '');
  return (
    (digits.length === 10 || digits.length === 11) || 'Informe um telefone com 10 ou 11 dígitos'
  );
}

export function numeroEndereco(val: string): true | string {
  if (!val) {
    return true;
  }

  const digits = val.replace(/\D/g, '');
  return digits.length > 0 || 'Informe apenas números';
}

export function uf(val: string): true | string {
  if (!val) {
    return true;
  }

  return val.trim().length === 2 || 'Informe a UF com 2 caracteres';
}

export function cnpj(val: string): true | string {
  if (!val) {
    return true;
  }

  const digits = val.replace(/\D/g, '');
  return digits.length === 14 || 'Informe um CNPJ válido com 14 dígitos';
}

export function cpf(val: string): true | string {
  if (!val) {
    return true;
  }

  const digits = val.replace(/\D/g, '');
  return digits.length === 11 || 'Informe um CPF válido com 11 dígitos';
}

export function documentoFornecedor(tipoPessoa: string) {
  return (val: string): true | string => {
    if (!val) {
      return true;
    }

    return tipoPessoa === 'PessoaFisica' ? cpf(val) : cnpj(val);
  };
}

export function documentoCpfCnpj(val: string): true | string {
  if (!val) {
    return true;
  }

  const digits = val.replace(/\D/g, '');
  if (digits.length === 11) {
    return cpf(val);
  }
  if (digits.length === 14) {
    return cnpj(val);
  }
  return 'Informe um CPF (11) ou CNPJ (14) válido';
}

export function placa(val: string): true | string {
  if (!val) {
    return true;
  }

  const limpo = val.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  const antiga = /^[A-Z]{3}\d{4}$/.test(limpo);
  const mercosul = /^[A-Z]{3}\d[A-Z]\d{2}$/.test(limpo);
  return antiga || mercosul || 'Informe uma placa válida (ABC-1234 ou ABC1D23)';
}

export function rntrc(val: string): true | string {
  if (!val) {
    return true;
  }

  const digits = val.replace(/\D/g, '');
  return (
    (digits.length === 8 || digits.length === 9) ||
    'Informe um RNTRC com 8 ou 9 dígitos'
  );
}

export function cnh(val: string): true | string {
  if (!val) {
    return true;
  }

  const digits = val.replace(/\D/g, '');
  return digits.length === 11 || 'Informe uma CNH com 11 dígitos';
}

export function ncm(val: string): true | string {
  if (!val) {
    return true;
  }

  const digits = val.replace(/\D/g, '');
  return digits.length === 8 || 'Informe um NCM com 8 dígitos';
}

export function cest(val: string): true | string {
  if (!val) {
    return true;
  }

  const digits = val.replace(/\D/g, '');
  return digits.length === 7 || 'Informe um CEST com 7 dígitos';
}

export function cfop(val: string): true | string {
  if (!val) {
    return true;
  }

  const digits = String(val).replace(/\D/g, '');
  return digits.length === 4 || 'Informe um CFOP com 4 dígitos';
}

export function notaAvaliacao(val: number | null | undefined): true | string {
  if (val === null || val === undefined || val === 0) {
    return 'Campo obrigatório';
  }

  return (val >= 1 && val <= 5) || 'A nota deve estar entre 1 e 5';
}

function paraNumero(val: string): number {
  const texto = val.trim();
  const normalizado = texto.includes(',') ? texto.replace(/\./g, '').replace(',', '.') : texto;
  return Number(normalizado);
}

export function quantidadePositiva(val: string): true | string {
  if (!val || !val.trim()) {
    return 'Campo obrigatório';
  }

  const numero = paraNumero(val);

  if (Number.isNaN(numero)) {
    return 'Informe um número válido';
  }

  return numero > 0 || 'A quantidade deve ser maior que zero';
}

export function quantidadeNaoNegativa(val: string): true | string {
  if (!val || !val.trim()) {
    return 'Campo obrigatório';
  }

  const numero = paraNumero(val);

  if (Number.isNaN(numero)) {
    return 'Informe um número válido';
  }

  return numero >= 0 || 'A quantidade não pode ser negativa';
}

export function justificativaAjuste(val: string): true | string {
  if (!val || !val.trim()) {
    return 'Campo obrigatório';
  }

  const texto = val.trim();

  if (texto.length < 10) {
    return 'A justificativa deve ter no mínimo 10 caracteres';
  }

  if (texto.length > 1000) {
    return 'A justificativa deve ter no máximo 1000 caracteres';
  }

  return true;
}

export function percentualZeroACem(val: string): true | string {
  if (!val || !val.trim()) {
    return true;
  }

  const numero = Number(val.replace(',', '.'));

  if (Number.isNaN(numero)) {
    return 'Informe um número válido';
  }

  return (numero >= 0 && numero <= 100) || 'O percentual deve estar entre 0 e 100';
}
