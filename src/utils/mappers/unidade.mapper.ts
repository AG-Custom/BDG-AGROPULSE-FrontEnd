import {
  PAIS_PADRAO,
  TIMEZONE_PADRAO,
  TipoUnidade,
  UnidadeStatus,
} from 'constants/enums';

import type {
  CriarUnidadePayload,
  EditarUnidadePayload,
  EnderecoDto,
  UnidadeDto,
  UnidadeFormModel,
} from 'types/dtos/unidade.dto';
import { apenasDigitos, formatarCep, formatarTelefone } from 'utils/formatters';

export function criarUnidadeFormVazia(): UnidadeFormModel {
  return {
    cnpjEmpresaId: '',
    nome: '',
    codigo: '',
    tipo: TipoUnidade.Filial,
    email: '',
    telefone: '',
    logradouro: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    complemento: '',
    timeZoneId: TIMEZONE_PADRAO,
    matriz: false,
    status: UnidadeStatus.Ativa,
  };
}

export function unidadeDtoParaForm(dto: UnidadeDto): UnidadeFormModel {
  return {
    cnpjEmpresaId: dto.cnpjEmpresaId,
    nome: dto.nome,
    codigo: dto.codigo,
    tipo: dto.tipo,
    email: dto.email ?? '',
    telefone: formatarTelefone(dto.telefone ?? ''),
    logradouro: dto.endereco.logradouro,
    numero: dto.endereco.numero,
    bairro: dto.endereco.bairro,
    cidade: dto.endereco.cidade,
    estado: dto.endereco.estado,
    cep: formatarCep(dto.endereco.cep),
    complemento: dto.endereco.complemento ?? '',
    timeZoneId: dto.timeZoneId,
    matriz: dto.matriz,
    status: dto.status,
  };
}

function montarEndereco(form: UnidadeFormModel): EnderecoDto {
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

export function formParaCriarPayload(form: UnidadeFormModel): CriarUnidadePayload {
  return {
    cnpjEmpresaId: form.cnpjEmpresaId,
    nome: form.nome.trim(),
    codigo: form.codigo.trim(),
    tipo: form.tipo,
    endereco: montarEndereco(form),
    email: form.email.trim() || null,
    telefone: apenasDigitos(form.telefone) || null,
    timeZoneId: form.timeZoneId,
    matriz: form.matriz,
  };
}

export function formParaEditarPayload(form: UnidadeFormModel): EditarUnidadePayload {
  return {
    ...formParaCriarPayload(form),
    status: form.status,
  };
}
