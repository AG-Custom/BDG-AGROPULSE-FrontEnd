import {
  GrupoComercial,
  PAIS_PADRAO,
  TipoCliente,
  TipoEnderecoCliente,
  TipoPessoaCliente,
} from 'constants/enums';

import type {
  ClienteContatoDto,
  ClienteContatoFormModel,
  ClienteContatoPayload,
  ClienteDto,
  ClienteEnderecoDto,
  ClienteEnderecoFormModel,
  ClienteEnderecoPayload,
  ClienteFormModel,
  CriarClientePayload,
  EditarClientePayload,
} from 'types/dtos/cliente.dto';
import type { EnderecoDto } from 'types/dtos/unidade.dto';
import { apenasDigitos, formatarCep, formatarDocumento, formatarTelefone } from 'utils/formatters';

export function criarClienteFormVazio(): ClienteFormModel {
  return {
    tipoPessoa: TipoPessoaCliente.PessoaJuridica,
    tipoCliente: TipoCliente.Balcao,
    grupoComercial: GrupoComercial.Standard,
    nomeRazao: '',
    nomeFantasia: '',
    documento: '',
    telefone: '',
    email: '',
    dataNascimento: '',
    dataFundacao: '',
    prazoRecompra: '',
    limiteCredito: '',
    vendedorUsuarioId: null,
  };
}

export function clienteDtoParaForm(dto: ClienteDto): ClienteFormModel {
  return {
    tipoPessoa: dto.tipoPessoa,
    tipoCliente: dto.tipoCliente,
    grupoComercial: dto.grupoComercial,
    nomeRazao: dto.nomeRazao,
    nomeFantasia: dto.nomeFantasia ?? '',
    documento: formatarDocumento(dto.tipoPessoa, dto.documento),
    telefone: formatarTelefone(dto.telefone ?? ''),
    email: dto.email ?? '',
    dataNascimento: dto.dataNascimento ?? '',
    dataFundacao: dto.dataFundacao ?? '',
    prazoRecompra: dto.prazoRecompra !== null ? String(dto.prazoRecompra) : '',
    limiteCredito: dto.limiteCredito !== null ? String(dto.limiteCredito) : '',
    vendedorUsuarioId: dto.vendedorUsuarioId,
  };
}

function parseNumeroOpcional(valor: string): number | null {
  const texto = valor.trim();
  if (!texto) {
    return null;
  }

  const numero = Number(texto.replace(',', '.'));
  return Number.isFinite(numero) ? numero : null;
}

function montarPayloadBase(form: ClienteFormModel): CriarClientePayload {
  const ehPf = form.tipoPessoa === TipoPessoaCliente.PessoaFisica;

  return {
    tipoPessoa: form.tipoPessoa,
    tipoCliente: form.tipoCliente,
    grupoComercial: form.grupoComercial,
    nomeRazao: form.nomeRazao.trim(),
    nomeFantasia: ehPf ? null : form.nomeFantasia.trim() || null,
    documento: apenasDigitos(form.documento),
    telefone: apenasDigitos(form.telefone) || null,
    email: form.email.trim() || null,
    dataNascimento: ehPf ? form.dataNascimento.trim() || null : null,
    dataFundacao: ehPf ? null : form.dataFundacao.trim() || null,
    prazoRecompra: parseNumeroOpcional(form.prazoRecompra),
    limiteCredito: parseNumeroOpcional(form.limiteCredito),
    vendedorUsuarioId: form.vendedorUsuarioId,
  };
}

export function formParaCriarPayload(form: ClienteFormModel): CriarClientePayload {
  return montarPayloadBase(form);
}

export function formParaEditarPayload(form: ClienteFormModel): EditarClientePayload {
  return montarPayloadBase(form);
}

export function criarContatoFormVazio(): ClienteContatoFormModel {
  return {
    nome: '',
    email: '',
    telefone: '',
    cargo: '',
    principal: false,
  };
}

export function contatoDtoParaForm(dto: ClienteContatoDto): ClienteContatoFormModel {
  return {
    nome: dto.nome,
    email: dto.email,
    telefone: formatarTelefone(dto.telefone),
    cargo: dto.cargo ?? '',
    principal: dto.principal,
  };
}

export function formParaContatoPayload(form: ClienteContatoFormModel): ClienteContatoPayload {
  return {
    nome: form.nome.trim(),
    email: form.email.trim(),
    telefone: apenasDigitos(form.telefone),
    cargo: form.cargo.trim() || null,
    principal: form.principal,
  };
}

export function criarEnderecoFormVazio(): ClienteEnderecoFormModel {
  return {
    tipo: TipoEnderecoCliente.Cobranca,
    logradouro: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    complemento: '',
    latitude: '',
    longitude: '',
  };
}

export function enderecoDtoParaForm(dto: ClienteEnderecoDto): ClienteEnderecoFormModel {
  return {
    tipo: dto.tipo,
    logradouro: dto.endereco.logradouro,
    numero: dto.endereco.numero,
    bairro: dto.endereco.bairro,
    cidade: dto.endereco.cidade,
    estado: dto.endereco.estado,
    cep: formatarCep(dto.endereco.cep),
    complemento: dto.endereco.complemento ?? '',
    latitude: dto.latitude !== null ? String(dto.latitude) : '',
    longitude: dto.longitude !== null ? String(dto.longitude) : '',
  };
}

function montarEndereco(form: ClienteEnderecoFormModel): EnderecoDto {
  return {
    logradouro: form.logradouro.trim(),
    numero: form.numero.trim(),
    bairro: form.bairro.trim(),
    cidade: form.cidade.trim(),
    estado: form.estado.trim().toUpperCase(),
    cep: apenasDigitos(form.cep),
    pais: PAIS_PADRAO,
    complemento: form.complemento.trim() || null,
  };
}

function parseCoordenada(valor: string): number | null {
  const texto = valor.trim();
  if (!texto) {
    return null;
  }

  const numero = Number(texto.replace(',', '.'));
  return Number.isFinite(numero) ? numero : null;
}

export function formParaEnderecoPayload(form: ClienteEnderecoFormModel): ClienteEnderecoPayload {
  return {
    tipo: form.tipo,
    endereco: montarEndereco(form),
    latitude: parseCoordenada(form.latitude),
    longitude: parseCoordenada(form.longitude),
  };
}
