import type {
  ExportacaoFormatoValor,
  GrupoComercialValor,
  TipoClienteValor,
  TipoEnderecoClienteValor,
  TipoPessoaClienteValor,
} from 'constants/enums';

import type { EnderecoDto } from 'types/dtos/unidade.dto';

export interface ClienteResumoDto {
  id: string;
  empresaId: string;
  tipoPessoa: TipoPessoaClienteValor;
  tipoCliente: TipoClienteValor;
  grupoComercial: GrupoComercialValor;
  nomeRazao: string;
  nomeFantasia: string | null;
  documento: string;
  vendedorUsuarioId: string | null;
  ativo: boolean;
}

export interface ClienteContatoDto {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cargo: string | null;
  principal: boolean;
}

export interface ClienteEnderecoDto {
  id: string;
  tipo: TipoEnderecoClienteValor;
  endereco: EnderecoDto;
  latitude: number | null;
  longitude: number | null;
}

export interface ClienteDto extends ClienteResumoDto {
  responsavel: string | null;
  telefone: string | null;
  email: string | null;
  dataNascimento: string | null;
  dataFundacao: string | null;
  prazoRecompra: number | null;
  limiteCredito: number | null;
  consultorUsuarioId: string | null;
  unidadeIds?: string[];
  enderecos: ClienteEnderecoDto[];
  contatos: ClienteContatoDto[];
}

export interface CriarClientePayload {
  tipoPessoa: TipoPessoaClienteValor;
  tipoCliente: TipoClienteValor;
  grupoComercial: GrupoComercialValor;
  nomeRazao: string;
  nomeFantasia?: string | null;
  documento: string;
  responsavel?: string | null;
  telefone?: string | null;
  email?: string | null;
  dataNascimento?: string | null;
  dataFundacao?: string | null;
  prazoRecompra?: number | null;
  limiteCredito?: number | null;
  vendedorUsuarioId?: string | null;
  consultorUsuarioId?: string | null;
}

export type EditarClientePayload = CriarClientePayload;

export interface ClienteEnderecoPayload {
  tipo: TipoEnderecoClienteValor;
  endereco: EnderecoDto;
  latitude?: number | null;
  longitude?: number | null;
}

export interface ClienteContatoPayload {
  nome: string;
  email: string;
  telefone: string;
  cargo: string | null;
  principal: boolean;
}

export interface ListarClientesParams {
  ativo?: boolean;
  busca?: string;
  vendedorId?: string;
  exportar?: ExportacaoFormatoValor;
}

export interface ClienteFormModel {
  tipoPessoa: TipoPessoaClienteValor;
  tipoCliente: TipoClienteValor;
  grupoComercial: GrupoComercialValor;
  nomeRazao: string;
  nomeFantasia: string;
  documento: string;
  telefone: string;
  email: string;
  dataNascimento: string;
  dataFundacao: string;
  prazoRecompra: string;
  limiteCredito: string;
  vendedorUsuarioId: string | null;
  consultorUsuarioId: string | null;
}

export interface ClienteContatoFormModel {
  nome: string;
  email: string;
  telefone: string;
  cargo: string;
  principal: boolean;
}

export interface ClienteEnderecoFormModel {
  tipo: TipoEnderecoClienteValor;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  complemento: string;
  latitude: string;
  longitude: string;
}
