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
