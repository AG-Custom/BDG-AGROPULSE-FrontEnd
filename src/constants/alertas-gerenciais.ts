import { Permissoes } from 'constants/permissoes';

export interface AcaoAlertaGerencial {
  label: string;
  routeName: string;
  permissao: string;
}

export interface DefinicaoAlertaGerencial {
  significado: string;
  acao: AcaoAlertaGerencial;
}

export const ALERTAS_GERENCIAIS: Record<string, DefinicaoAlertaGerencial> = {
  MetaDesvio: {
    significado:
      'Um vendedor está abaixo do percentual mínimo da meta no mês. Acompanhe o desempenho da equipe e alinhe um plano de ação.',
    acao: {
      label: 'Ver desempenho',
      routeName: 'relatorio-desempenho-rtv',
      permissao: Permissoes.Relatorios.Visualizar,
    },
  },
  MargemBaixa: {
    significado:
      'A margem média dos últimos 30 dias está abaixo do mínimo configurado. Revise preços e custos dos produtos e clientes de menor retorno.',
    acao: {
      label: 'Revisar rentabilidade',
      routeName: 'relatorio-rentabilidade',
      permissao: Permissoes.Relatorios.Visualizar,
    },
  },
  InadimplenciaCritica: {
    significado:
      'O percentual de títulos vencidos passou do limite crítico. Priorize a cobrança dos clientes em atraso.',
    acao: {
      label: 'Cobrar clientes',
      routeName: 'cobranca-credito',
      permissao: Permissoes.CobrancaCredito.Visualizar,
    },
  },
  EstoqueMinimo: {
    significado:
      'Há produtos com saldo abaixo do estoque mínimo. Verifique quais itens precisam de reposição.',
    acao: {
      label: 'Repor estoque',
      routeName: 'estoque-alertas',
      permissao: Permissoes.Estoque.Visualizar,
    },
  },
};
