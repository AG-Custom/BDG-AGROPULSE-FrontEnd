import type { CnpjFormModel, CriarCnpjPayload } from 'types/dtos/cnpj.dto';
import { apenasDigitos } from 'utils/formatters';

export function criarCnpjFormVazia(principalPadrao = false): CnpjFormModel {
  return {
    numero: '',
    razaoSocial: '',
    nomeFantasia: '',
    principal: principalPadrao,
  };
}

export function formParaCriarPayload(form: CnpjFormModel): CriarCnpjPayload {
  return {
    numero: apenasDigitos(form.numero),
    razaoSocial: form.razaoSocial.trim(),
    nomeFantasia: form.nomeFantasia.trim(),
    principal: form.principal,
  };
}
