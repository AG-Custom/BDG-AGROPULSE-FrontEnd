import { CargoColaborador, ColaboradorStatus, PAIS_PADRAO } from 'constants/enums';

import type {
  ColaboradorDto,
  ColaboradorFormModel,
  SalvarColaboradorPayload,
} from 'types/dtos/colaborador.dto';
import type { EnderecoDto } from 'types/dtos/unidade.dto';
import {
  apenasDigitos,
  formatarCep,
  formatarCpf,
  formatarTelefone,
} from 'utils/formatters';

function dataHojeIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function criarColaboradorFormVazia(): ColaboradorFormModel {
  return {
    nomeCompleto: '',
    cpf: '',
    rg: '',
    dataNascimento: '',
    cargo: CargoColaborador.Operacional,
    cargoPersonalizado: '',
    salarioBase: '',
    dataAdmissao: dataHojeIso(),
    dataDemissao: '',
    status: ColaboradorStatus.Ativo,
    email: '',
    telefone: '',
    possuiEndereco: false,
    logradouro: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    complemento: '',
    observacoes: '',
    usuarioId: null,
  };
}

export function colaboradorDtoParaForm(dto: ColaboradorDto): ColaboradorFormModel {
  return {
    nomeCompleto: dto.nomeCompleto,
    cpf: formatarCpf(dto.cpf),
    rg: dto.rg ?? '',
    dataNascimento: dto.dataNascimento ?? '',
    cargo: dto.cargo,
    cargoPersonalizado: dto.cargoPersonalizado ?? '',
    salarioBase: dto.salarioBase !== null ? String(dto.salarioBase) : '',
    dataAdmissao: dto.dataAdmissao,
    dataDemissao: dto.dataDemissao ?? '',
    status: dto.status,
    email: dto.email ?? '',
    telefone: formatarTelefone(dto.telefone ?? ''),
    possuiEndereco: dto.endereco !== null,
    logradouro: dto.endereco?.logradouro ?? '',
    numero: dto.endereco?.numero ?? '',
    bairro: dto.endereco?.bairro ?? '',
    cidade: dto.endereco?.cidade ?? '',
    estado: dto.endereco?.estado ?? '',
    cep: formatarCep(dto.endereco?.cep ?? ''),
    complemento: dto.endereco?.complemento ?? '',
    observacoes: dto.observacoes ?? '',
    usuarioId: dto.usuarioId,
  };
}

function montarEndereco(form: ColaboradorFormModel): EnderecoDto | null {
  if (!form.possuiEndereco) {
    return null;
  }

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

function montarSalarioBase(valor: string): number | null {
  const normalizado = valor.trim().replace(',', '.');

  if (!normalizado) {
    return null;
  }

  const numero = Number(normalizado);
  return Number.isFinite(numero) ? numero : null;
}

export function formParaSalvarPayload(form: ColaboradorFormModel): SalvarColaboradorPayload {
  return {
    nomeCompleto: form.nomeCompleto.trim(),
    cpf: apenasDigitos(form.cpf),
    rg: form.rg.trim() || null,
    dataNascimento: form.dataNascimento || null,
    cargo: form.cargo,
    cargoPersonalizado:
      form.cargo === CargoColaborador.Personalizado ? form.cargoPersonalizado.trim() || null : null,
    salarioBase: montarSalarioBase(form.salarioBase),
    dataAdmissao: form.dataAdmissao,
    dataDemissao: form.dataDemissao || null,
    status: form.status,
    email: form.email.trim() || null,
    telefone: apenasDigitos(form.telefone) || null,
    endereco: montarEndereco(form),
    observacoes: form.observacoes.trim() || null,
    usuarioId: form.usuarioId,
  };
}
