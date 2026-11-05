import type {
  AtividadeEfdValor,
  FinalidadeArquivoFiscalValor,
  PerfilEfdValor,
  TipoArquivoFiscalValor,
} from 'constants/enums';

export interface PerfilEfdDto {
  perfil: PerfilEfdValor;
  atividade: AtividadeEfdValor;
  codigoVersaoLeiaute: string;
  tipoItemPadrao: string;
  obrigadoBlocoG: boolean;
  obrigadoBlocoK: boolean;
  obrigadoInventario: boolean;
  codigoReceitaIcms: string | null;
  diaVencimentoIcms: number | null;
  contabilistaNome: string;
  contabilistaCpf: string;
  contabilistaCrc: string;
  contabilistaCodigoMunicipio: string;
  contabilistaEmail: string | null;
  contabilistaTelefone: string | null;
}

export interface PerfilEfdFormModel
  extends Omit<
    PerfilEfdDto,
    'codigoReceitaIcms' | 'diaVencimentoIcms' | 'contabilistaEmail' | 'contabilistaTelefone'
  > {
  codigoReceitaIcms: string;
  diaVencimentoIcms: string;
  contabilistaEmail: string;
  contabilistaTelefone: string;
}

export interface PerfilContribuicoesDto {
  codigoVersaoLeiaute: string;
  naturezaPessoaJuridica: string;
  indicadorAtividade: string;
  codigoIncidencia: number;
  indicadorRegimeCumulativo: number | null;
  cstEntrada: string;
  naturezaBaseCredito: string | null;
  obrigadoBlocoF: boolean;
  obrigadoBlocoI: boolean;
  obrigadoBlocoP: boolean;
}

export interface ArquivoFiscalDto {
  id: string;
  tipo: TipoArquivoFiscalValor;
  competencia: string;
  finalidade: FinalidadeArquivoFiscalValor;
  nomeArquivo: string;
  totalRegistros: number;
  hashSha256: string;
  geradoEm: string;
}

export interface PendenciaGeracaoArquivoDto {
  codigo: string;
  descricao: string;
  documentoEscrituradoId: string | null;
  documento: string | null;
}

export interface GeracaoArquivoFiscalDto {
  arquivo: ArquivoFiscalDto | null;
  pendencias: PendenciaGeracaoArquivoDto[];
}

export interface GerarArquivoFiscalPayload {
  competencia: string;
  finalidade: FinalidadeArquivoFiscalValor;
}

export interface ListarArquivosFiscaisParams {
  tipo?: TipoArquivoFiscalValor;
  competencia?: string;
}
