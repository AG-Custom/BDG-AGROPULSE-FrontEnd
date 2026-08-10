import type {
  EditarTabelaPrecoItemPayload,
  SalvarTabelaPrecoPayload,
  TabelaPrecoDto,
  TabelaPrecoFormModel,
  TabelaPrecoItemDto,
  TabelaPrecoItemEdicaoFormModel,
  TabelaPrecoItemFormModel,
  TabelaPrecoItemPayload,
} from 'types/dtos/tabela-preco.dto';
import { formatarMoedaParaInput, parseMascaraMoeda } from 'utils/formatters';

export function criarTabelaPrecoFormVazia(clienteId: string | null = null): TabelaPrecoFormModel {
  const hoje = new Date();
  const vigenciaInicio = [
    hoje.getFullYear(),
    String(hoje.getMonth() + 1).padStart(2, '0'),
    String(hoje.getDate()).padStart(2, '0'),
  ].join('-');

  return {
    nome: '',
    vigenciaInicio,
    vigenciaFim: '',
    clienteId,
    canalVenda: null,
    regiao: '',
  };
}

export function tabelaPrecoDtoParaForm(dto: TabelaPrecoDto): TabelaPrecoFormModel {
  return {
    nome: dto.nome,
    vigenciaInicio: dto.vigenciaInicio,
    vigenciaFim: dto.vigenciaFim ?? '',
    clienteId: dto.clienteId,
    canalVenda: dto.canalVenda,
    regiao: dto.regiao ?? '',
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

export function formParaSalvarTabelaPrecoPayload(form: TabelaPrecoFormModel): SalvarTabelaPrecoPayload {
  return {
    nome: form.nome.trim(),
    vigenciaInicio: form.vigenciaInicio.trim(),
    vigenciaFim: form.vigenciaFim.trim() || null,
    clienteId: form.clienteId,
    grupoComercial: null,
    canalVenda: form.canalVenda,
    regiao: form.regiao.trim() || null,
  };
}

export function criarItemFormVazio(): TabelaPrecoItemFormModel {
  return {
    produtoId: null,
    preco: '',
    margemMinimaPercentual: '',
  };
}

export function itemDtoParaForm(dto: TabelaPrecoItemDto): TabelaPrecoItemFormModel {
  return {
    produtoId: dto.produtoId,
    preco: formatarMoedaParaInput(dto.preco),
    margemMinimaPercentual:
      dto.margemMinimaPercentual !== null ? String(dto.margemMinimaPercentual) : '',
  };
}

export function itemDtoParaEdicaoForm(dto: TabelaPrecoItemDto): TabelaPrecoItemEdicaoFormModel {
  return {
    preco: formatarMoedaParaInput(dto.preco),
    margemMinimaPercentual:
      dto.margemMinimaPercentual !== null ? String(dto.margemMinimaPercentual) : '',
  };
}

export function formParaItemPayload(form: TabelaPrecoItemFormModel): TabelaPrecoItemPayload {
  return {
    produtoId: form.produtoId!,
    preco: parseMascaraMoeda(form.preco) ?? 0,
    margemMinimaPercentual: parseNumeroOpcional(form.margemMinimaPercentual),
  };
}

export function formParaEditarItemPayload(
  form: TabelaPrecoItemEdicaoFormModel,
): EditarTabelaPrecoItemPayload {
  return {
    preco: parseMascaraMoeda(form.preco) ?? 0,
    margemMinimaPercentual: parseNumeroOpcional(form.margemMinimaPercentual),
  };
}
