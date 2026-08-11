export const RelatorioCategoria = {
  GerenciaisComerciais: 'gerenciais-comerciais',
  Financeiros: 'financeiros',
} as const;

export type RelatorioCategoriaValor =
  (typeof RelatorioCategoria)[keyof typeof RelatorioCategoria];

export interface RelatorioCatalogoItem {
  id: string;
  titulo: string;
  descricao: string;
  icon: string;
  routeName: string;
  categoria: RelatorioCategoriaValor;
  exigeVerCustos?: boolean;
}

export const RELATORIOS_CATALOGO: readonly RelatorioCatalogoItem[] = [
  {
    id: 'curva-abc',
    titulo: 'Curva ABC de Vendas',
    descricao:
      'Classificação de produtos, clientes e fornecedores por volume de faturamento e margem.',
    icon: 'analytics',
    routeName: 'relatorio-curva-abc',
    categoria: RelatorioCategoria.GerenciaisComerciais,
  },
  {
    id: 'rentabilidade',
    titulo: 'Rentabilidade por Linha de Produto',
    descricao:
      'Análise de margem por categoria, produto, cliente e demais dimensões.',
    icon: 'insights',
    routeName: 'relatorio-rentabilidade',
    categoria: RelatorioCategoria.GerenciaisComerciais,
    exigeVerCustos: true,
  },
  {
    id: 'desempenho-rtv',
    titulo: 'Desempenho por RTV',
    descricao:
      'Metas, conversão, volume vendido, ticket médio e comissões por vendedor.',
    icon: 'groups',
    routeName: 'relatorio-desempenho-rtv',
    categoria: RelatorioCategoria.GerenciaisComerciais,
    exigeVerCustos: true,
  },
  {
    id: 'barter',
    titulo: 'Controle de Operações de Barter',
    descricao:
      'Troca de insumos versus grãos/safra a receber, com travas e exposição financeira.',
    icon: 'swap_horiz',
    routeName: 'relatorio-barter',
    categoria: RelatorioCategoria.GerenciaisComerciais,
  },
  {
    id: 'giro-estoque',
    titulo: 'Giro de Estoque',
    descricao:
      'Tempo médio até a venda por produto, para reduzir capital imobilizado.',
    icon: 'inventory_2',
    routeName: 'relatorio-giro-estoque',
    categoria: RelatorioCategoria.GerenciaisComerciais,
  },
  {
    id: 'fluxo-caixa',
    titulo: 'Fluxo de Caixa',
    descricao:
      'Visão diária, semanal e projetada de entradas e saídas no ciclo de safra.',
    icon: 'account_balance_wallet',
    routeName: 'relatorio-fluxo-caixa',
    categoria: RelatorioCategoria.Financeiros,
  },
  {
    id: 'contas',
    titulo: 'Contas a Pagar e a Receber',
    descricao:
      'Títulos em aberto, baixados e renegociados com totais e aging resumido.',
    icon: 'receipt_long',
    routeName: 'relatorio-contas',
    categoria: RelatorioCategoria.Financeiros,
  },
  {
    id: 'inadimplencia',
    titulo: 'Mapa de Inadimplência e Risco',
    descricao:
      'Atrasos por cliente, limite comprometido e risco para novas vendas.',
    icon: 'warning',
    routeName: 'relatorio-inadimplencia',
    categoria: RelatorioCategoria.Financeiros,
    exigeVerCustos: true,
  },
  {
    id: 'dre',
    titulo: 'DRE Gerencial',
    descricao:
      'Apuração do resultado da operação com custos, despesas e lucro líquido.',
    icon: 'summarize',
    routeName: 'relatorio-dre',
    categoria: RelatorioCategoria.Financeiros,
    exigeVerCustos: true,
  },
  {
    id: 'centro-custo',
    titulo: 'Despesas por Centro de Custo',
    descricao:
      'Rateio de gastos por frota, equipe técnica, logística e infraestrutura.',
    icon: 'account_tree',
    routeName: 'relatorio-centro-custo',
    categoria: RelatorioCategoria.Financeiros,
  },
] as const;

export const RelatorioCategoriaOpcoes = [
  {
    label: 'Gerenciais e Comerciais',
    value: RelatorioCategoria.GerenciaisComerciais,
  },
  { label: 'Financeiros', value: RelatorioCategoria.Financeiros },
] as const;

/** Mapa de deep-links antigos `?aba=` → rota nova. Abas removidas vão ao catálogo. */
export const REDIRECT_ABA_RELATORIO: Record<string, string> = {
  abc: 'relatorio-curva-abc',
  giro: 'relatorio-giro-estoque',
  dre: 'relatorio-dre',
  rentabilidade: 'relatorio-rentabilidade',
  inadimplencia: 'relatorio-inadimplencia',
  desempenho: 'relatorio-desempenho-rtv',
  comissoes: 'relatorio-desempenho-rtv',
  margem: 'relatorio-rentabilidade',
  ranking: 'relatorios',
  alertas: 'relatorios',
};
