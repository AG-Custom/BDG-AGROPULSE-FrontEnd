import type {
  DecisaoApuracaoValor,
  TipoAjusteApuracaoValor,
  TributoApuracaoValor,
} from 'constants/enums';

export interface TotaisApuracaoDto {
  totalDebitos: number;
  outrosDebitos: number;
  estornosCreditos: number;
  totalCreditos: number;
  outrosCreditos: number;
  estornosDebitos: number;
  deducoes: number;
  saldoCredorAnterior: number;
  saldoApurado: number;
  impostoARecolher: number;
  saldoCredorATransportar: number;
}

export interface LancamentoApuracaoDto {
  documentoEscrituradoId: string;
  documento: string;
  tipo: 'Debito' | 'Credito';
  origem: 'Automatica' | 'Revisao';
  valor: number;
}

export interface AjusteApuracaoDto {
  id: string;
  tipo: TipoAjusteApuracaoValor;
  valor: number;
  descricao: string;
  codigoAjuste: string | null;
}

export interface PendenciaApuracaoDto {
  codigo: string;
  gravidade: 'Bloqueante' | 'Alerta';
  descricao: string;
  documentoEscrituradoId: string | null;
  documento: string | null;
}

export interface DocumentoRevisaoDto {
  documentoEscrituradoId: string;
  documento: string;
  direcao: 'Entrada' | 'Saida';
  cfop: string | null;
  participanteNome: string | null;
  natureza: string;
  valorImposto: number;
  decisaoAtual: DecisaoApuracaoValor | null;
  justificativa: string | null;
  decisoesPermitidas: DecisaoApuracaoValor[];
}

export interface ApuracaoFiscalDto {
  tributo: TributoApuracaoValor;
  competencia: string;
  status: 'Aberta' | 'Fechada';
  fechadaEm: string | null;
  podeFechar: boolean;
  totais: TotaisApuracaoDto;
  lancamentos: LancamentoApuracaoDto[];
  ajustes: AjusteApuracaoDto[];
  pendencias: PendenciaApuracaoDto[];
  documentosRevisao: DocumentoRevisaoDto[];
}

export interface ResumoApuracaoFiscalDto {
  tributo: TributoApuracaoValor;
  competencia: string;
  impostoARecolher: number;
  saldoCredorATransportar: number;
  fechadaEm: string | null;
}

export interface DecidirDocumentoApuracaoPayload {
  decisao: DecisaoApuracaoValor;
  justificativa: string;
}

export interface AdicionarAjusteApuracaoPayload {
  tipo: TipoAjusteApuracaoValor;
  valor: number;
  descricao: string;
  codigoAjuste?: string | null;
}

export interface AjusteApuracaoFormModel {
  tipo: TipoAjusteApuracaoValor;
  valor: string;
  descricao: string;
  codigoAjuste: string;
}

export interface DecisaoApuracaoFormModel {
  decisao: DecisaoApuracaoValor;
  justificativa: string;
}
