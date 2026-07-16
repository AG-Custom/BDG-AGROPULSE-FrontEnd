import {
  ContaReceberStatus,
  ContaReceberStatusOpcoes,
  FormaPagamentoOpcoes,
  PedidoVendaStatus,
  PedidoVendaStatusOpcoes,
  type ContaReceberStatusValor,
  type FormaPagamentoValor,
  type PedidoVendaStatusValor,
} from 'constants/enums';

export type AgroBadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'accent';

export function rotuloPedidoVendaStatus(status: PedidoVendaStatusValor): string {
  return PedidoVendaStatusOpcoes.find((item) => item.value === status)?.label ?? status;
}

export function variantePedidoVendaStatus(
  status: PedidoVendaStatusValor,
): AgroBadgeVariant {
  switch (status) {
    case PedidoVendaStatus.Orcamento:
      return 'default';
    case PedidoVendaStatus.Aguardando:
      return 'warning';
    case PedidoVendaStatus.PendenteEstoque:
      return 'accent';
    case PedidoVendaStatus.Aprovado:
      return 'info';
    case PedidoVendaStatus.Faturado:
      return 'success';
    case PedidoVendaStatus.Recusado:
    case PedidoVendaStatus.Expirado:
      return 'error';
    default:
      return 'default';
  }
}

export function rotuloFormaPagamento(forma: FormaPagamentoValor): string {
  return FormaPagamentoOpcoes.find((item) => item.value === forma)?.label ?? forma;
}

export function rotuloContaReceberStatus(status: ContaReceberStatusValor): string {
  return ContaReceberStatusOpcoes.find((item) => item.value === status)?.label ?? status;
}

export function varianteContaReceberStatus(
  status: ContaReceberStatusValor,
): AgroBadgeVariant {
  if (status === ContaReceberStatus.Paga) {
    return 'success';
  }

  if (status === ContaReceberStatus.Cancelada) {
    return 'error';
  }

  return 'warning';
}
