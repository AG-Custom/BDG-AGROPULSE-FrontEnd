import type { TipoUnidadeValor, UnidadeStatusValor } from 'constants/enums';

export interface EnderecoDto {
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  pais: string;
  complemento?: string | null;
}

export interface UnidadeDto {
  id: string;
  empresaId: string;
  cnpjEmpresaId: string;
  nome: string;
  codigo: string;
  tipo: TipoUnidadeValor;
  endereco: EnderecoDto;
  email: string | null;
  telefone: string | null;
  timeZoneId: string;
  matriz: boolean;
  propagarCadastrosParaFiliais: boolean;
  status: UnidadeStatusValor;
}

export interface CriarUnidadePayload {
  cnpjEmpresaId: string;
  nome: string;
  codigo: string;
  tipo: TipoUnidadeValor;
  endereco: EnderecoDto;
  email: string | null;
  telefone: string | null;
  timeZoneId: string;
  matriz: boolean;
  propagarCadastrosParaFiliais: boolean;
}

export interface EditarUnidadePayload extends CriarUnidadePayload {
  status: UnidadeStatusValor;
}

export interface ListarUnidadesParams {
  ativo?: boolean;
}

export interface UnidadeFormModel {
  cnpjEmpresaId: string;
  nome: string;
  codigo: string;
  tipo: TipoUnidadeValor;
  email: string;
  telefone: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  complemento: string;
  timeZoneId: string;
  matriz: boolean;
  propagarCadastrosParaFiliais: boolean;
  status: UnidadeStatusValor;
}
