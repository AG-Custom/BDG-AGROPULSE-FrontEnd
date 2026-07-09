import type { CargoColaboradorValor, ColaboradorStatusValor } from 'constants/enums';

import type { EnderecoDto } from 'types/dtos/unidade.dto';

export interface ColaboradorResumoDto {
  id: string;
  empresaId: string;
  unidadeId: string;
  nomeCompleto: string;
  cpf: string;
  cargo: CargoColaboradorValor;
  cargoPersonalizado: string | null;
  status: ColaboradorStatusValor;
  usuarioId: string | null;
}

export interface ColaboradorDto extends ColaboradorResumoDto {
  rg: string | null;
  dataNascimento: string | null;
  salarioBase: number | null;
  dataAdmissao: string;
  dataDemissao: string | null;
  email: string | null;
  telefone: string | null;
  endereco: EnderecoDto | null;
  observacoes: string | null;
}

export interface SalvarColaboradorPayload {
  nomeCompleto: string;
  cpf: string;
  rg?: string | null;
  dataNascimento?: string | null;
  cargo: CargoColaboradorValor;
  cargoPersonalizado?: string | null;
  salarioBase?: number | null;
  dataAdmissao: string;
  dataDemissao?: string | null;
  status: ColaboradorStatusValor;
  email?: string | null;
  telefone?: string | null;
  endereco?: EnderecoDto | null;
  observacoes?: string | null;
  usuarioId?: string | null;
}

export interface ListarColaboradoresParams {
  ativo?: boolean;
  busca?: string;
}

export interface ColaboradorFormModel {
  nomeCompleto: string;
  cpf: string;
  rg: string;
  dataNascimento: string;
  cargo: CargoColaboradorValor;
  cargoPersonalizado: string;
  salarioBase: string;
  dataAdmissao: string;
  dataDemissao: string;
  status: ColaboradorStatusValor;
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
  usuarioId: string | null;
}
