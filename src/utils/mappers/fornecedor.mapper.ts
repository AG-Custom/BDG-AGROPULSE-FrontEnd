import { PAIS_PADRAO, TipoPessoaFornecedor } from 'constants/enums';

import type {
  AvaliacaoFornecedorDto,
  AvaliacaoFornecedorFormModel,
  AvaliacaoFornecedorPayload,
  ContatoFornecedorDto,
  ContatoFornecedorFormModel,
  ContatoFornecedorPayload,
  CriarFornecedorPayload,
  FornecedorDto,
  FornecedorFormModel,
} from 'types/dtos/fornecedor.dto';
import type { EnderecoDto } from 'types/dtos/unidade.dto';
import { apenasDigitos, formatarCep, formatarDocumento, formatarTelefone } from 'utils/formatters';

export function criarFornecedorFormVazia(): FornecedorFormModel {
  return {
    tipoPessoa: TipoPessoaFornecedor.PessoaJuridica,
    documento: '',
    razaoSocial: '',
    nomeFantasia: '',
    inscricaoEstadual: '',
    inscricaoMunicipal: '',
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
  };
}

export function fornecedorDtoParaForm(dto: FornecedorDto): FornecedorFormModel {
  return {
    tipoPessoa: dto.tipoPessoa,
    documento: formatarDocumento(dto.tipoPessoa, dto.documento),
    razaoSocial: dto.razaoSocial,
    nomeFantasia: dto.nomeFantasia ?? '',
    inscricaoEstadual: dto.inscricaoEstadual ?? '',
    inscricaoMunicipal: dto.inscricaoMunicipal ?? '',
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
  };
}

function montarEndereco(form: FornecedorFormModel): EnderecoDto | null {
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

export function formParaCriarPayload(form: FornecedorFormModel): CriarFornecedorPayload {
  return {
    tipoPessoa: form.tipoPessoa,
    documento: apenasDigitos(form.documento),
    razaoSocial: form.razaoSocial.trim(),
    nomeFantasia: form.nomeFantasia.trim() || null,
    inscricaoEstadual: form.inscricaoEstadual.trim() || null,
    inscricaoMunicipal: form.inscricaoMunicipal.trim() || null,
    email: form.email.trim() || null,
    telefone: apenasDigitos(form.telefone) || null,
    endereco: montarEndereco(form),
    observacoes: form.observacoes.trim() || null,
  };
}

export function formParaEditarPayload(form: FornecedorFormModel): CriarFornecedorPayload {
  return formParaCriarPayload(form);
}

export function criarContatoFormVazio(): ContatoFornecedorFormModel {
  return {
    nome: '',
    email: '',
    telefone: '',
    cargo: '',
    principal: false,
  };
}

export function contatoDtoParaForm(dto: ContatoFornecedorDto): ContatoFornecedorFormModel {
  return {
    nome: dto.nome,
    email: dto.email,
    telefone: formatarTelefone(dto.telefone),
    cargo: dto.cargo ?? '',
    principal: dto.principal,
  };
}

export function formParaContatoPayload(form: ContatoFornecedorFormModel): ContatoFornecedorPayload {
  return {
    nome: form.nome.trim(),
    email: form.email.trim(),
    telefone: apenasDigitos(form.telefone),
    cargo: form.cargo.trim() || null,
    principal: form.principal,
  };
}

export function criarAvaliacaoFormVazia(): AvaliacaoFornecedorFormModel {
  return {
    notaPreco: 0,
    notaPrazo: 0,
    notaQualidade: 0,
    notaConformidade: 0,
    observacao: '',
  };
}

export function avaliacaoDtoParaForm(dto: AvaliacaoFornecedorDto): AvaliacaoFornecedorFormModel {
  return {
    notaPreco: dto.notaPreco,
    notaPrazo: dto.notaPrazo,
    notaQualidade: dto.notaQualidade,
    notaConformidade: dto.notaConformidade,
    observacao: dto.observacao ?? '',
  };
}

export function formParaAvaliacaoPayload(
  form: AvaliacaoFornecedorFormModel,
): AvaliacaoFornecedorPayload {
  return {
    notaPreco: form.notaPreco!,
    notaPrazo: form.notaPrazo!,
    notaQualidade: form.notaQualidade!,
    notaConformidade: form.notaConformidade!,
    observacao: form.observacao.trim() || null,
  };
}
