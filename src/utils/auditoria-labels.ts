export const LABELS_ACAO_AUDITORIA: Record<string, string> = {
  Criacao: 'Criação',
  Edicao: 'Edição',
  Exclusao: 'Exclusão',
  EnvioAprovacao: 'Envio para aprovação',
  AprovacaoPedido: 'Aprovação de pedido',
  RecusaPedido: 'Recusa de pedido',
  ExpiracaoManual: 'Expiração manual',
  ExpiracaoAutomatica: 'Expiração automática',
  FaturamentoPedido: 'Faturamento',
  AlteracaoPrecoProduto: 'Alteração de preço',
  AlteracaoEstoque: 'Alteração de estoque',
  CadastroProduto: 'Cadastro de produto',
  EdicaoProduto: 'Edição de produto',
  Inativacao: 'Inativação',
  Ativacao: 'Ativação',
};

export const LABELS_MODELO_AUDITORIA: Record<string, string> = {
  PedidoVenda: 'Pedido de venda',
  PedidoCompra: 'Pedido de compra',
  RecebimentoCompra: 'Recebimento de compra',
  Produto: 'Produto',
  Cliente: 'Cliente',
  Fornecedor: 'Fornecedor',
  ContaReceber: 'Conta a receber',
  ContaPagar: 'Conta a pagar',
  NotaFiscal: 'Nota fiscal',
  Lote: 'Lote',
  LocalEstoque: 'Local de estoque',
  UsuarioEmpresa: 'Vínculo de usuário',
  Colaborador: 'Colaborador',
  TabelaPreco: 'Tabela de preço',
  Contrato: 'Contrato',
  Unidade: 'Unidade',
  Empresa: 'Empresa',
};

export const OPCOES_ACAO_AUDITORIA = Object.entries(LABELS_ACAO_AUDITORIA).map(
  ([value, label]) => ({ label, value }),
);

export function rotuloAcaoAuditoria(acao: string): string {
  return LABELS_ACAO_AUDITORIA[acao] ?? acao;
}

export function rotuloModeloAuditoria(modelo: string): string {
  return LABELS_MODELO_AUDITORIA[modelo] ?? modelo;
}

export function formatarDiffAuditoria(valor: string | null): string {
  if (!valor) {
    return '—';
  }

  try {
    const parsed: unknown = JSON.parse(valor);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return valor;
  }
}

export function encurtarId(id: string): string {
  if (id.length <= 8) {
    return id;
  }

  return id.slice(0, 8);
}
