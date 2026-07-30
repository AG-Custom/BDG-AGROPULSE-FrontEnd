import { NotificacaoTipo } from 'constants/enums';
import type { NotificacaoDto } from 'types/dtos/notificacao.dto';
import type { RouteLocationRaw } from 'vue-router';

export function rotaDaNotificacao(item: NotificacaoDto): RouteLocationRaw | null {
  const modelo = item.modeloReferencia.toLowerCase();
  const tipo = item.tipo;

  if (
    tipo === NotificacaoTipo.PedidoAguardandoAprovacao ||
    tipo === NotificacaoTipo.PedidoRetido
  ) {
    if (item.idReferencia) {
      return {
        name: 'pedido-venda-detalhe',
        params: { id: item.idReferencia },
      };
    }

    return { name: 'aprovacoes' };
  }

  if (
    (tipo === NotificacaoTipo.PedidoAprovado ||
      tipo === NotificacaoTipo.PedidoRecusado ||
      tipo === NotificacaoTipo.PedidoExpirado ||
      modelo.includes('pedido')) &&
    item.idReferencia
  ) {
    return {
      name: 'pedido-venda-detalhe',
      params: { id: item.idReferencia },
    };
  }

  if (
    tipo === NotificacaoTipo.RevisaoLimiteCredito ||
    modelo.includes('credito') ||
    modelo.includes('cobranca')
  ) {
    if (item.idReferencia) {
      return {
        name: 'crm-credito-detalhe',
        params: { id: item.idReferencia },
      };
    }

    return { name: 'cobranca-credito' };
  }

  if (
    tipo === NotificacaoTipo.EstoqueMinimo ||
    tipo === NotificacaoTipo.ValidadeProxima ||
    modelo.includes('estoque')
  ) {
    return { name: 'estoque-alertas' };
  }

  if (
    tipo === NotificacaoTipo.BoletoCliente ||
    tipo === NotificacaoTipo.ContasVencer3Dias ||
    tipo === NotificacaoTipo.ContasVencer7Dias ||
    tipo === NotificacaoTipo.ContasVencer15Dias ||
    tipo === NotificacaoTipo.ContasVencidas ||
    modelo.includes('contareceber') ||
    modelo.includes('boleto')
  ) {
    return { name: 'contas-receber' };
  }

  if (
    tipo === NotificacaoTipo.BoletoFornecedor ||
    modelo.includes('contapagar') ||
    modelo.includes('fornecedor')
  ) {
    return { name: 'contas-pagar' };
  }

  if (
    tipo === NotificacaoTipo.AniversarioCliente ||
    tipo === NotificacaoTipo.AniversariantesCarteira ||
    tipo === NotificacaoTipo.ClienteSemComprar ||
    tipo === NotificacaoTipo.PosVenda ||
    tipo === NotificacaoTipo.DataComemorativa
  ) {
    if (item.idReferencia && modelo.includes('cliente')) {
      return {
        name: 'cliente-visualizar',
        params: { id: item.idReferencia },
      };
    }

    return { name: 'crm-carteira' };
  }

  if (tipo === NotificacaoTipo.ComissoesMes || tipo === NotificacaoTipo.MetasLoja) {
    return { name: 'metas-vendedor' };
  }

  if (tipo === NotificacaoTipo.ContingenciaSefaz) {
    return { name: 'fiscal-contingencia' };
  }

  return null;
}
