import type {
  CriarPedidoVendaPayload,
  EditarPedidoVendaPayload,
  PedidoVendaDto,
  PedidoVendaFormModel,
  PedidoVendaItemFormModel,
} from 'types/dtos/pedido-venda.dto';

function parseNumeroObrigatorio(valor: string): number {
  return Number(valor.replace(',', '.'));
}

function parseNumeroOpcional(valor: string): number {
  const texto = valor.trim();

  if (!texto) {
    return 0;
  }

  return Number(texto.replace(',', '.'));
}

let chaveSequencia = 0;

export function criarChaveItem(): string {
  chaveSequencia += 1;
  return `item-${chaveSequencia}-${Date.now()}`;
}

export function criarItemFormVazio(): PedidoVendaItemFormModel {
  return {
    chave: criarChaveItem(),
    produtoId: '',
    quantidade: '',
    precoUnitario: '',
    descontoPercentual: '0',
  };
}

export function criarPedidoVendaFormVazio(): PedidoVendaFormModel {
  return {
    clienteId: '',
    vendedorUsuarioId: '',
    condicaoPagamentoId: '',
    formaPagamento: '',
    observacao: '',
    itens: [],
  };
}

export function pedidoDtoParaForm(dto: PedidoVendaDto): PedidoVendaFormModel {
  return {
    clienteId: dto.clienteId,
    vendedorUsuarioId: dto.vendedorUsuarioId,
    condicaoPagamentoId: dto.condicaoPagamentoId,
    formaPagamento: dto.formaPagamento,
    observacao: dto.observacao ?? '',
    itens: dto.itens.map((item) => ({
      chave: item.id,
      produtoId: item.produtoId,
      quantidade: String(item.quantidade),
      precoUnitario: String(item.precoUnitario),
      descontoPercentual: String(item.descontoPercentual ?? 0),
    })),
  };
}

export function formParaCriarPayload(form: PedidoVendaFormModel): CriarPedidoVendaPayload {
  return {
    clienteId: form.clienteId,
    vendedorUsuarioId: form.vendedorUsuarioId || null,
    condicaoPagamentoId: form.condicaoPagamentoId,
    formaPagamento: form.formaPagamento as CriarPedidoVendaPayload['formaPagamento'],
    observacao: form.observacao.trim() || null,
    itens: form.itens.map((item) => ({
      produtoId: item.produtoId,
      quantidade: parseNumeroObrigatorio(item.quantidade),
      precoUnitario: parseNumeroObrigatorio(item.precoUnitario),
      descontoPercentual: parseNumeroOpcional(item.descontoPercentual),
    })),
  };
}

export function formParaEditarPayload(form: PedidoVendaFormModel): EditarPedidoVendaPayload {
  return formParaCriarPayload(form);
}

export function subtotalItem(item: PedidoVendaItemFormModel): number {
  const quantidade = Number(item.quantidade.replace(',', '.'));
  const preco = Number(item.precoUnitario.replace(',', '.'));
  const desconto = parseNumeroOpcional(item.descontoPercentual);

  if (Number.isNaN(quantidade) || Number.isNaN(preco) || Number.isNaN(desconto)) {
    return 0;
  }

  return quantidade * preco * (1 - desconto / 100);
}

export function totalPedidoPreview(itens: PedidoVendaItemFormModel[]): number {
  return itens.reduce((acc, item) => acc + subtotalItem(item), 0);
}
