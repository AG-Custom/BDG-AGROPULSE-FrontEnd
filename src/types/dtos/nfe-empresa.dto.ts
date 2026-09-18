export interface DadosEmissaoNfe {
  unidadeEmitenteId: string;
  inscricaoEstadual: string;
  crt: number;
  codigoMunicipio: string;
  cnae: string | null;
  inscricaoMunicipal?: string | null;
  serieHomologacao: number;
  serieProducao: number;
}

export interface EmitenteNfeDto {
  unidadeId: string;
  unidade: string;
  cnpj: string;
  razaoSocial: string;
  logradouro: string;
  numero: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
}

export interface NfeEmpresaDto {
  empresaId: string;
  dados: DadosEmissaoNfe | null;
  possuiTokenHomologacao: boolean;
  possuiTokenProducao: boolean;
  emitentes: EmitenteNfeDto[];
  focusEmpresaId?: number | null;
  certificadoValidoAte?: string | null;
  sincronizadoEm?: string | null;
}

export interface SalvarNfeEmpresaPayload {
  dados: DadosEmissaoNfe;
  tokenHomologacao?: string;
  tokenProducao?: string;
}
