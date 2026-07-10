import type {
  AjusteEstoqueFormModel,
  AjusteEstoquePayload,
  ContagemInventarioFormModel,
  EntradaEstoqueFormModel,
  EntradaEstoquePayload,
  RegistrarContagemInventarioPayload,
  SaidaEstoqueFormModel,
  SaidaEstoquePayload,
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
  };
}

export function formParaEntradaPayload(form: EntradaEstoqueFormModel): EntradaEstoquePayload {
  return {
    produtoId: form.produtoId,
    numeroLote: form.numeroLote.trim() || null,
    dataValidade: form.dataValidade || null,
    dataFabricacao: form.dataFabricacao || null,
    custoUnitario: parseNumeroOpcional(form.custoUnitario),
    quantidade: parseNumeroObrigatorio(form.quantidade),
  };
}

export function criarSaidaFormVazia(): SaidaEstoqueFormModel {
  return {
    produtoId: '',
    loteId: '',
    quantidade: '',
    usarFefo: true,
  };
}

export function formParaSaidaPayload(form: SaidaEstoqueFormModel): SaidaEstoquePayload {
  return {
    produtoId: form.produtoId,
    loteId: form.usarFefo ? null : form.loteId || null,
    quantidade: parseNumeroObrigatorio(form.quantidade),
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
