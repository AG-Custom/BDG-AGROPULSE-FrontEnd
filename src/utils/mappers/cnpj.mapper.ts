import type { CnpjEmpresaDto, CnpjFormModel, CriarCnpjPayload, EditarCnpjPayload } from 'types/dtos/cnpj.dto';
import { apenasDigitos } from 'utils/formatters';

export function criarCnpjFormVazia(principalPadrao = false): CnpjFormModel {
  return {
    numero: '',
    razaoSocial: '',
    nomeFantasia: '',
    principal: principalPadrao,
    ativo: true,
  };
}

export function cnpjDtoParaForm(cnpj: CnpjEmpresaDto): CnpjFormModel {
  return {
    numero: cnpj.numero,
    razaoSocial: cnpj.razaoSocial,
    nomeFantasia: cnpj.nomeFantasia,
    principal: cnpj.principal,
    ativo: cnpj.ativo,
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

export function formParaEditarPayload(form: CnpjFormModel): EditarCnpjPayload {
  return {
    razaoSocial: form.razaoSocial.trim(),
    nomeFantasia: form.nomeFantasia.trim(),
    principal: form.principal,
    ativo: form.ativo,
  };
}
