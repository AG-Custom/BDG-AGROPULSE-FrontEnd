import { OrigemMovimentacaoEstoque } from 'constants/enums';
import { parseMascaraMoeda } from 'utils/formatters';
import type {
  AjusteEstoqueFormModel,
  AjusteEstoquePayload,
  ContagemInventarioFormModel,
  CriarTransferenciaEstoquePayload,
  EntradaEstoqueFormModel,
  EntradaEstoquePayload,
  RegistrarContagemInventarioPayload,
  SaidaEstoqueFormModel,
  SaidaEstoquePayload,
  TransferenciaEstoqueFormModel,
  TransferenciaEstoqueItemFormModel,
} from 'types/dtos/estoque.dto';

function parseNumeroObrigatorio(valor: string): number {
  return Number(valor.replace(',', '.'));
}

function parseNumeroOpcional(valor: string): number | null {
  const texto = valor.trim();

  if (!texto) {
    return null;
  }

  return Number(texto.replace(',', '.'));
}

export function criarEntradaFormVazia(): EntradaEstoqueFormModel {
  return {
    produtoId: '',
    numeroLote: '',
    dataValidade: '',
    dataFabricacao: '',
    custoUnitario: '',
    quantidade: '',
    deposito: '',
    galpao: '',
    corredor: '',
    prateleira: '',
  };
}

export function formParaEntradaPayload(form: EntradaEstoqueFormModel): EntradaEstoquePayload {
  return {
    produtoId: form.produtoId,
    numeroLote: form.numeroLote.trim() || null,
    dataValidade: form.dataValidade || null,
    dataFabricacao: form.dataFabricacao || null,
    custoUnitario: parseMascaraMoeda(form.custoUnitario),
    quantidade: parseNumeroObrigatorio(form.quantidade),
    deposito: form.deposito.trim() || null,
    galpao: form.galpao.trim() || null,
    corredor: form.corredor.trim() || null,
    prateleira: form.prateleira.trim() || null,
  };
}

export function criarSaidaFormVazia(): SaidaEstoqueFormModel {
  return {
    produtoId: '',
    loteId: '',
    quantidade: '',
    usarFefo: true,
    motivo: OrigemMovimentacaoEstoque.Manual,
    justificativa: '',
  };
}

export function formParaSaidaPayload(form: SaidaEstoqueFormModel): SaidaEstoquePayload {
  return {
    produtoId: form.produtoId,
    loteId: form.usarFefo ? null : form.loteId || null,
    quantidade: parseNumeroObrigatorio(form.quantidade),
    motivo: form.motivo || OrigemMovimentacaoEstoque.Manual,
    justificativa: form.justificativa.trim() || null,
  };
}

export function criarAjusteFormVazio(loteId = ''): AjusteEstoqueFormModel {
  return {
    loteId,
    quantidadeNova: '',
    justificativa: '',
  };
}

export function formParaAjustePayload(form: AjusteEstoqueFormModel): AjusteEstoquePayload {
  return {
    loteId: form.loteId,
    quantidadeNova: parseNumeroObrigatorio(form.quantidadeNova),
    justificativa: form.justificativa.trim(),
  };
}

export function criarContagemFormVazia(quantidadeContada = ''): ContagemInventarioFormModel {
  return {
    quantidadeContada,
  };
}

export function formParaContagemPayload(
  form: ContagemInventarioFormModel,
): RegistrarContagemInventarioPayload {
  return {
    quantidadeContada: parseNumeroObrigatorio(form.quantidadeContada),
  };
}

export function criarItemTransferenciaForm(): TransferenciaEstoqueItemFormModel {
  return {
    chave: crypto.randomUUID(),
    produtoId: '',
    loteId: '',
    quantidade: '',
  };
}

export function criarTransferenciaFormVazia(): TransferenciaEstoqueFormModel {
  return {
    unidadeDestinoId: '',
    justificativa: '',
    itens: [criarItemTransferenciaForm()],
  };
}

export function formParaTransferenciaPayload(
  form: TransferenciaEstoqueFormModel,
): CriarTransferenciaEstoquePayload {
  return {
    unidadeDestinoId: form.unidadeDestinoId,
    justificativa: form.justificativa.trim() || null,
    itens: form.itens.map((item) => ({
      produtoId: item.produtoId,
      loteId: item.loteId || null,
      quantidade: parseNumeroObrigatorio(item.quantidade),
    })),
  };
}
