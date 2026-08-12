import type { RegimeTributarioValor, TipoCertificadoDigitalValor, TipoOperacaoEmpresaValor } from 'constants/enums';
import type { UnidadeOnboardingPayload } from 'types/dtos/onboarding.dto';

export type EmpresaStatusPlataforma = 'Rascunho' | 'Ativo' | 'Suspenso';

export interface EmpresaPlataformaListItemDto {
  id: string;
  nomeFantasia: string;
  razaoSocial: string;
  cnpj: string;
  status: EmpresaStatusPlataforma;
  tipoOperacao: TipoOperacaoEmpresaValor;
  qtdUnidades: number;
  criadoEm: string;
}

export interface ListarEmpresasPlataformaResponseDto {
  items: EmpresaPlataformaListItemDto[];
}

export interface UnidadePlataformaResumoDto {
  id: string;
  nome: string;
  codigo: string;
  matriz: boolean;
  ativo: boolean;
}

export interface AliquotaIcmsPlataformaDto {
  uf: string;
  aliquotaInterna: number;
  aliquotaInterestadual: number;
}

export interface PisCofinsNcmPlataformaDto {
  id?: string;
  ncm: string;
  cstPis: string;
  cstCofins: string;
  aliquotaPis: number;
  aliquotaCofins: number;
  suspenso: boolean;
  vigenciaInicio: string;
  vigenciaFim: string | null;
}

export interface CertificadoDigitalPlataformaDto {
  tipo: TipoCertificadoDigitalValor;
  nomeOriginal: string;
  contentType: string;
  tamanhoBytes: number;
  urlPublica: string | null;
  possuiSenha: boolean;
}

export interface FichaClientePlataformaDto {
  nomeOriginal: string;
  contentType: string;
  tamanhoBytes: number;
  urlPublica: string | null;
}

export interface EmpresaPlataformaDetalheDto {
  id: string;
  nomeFantasia: string;
  razaoSocial: string;
  cnpj: string;
  status: EmpresaStatusPlataforma;
  tipoOperacao: TipoOperacaoEmpresaValor;
  criadoEm: string;
  unidades: UnidadePlataformaResumoDto[];
  regimeTributario: RegimeTributarioValor | null;
  serieNfe: string | null;
  estadosOperacao: string[];
  aliquotasIcms: AliquotaIcmsPlataformaDto[];
  pisCofinsNcm: PisCofinsNcmPlataformaDto[];
  certificado: CertificadoDigitalPlataformaDto | null;
  fichaCliente: FichaClientePlataformaDto | null;
}

export interface AdminEmpresaPlataformaPayload {
  nome: string;
  sobrenome: string;
  email: string;
}

export interface AliquotaIcmsPlataformaPayload {
  uf: string;
  aliquotaInterna: number;
  aliquotaInterestadual: number;
}

export interface PisCofinsNcmPlataformaPayload {
  ncm: string;
  cstPis: string;
  cstCofins: string;
  aliquotaPis: number;
  aliquotaCofins: number;
  suspenso: boolean;
  vigenciaInicio: string;
  vigenciaFim?: string | null;
}

export interface CadastroFiscalEmpresaPayload {
  regimeTributario: RegimeTributarioValor;
  serieNfe: string;
  estadosOperacao: string[];
  aliquotasIcms: AliquotaIcmsPlataformaPayload[];
  pisCofinsNcm: PisCofinsNcmPlataformaPayload[];
}

export interface CriarEmpresaPlataformaPayload extends CadastroFiscalEmpresaPayload {
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  tipoOperacao: TipoOperacaoEmpresaValor;
  unidades: UnidadeOnboardingPayload[];
  admin: AdminEmpresaPlataformaPayload;
}

export interface AtualizarEmpresaPlataformaPayload extends CadastroFiscalEmpresaPayload {
  razaoSocial: string;
  nomeFantasia: string;
  tipoOperacao: TipoOperacaoEmpresaValor;
}

export interface UnidadeCriadaPlataformaDto {
  id: string;
  nome: string;
  codigo: string;
  matriz: boolean;
}

export interface CriarEmpresaPlataformaResponseDto {
  empresaId: string;
  unidades: UnidadeCriadaPlataformaDto[];
  unidadeMatrizId: string;
  adminUsuarioId: string;
  message: string;
}

export interface AdminEmpresaFormModel {
  nome: string;
  sobrenome: string;
  email: string;
}

export interface AliquotaIcmsFormModel {
  uf: string;
  aliquotaInterna: string;
  aliquotaInterestadual: string;
}

export interface PisCofinsNcmFormModel {
  id: string;
  ncm: string;
  cstPis: string;
  cstCofins: string;
  aliquotaPis: string;
  aliquotaCofins: string;
  suspenso: boolean;
  vigenciaInicio: string;
  vigenciaFim: string;
}

export interface TributacaoEmpresaFormModel {
  regimeTributario: RegimeTributarioValor | '';
  serieNfe: string;
  estadosOperacao: string[];
  aliquotasIcms: AliquotaIcmsFormModel[];
  pisCofinsNcm: PisCofinsNcmFormModel[];
}

export interface DocumentosEmpresaFormModel {
  tipoCertificado: TipoCertificadoDigitalValor;
  arquivoFicha: File | null;
}

export function criarAdminVazio(): AdminEmpresaFormModel {
  return {
    nome: '',
    sobrenome: '',
    email: '',
  };
}

export function criarPisCofinsNcmVazio(): PisCofinsNcmFormModel {
  return {
    id: crypto.randomUUID(),
    ncm: '',
    cstPis: '',
    cstCofins: '',
    aliquotaPis: '',
    aliquotaCofins: '',
    suspenso: false,
    vigenciaInicio: new Date().toISOString().slice(0, 10),
    vigenciaFim: '',
  };
}

export function criarTributacaoVazia(): TributacaoEmpresaFormModel {
  return {
    regimeTributario: '',
    serieNfe: '1',
    estadosOperacao: [],
    aliquotasIcms: [],
    pisCofinsNcm: [criarPisCofinsNcmVazio()],
  };
}

export function criarDocumentosVazios(): DocumentosEmpresaFormModel {
  return {
    tipoCertificado: 'A1',
    arquivoFicha: null,
  };
}

function parseAliquota(valor: string): number {
  return Number(valor.replace(',', '.'));
}

export function montarPayloadFiscal(tributacao: TributacaoEmpresaFormModel): CadastroFiscalEmpresaPayload {
  if (!tributacao.regimeTributario) {
    throw new Error('Regime tributário é obrigatório.');
  }

  return {
    regimeTributario: tributacao.regimeTributario,
    serieNfe: tributacao.serieNfe.trim(),
    estadosOperacao: tributacao.estadosOperacao,
    aliquotasIcms: tributacao.aliquotasIcms.map((linha) => ({
      uf: linha.uf,
      aliquotaInterna: parseAliquota(linha.aliquotaInterna),
      aliquotaInterestadual: parseAliquota(linha.aliquotaInterestadual),
    })),
    pisCofinsNcm: tributacao.pisCofinsNcm.map((linha) => ({
      ncm: linha.ncm.replace(/\D/g, ''),
      cstPis: linha.cstPis.trim(),
      cstCofins: linha.cstCofins.trim(),
      aliquotaPis: parseAliquota(linha.aliquotaPis),
      aliquotaCofins: parseAliquota(linha.aliquotaCofins),
      suspenso: linha.suspenso,
      vigenciaInicio: linha.vigenciaInicio,
      vigenciaFim: linha.vigenciaFim.trim() || null,
    })),
  };
}

export function tributacaoDeDetalhe(detalhe: EmpresaPlataformaDetalheDto): TributacaoEmpresaFormModel {
  return {
    regimeTributario: detalhe.regimeTributario ?? '',
    serieNfe: detalhe.serieNfe ?? '1',
    estadosOperacao: [...detalhe.estadosOperacao],
    aliquotasIcms: detalhe.aliquotasIcms.map((linha) => ({
      uf: linha.uf,
      aliquotaInterna: String(linha.aliquotaInterna),
      aliquotaInterestadual: String(linha.aliquotaInterestadual),
    })),
    pisCofinsNcm:
      detalhe.pisCofinsNcm.length > 0
        ? detalhe.pisCofinsNcm.map((linha) => ({
            id: linha.id ?? crypto.randomUUID(),
            ncm: linha.ncm,
            cstPis: linha.cstPis,
            cstCofins: linha.cstCofins,
            aliquotaPis: String(linha.aliquotaPis),
            aliquotaCofins: String(linha.aliquotaCofins),
            suspenso: linha.suspenso,
            vigenciaInicio: linha.vigenciaInicio,
            vigenciaFim: linha.vigenciaFim ?? '',
          }))
        : [criarPisCofinsNcmVazio()],
  };
}
