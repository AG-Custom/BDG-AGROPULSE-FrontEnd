import { OrigemMercadoria, TipoCodigoProduto, TipoProduto } from 'constants/enums';

import type {
  CriarProdutoPayload,
  EditarProdutoConversaoPayload,
  EditarProdutoPayload,
  ProdutoCodigoDto,
  ProdutoCodigoFormModel,
  ProdutoCodigoPayload,
  ProdutoComplementosFormModel,
  ProdutoConversaoEdicaoFormModel,
  ProdutoConversaoFormModel,
  ProdutoConversaoUnidadeDto,
  ProdutoDocumentoRascunho,
  ProdutoDto,
  ProdutoFiscalDto,
  ProdutoFiscalFormModel,
  ProdutoFiscalPayload,
  ProdutoFormModel,
  ProdutoLimiteEstoqueDto,
  ProdutoLimiteEstoqueFormModel,
  ProdutoLimiteEstoqueItemPayload,
  ProdutoConversaoPayload,
} from 'types/dtos/produto.dto';
import type { TipoDocumentoProdutoValor } from 'constants/enums';
import { apenasDigitos, formatarMoedaParaInput, parseMascaraMoeda } from 'utils/formatters';

export function gerarIdTemporario(): string {
  return `temp-${crypto.randomUUID()}`;
}

export function criarComplementosFormVazio(): ProdutoComplementosFormModel {
  return {
    fiscal: criarFiscalFormVazio(),
    codigos: [],
    documentos: [],
    limites: [],
    conversoes: [],
  };
}

export function fiscalFormTemDados(form: ProdutoFiscalFormModel): boolean {
  return (
    apenasDigitos(form.ncm).length > 0 ||
    apenasDigitos(form.cest).length > 0 ||
    form.csosn.trim().length > 0 ||
    form.cstIcms.trim().length > 0 ||
    form.aliquotaIcms.trim().length > 0 ||
    form.mva.trim().length > 0 ||
    form.observacoesFiscais.trim().length > 0 ||
    apenasDigitos(form.cfopPadraoInterno).length > 0 ||
    apenasDigitos(form.cfopPadraoExterno).length > 0
  );
}

export function criarDocumentoRascunho(
  tipo: TipoDocumentoProdutoValor,
  arquivo: File,
): ProdutoDocumentoRascunho {
  return {
    id: gerarIdTemporario(),
    tipo,
    nomeOriginal: arquivo.name,
    contentType: arquivo.type || 'application/octet-stream',
    tamanhoBytes: arquivo.size,
    arquivo,
  };
}

export function codigoFormParaDtoLocal(form: ProdutoCodigoFormModel): ProdutoCodigoDto {
  return {
    id: gerarIdTemporario(),
    tipo: form.tipo,
    valor: form.valor.trim(),
    principal: form.principal,
  };
}

export function conversaoFormParaDtoLocal(
  form: ProdutoConversaoFormModel,
): ProdutoConversaoUnidadeDto {
  return {
    id: gerarIdTemporario(),
    unidadeOrigemId: form.unidadeOrigemId!,
    unidadeDestinoId: form.unidadeDestinoId!,
    fatorConversao: Number(form.fatorConversao.replace(',', '.')),
  };
}

export function criarProdutoFormVazio(): ProdutoFormModel {
  return {
    descricao: '',
    categoriaProdutoId: null,
    tipoProduto: TipoProduto.InsumoAgricola,
    unidadeMedidaId: null,
    exigeLote: false,
    exigeValidade: false,
    exigeFabricacao: false,
    diasAlertaValidade: '',
    precoVenda: '',
    fatorDivisaoNfe: '1',
    margemMinimaPercentual: '',
    comissaoPercentual: '',
    metodoCusteio: null,
    recalcularMargemAPartirDoPreco: false,
  };
}

export function produtoDtoParaForm(dto: ProdutoDto): ProdutoFormModel {
  return {
    descricao: dto.descricao,
    categoriaProdutoId: dto.categoriaProdutoId,
    tipoProduto: dto.tipoProduto,
    unidadeMedidaId: dto.unidadeMedidaId,
    exigeLote: dto.exigeLote,
    exigeValidade: dto.exigeValidade,
    exigeFabricacao: dto.exigeFabricacao,
    diasAlertaValidade:
      dto.diasAlertaValidade !== null && dto.diasAlertaValidade !== undefined
        ? String(dto.diasAlertaValidade)
        : '',
    precoVenda: formatarMoedaParaInput(dto.precoVenda),
    fatorDivisaoNfe: String(dto.fatorDivisaoNfe),
    margemMinimaPercentual:
      dto.margemMinimaPercentual !== null ? String(dto.margemMinimaPercentual) : '',
    comissaoPercentual: dto.comissaoPercentual !== null ? String(dto.comissaoPercentual) : '',
    metodoCusteio: dto.metodoCusteio,
    recalcularMargemAPartirDoPreco: false,
  };
}

function parseNumeroOpcional(valor: string): number | null {
  const texto = valor.trim();
  if (!texto) {
    return null;
  }

  const numero = Number(texto.replace(',', '.'));
  return Number.isFinite(numero) ? numero : null;
}

function montarPayloadBase(form: ProdutoFormModel): CriarProdutoPayload {
  return {
    descricao: form.descricao.trim(),
    categoriaProdutoId: form.categoriaProdutoId!,
    tipoProduto: form.tipoProduto,
    unidadeMedidaId: form.unidadeMedidaId!,
    exigeLote: form.exigeLote,
    exigeValidade: form.exigeValidade,
    exigeFabricacao: form.exigeFabricacao,
    diasAlertaValidade: parseNumeroOpcional(form.diasAlertaValidade),
    precoVenda: parseMascaraMoeda(form.precoVenda) ?? 0,
    fatorDivisaoNfe: parseNumeroOpcional(form.fatorDivisaoNfe) ?? 1,
    margemMinimaPercentual: parseNumeroOpcional(form.margemMinimaPercentual),
    comissaoPercentual: parseNumeroOpcional(form.comissaoPercentual),
  };
}

export function formParaCriarPayload(form: ProdutoFormModel): CriarProdutoPayload {
  return montarPayloadBase(form);
}

export function formParaEditarPayload(form: ProdutoFormModel): EditarProdutoPayload {
  return {
    ...montarPayloadBase(form),
    metodoCusteio: form.metodoCusteio,
    recalcularMargemAPartirDoPreco: form.recalcularMargemAPartirDoPreco || undefined,
  };
}

export function criarFiscalFormVazio(): ProdutoFiscalFormModel {
  return {
    ncm: '',
    cest: '',
    origemMercadoria: OrigemMercadoria.Nacional,
    csosn: '',
    cstIcms: '',
    aliquotaIcms: '',
    mva: '',
    observacoesFiscais: '',
    cfopPadraoInterno: '',
    cfopPadraoExterno: '',
  };
}

export function fiscalDtoParaForm(dto: ProdutoFiscalDto): ProdutoFiscalFormModel {
  return {
    ncm: dto.ncm,
    cest: dto.cest ?? '',
    origemMercadoria: dto.origemMercadoria,
    csosn: dto.csosn ?? '',
    cstIcms: dto.cstIcms ?? '',
    aliquotaIcms: dto.aliquotaIcms !== null ? String(dto.aliquotaIcms) : '',
    mva: dto.mva !== null ? String(dto.mva) : '',
    observacoesFiscais: dto.observacoesFiscais ?? '',
    cfopPadraoInterno: dto.cfopPadraoInterno ?? '',
    cfopPadraoExterno: dto.cfopPadraoExterno ?? '',
  };
}

export function formParaFiscalPayload(form: ProdutoFiscalFormModel): ProdutoFiscalPayload {
  return {
    ncm: apenasDigitos(form.ncm),
    cest: apenasDigitos(form.cest) || null,
    origemMercadoria: form.origemMercadoria,
    csosn: form.csosn.trim() || null,
    cstIcms: form.cstIcms.trim() || null,
    aliquotaIcms: parseNumeroOpcional(form.aliquotaIcms),
    mva: parseNumeroOpcional(form.mva),
    observacoesFiscais: form.observacoesFiscais.trim() || null,
    cfopPadraoInterno: apenasDigitos(form.cfopPadraoInterno) || null,
    cfopPadraoExterno: apenasDigitos(form.cfopPadraoExterno) || null,
  };
}

export function criarCodigoFormVazio(): ProdutoCodigoFormModel {
  return {
    tipo: TipoCodigoProduto.SKU,
    valor: '',
    principal: false,
  };
}

export function codigoDtoParaForm(dto: ProdutoCodigoDto): ProdutoCodigoFormModel {
  return {
    tipo: dto.tipo,
    valor: dto.valor,
    principal: dto.principal,
  };
}

export function formParaCodigoPayload(form: ProdutoCodigoFormModel): ProdutoCodigoPayload {
  return {
    tipo: form.tipo,
    valor: form.valor.trim(),
    principal: form.principal,
  };
}

export function criarLimiteEstoqueFormVazio(
  unidadeId: string | null = null,
): ProdutoLimiteEstoqueFormModel {
  return {
    unidadeId,
    estoqueMinimo: '',
    estoqueMaximo: '',
  };
}

export function limiteDtoParaForm(dto: ProdutoLimiteEstoqueDto): ProdutoLimiteEstoqueFormModel {
  return {
    unidadeId: dto.unidadeId,
    estoqueMinimo: String(dto.estoqueMinimo),
    estoqueMaximo: dto.estoqueMaximo !== null ? String(dto.estoqueMaximo) : '',
  };
}

export function formParaLimitePayload(
  form: ProdutoLimiteEstoqueFormModel,
): ProdutoLimiteEstoqueItemPayload {
  return {
    unidadeId: form.unidadeId!,
    estoqueMinimo: Number(form.estoqueMinimo.replace(',', '.')),
    estoqueMaximo: parseNumeroOpcional(form.estoqueMaximo),
  };
}

export function criarConversaoFormVazio(): ProdutoConversaoFormModel {
  return {
    unidadeOrigemId: null,
    unidadeDestinoId: null,
    fatorConversao: '',
  };
}

export function conversaoDtoParaForm(dto: ProdutoConversaoUnidadeDto): ProdutoConversaoFormModel {
  return {
    unidadeOrigemId: dto.unidadeOrigemId,
    unidadeDestinoId: dto.unidadeDestinoId,
    fatorConversao: String(dto.fatorConversao),
  };
}

export function conversaoDtoParaEdicaoForm(
  dto: ProdutoConversaoUnidadeDto,
): ProdutoConversaoEdicaoFormModel {
  return {
    fatorConversao: String(dto.fatorConversao),
  };
}

export function formParaConversaoPayload(form: ProdutoConversaoFormModel): ProdutoConversaoPayload {
  return {
    unidadeOrigemId: form.unidadeOrigemId!,
    unidadeDestinoId: form.unidadeDestinoId!,
    fatorConversao: Number(form.fatorConversao.replace(',', '.')),
  };
}

export function formParaEditarConversaoPayload(
  form: ProdutoConversaoEdicaoFormModel,
): EditarProdutoConversaoPayload {
  return {
    fatorConversao: Number(form.fatorConversao.replace(',', '.')),
  };
}

export function formatarTamanhoArquivo(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
