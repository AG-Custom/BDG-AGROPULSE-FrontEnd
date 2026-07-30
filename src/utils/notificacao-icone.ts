import { NotificacaoTipo, type NotificacaoTipoValor } from 'constants/enums';

const ICONES_POR_TIPO: Record<NotificacaoTipoValor, string> = {
  [NotificacaoTipo.PedidoRetido]: 'lock_clock',
  [NotificacaoTipo.PedidoAprovado]: 'check_circle',
  [NotificacaoTipo.PedidoRecusado]: 'cancel',
  [NotificacaoTipo.PedidoExpirado]: 'timer_off',
  [NotificacaoTipo.PedidoAguardandoAprovacao]: 'pending_actions',
  [NotificacaoTipo.RevisaoLimiteCredito]: 'credit_score',
  [NotificacaoTipo.PosVenda]: 'support_agent',
  [NotificacaoTipo.AniversarioCliente]: 'cake',
  [NotificacaoTipo.AniversariantesCarteira]: 'cake',
  [NotificacaoTipo.DataComemorativa]: 'celebration',
  [NotificacaoTipo.ClienteSemComprar]: 'trending_down',
  [NotificacaoTipo.ComissoesMes]: 'percent',
  [NotificacaoTipo.EstoqueMinimo]: 'inventory_2',
  [NotificacaoTipo.ValidadeProxima]: 'hourglass_bottom',
  [NotificacaoTipo.BoletoCliente]: 'receipt_long',
  [NotificacaoTipo.BoletoFornecedor]: 'receipt',
  [NotificacaoTipo.ContasVencer3Dias]: 'event',
  [NotificacaoTipo.ContasVencer7Dias]: 'event',
  [NotificacaoTipo.ContasVencer15Dias]: 'event',
  [NotificacaoTipo.ContasVencidas]: 'money_off',
  [NotificacaoTipo.MetasLoja]: 'flag',
  [NotificacaoTipo.ContingenciaSefaz]: 'cloud_off',
  [NotificacaoTipo.RecomendacaoPendente]: 'lightbulb',
  [NotificacaoTipo.OsAgricolaAtrasada]: 'build',
  [NotificacaoTipo.SaldoMinimoCaixa]: 'account_balance_wallet',
};

export type TomIconeNotificacao = 'neutral' | 'success' | 'warning' | 'error' | 'info';

const TOM_POR_TIPO: Record<NotificacaoTipoValor, TomIconeNotificacao> = {
  [NotificacaoTipo.PedidoRetido]: 'warning',
  [NotificacaoTipo.PedidoAprovado]: 'success',
  [NotificacaoTipo.PedidoRecusado]: 'error',
  [NotificacaoTipo.PedidoExpirado]: 'warning',
  [NotificacaoTipo.PedidoAguardandoAprovacao]: 'warning',
  [NotificacaoTipo.RevisaoLimiteCredito]: 'info',
  [NotificacaoTipo.PosVenda]: 'info',
  [NotificacaoTipo.AniversarioCliente]: 'success',
  [NotificacaoTipo.AniversariantesCarteira]: 'success',
  [NotificacaoTipo.DataComemorativa]: 'success',
  [NotificacaoTipo.ClienteSemComprar]: 'warning',
  [NotificacaoTipo.ComissoesMes]: 'success',
  [NotificacaoTipo.EstoqueMinimo]: 'warning',
  [NotificacaoTipo.ValidadeProxima]: 'warning',
  [NotificacaoTipo.BoletoCliente]: 'info',
  [NotificacaoTipo.BoletoFornecedor]: 'info',
  [NotificacaoTipo.ContasVencer3Dias]: 'warning',
  [NotificacaoTipo.ContasVencer7Dias]: 'warning',
  [NotificacaoTipo.ContasVencer15Dias]: 'info',
  [NotificacaoTipo.ContasVencidas]: 'error',
  [NotificacaoTipo.MetasLoja]: 'info',
  [NotificacaoTipo.ContingenciaSefaz]: 'error',
  [NotificacaoTipo.RecomendacaoPendente]: 'info',
  [NotificacaoTipo.OsAgricolaAtrasada]: 'warning',
  [NotificacaoTipo.SaldoMinimoCaixa]: 'warning',
};

export function iconeDaNotificacao(tipo: NotificacaoTipoValor): string {
  return ICONES_POR_TIPO[tipo] ?? 'notifications';
}

export function tomIconeDaNotificacao(tipo: NotificacaoTipoValor): TomIconeNotificacao {
  return TOM_POR_TIPO[tipo] ?? 'neutral';
}
