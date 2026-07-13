import type {
  ConfigFormaPagamentoFormModel,
  CriarConfigFormaPagamentoPayload,
  EditarConfigFormaPagamentoPayload,
  TaxaFormaPagamentoFormModel,
  UpsertTaxaFormaPagamentoPayload,
} from 'types/dtos/financeiro.dto';
import type { FormaPagamentoValor } from 'constants/enums';

function parseNumeroObrigatorio(valor: string): number {
  return Number(valor.replace(',', '.'));
}

export function criarConfigFormaPagamentoFormVazio(): ConfigFormaPagamentoFormModel {
  return {
    formaPagamento: '',
    repassarTaxaCliente: false,
  };
}

export function criarTaxaFormVazia(parcelas = '1'): TaxaFormaPagamentoFormModel {
  return {
    parcelas,
    taxaPercentual: '0',
    taxaFixa: '0',
  };
}

export function formParaCriarConfigPayload(
  form: ConfigFormaPagamentoFormModel,
): CriarConfigFormaPagamentoPayload {
  return {
    formaPagamento: form.formaPagamento as FormaPagamentoValor,
    repassarTaxaCliente: form.repassarTaxaCliente,
  };
}

export function formParaEditarConfigPayload(
  form: ConfigFormaPagamentoFormModel,
): EditarConfigFormaPagamentoPayload {
  return {
    repassarTaxaCliente: form.repassarTaxaCliente,
  };
}

export function formParaTaxaPayload(
  form: TaxaFormaPagamentoFormModel,
): UpsertTaxaFormaPagamentoPayload {
  return {
    parcelas: Number(form.parcelas),
    taxaPercentual: parseNumeroObrigatorio(form.taxaPercentual),
    taxaFixa: parseNumeroObrigatorio(form.taxaFixa),
  };
}
