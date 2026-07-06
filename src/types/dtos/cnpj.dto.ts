export interface CnpjEmpresaDto {
  id: string;
  empresaId: string;
  numero: string;
  razaoSocial: string;
  nomeFantasia: string;
  principal: boolean;
  ativo: boolean;
}

export interface CnpjFormModel {
  numero: string;
  razaoSocial: string;
  nomeFantasia: string;
  principal: boolean;
  ativo: boolean;
}

export interface CriarCnpjPayload {
  numero: string;
  razaoSocial: string;
  nomeFantasia: string;
  principal: boolean;
}

export interface EditarCnpjPayload {
  razaoSocial: string;
  nomeFantasia: string;
  principal: boolean;
  ativo: boolean;
}
