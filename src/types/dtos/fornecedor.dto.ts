import type { TipoPessoaFornecedorValor } from 'constants/enums';

import type { EnderecoDto } from 'types/dtos/unidade.dto';

export interface FornecedorResumoDto {
  id: string;
  empresaId: string;
  tipoPessoa: TipoPessoaFornecedorValor;
  documento: string;
  razaoSocial: string;
  nomeFantasia: string | null;
  ativo: boolean;
}

export interface ContatoFornecedorDto {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cargo: string | null;
  principal: boolean;
}

export interface AvaliacaoFornecedorDto {
  id: string;
  notaPreco: number;
  notaPrazo: number;
  notaQualidade: number;
  observacao: string | null;
  createdAt: string;
}

export interface FornecedorDto extends FornecedorResumoDto {
  inscricaoEstadual: string | null;
  inscricaoMunicipal: string | null;
  email: string | null;
  telefone: string | null;
  endereco: EnderecoDto | null;
  observacoes: string | null;
  contatos: ContatoFornecedorDto[];
  avaliacoes: AvaliacaoFornecedorDto[];
}

export interface CriarFornecedorPayload {
  tipoPessoa: TipoPessoaFornecedorValor;
  documento: string;
  razaoSocial: string;
  nomeFantasia: string | null;
  inscricaoEstadual: string | null;
  inscricaoMunicipal: string | null;
  email: string | null;
  telefone: string | null;
  endereco: EnderecoDto | null;
  observacoes: string | null;
}

export type EditarFornecedorPayload = CriarFornecedorPayload;

export interface ContatoFornecedorPayload {
  nome: string;
  email: string;
  telefone: string;
  cargo: string | null;
  principal: boolean;
}

export interface AvaliacaoFornecedorPayload {
  notaPreco: number;
  notaPrazo: number;
  notaQualidade: number;
  observacao: string | null;
}

export interface ListarFornecedoresParams {
  ativo?: boolean;
  busca?: string;
}

export interface FornecedorFormModel {
  tipoPessoa: TipoPessoaFornecedorValor;
  documento: string;
  razaoSocial: string;
  nomeFantasia: string;
  inscricaoEstadual: string;
  inscricaoMunicipal: string;
  email: string;
  telefone: string;
  possuiEndereco: boolean;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  complemento: string;
  observacoes: string;
}

export interface ContatoFornecedorFormModel {
  nome: string;
  email: string;
  telefone: string;
  cargo: string;
  principal: boolean;
}

export interface AvaliacaoFornecedorFormModel {
  notaPreco: number;
  notaPrazo: number;
  notaQualidade: number;
  observacao: string;
}
