import { Permissoes } from 'constants/permissoes';

export type FlagNavegacao =
  | 'fluxoCompleto'
  | 'revenda'
  | 'industria'
  | 'industriaProducao';

export interface ItemNavegacao {
  label: string;
  routeName: string;
  /** Permissão Visualizar necessária; omitido = sempre visível se o módulo estiver. */
  permissao?: string;
  flag?: FlagNavegacao;
}

export interface ModuloNavegacao {
  id: string;
  label: string;
  icon: string;
  /**
   * Prefixo(s) de path para detectar módulo ativo.
   * Prefixos mais específicos têm prioridade na resolução.
   */
  pathPrefixes: string[];
  /** Oculta o módulo inteiro (ex.: Produção só indústria). */
  flag?: FlagNavegacao;
  filhos: ItemNavegacao[];
}

export interface GrupoNavegacao {
  id: string;
  label: string;
  modulos: ModuloNavegacao[];
}

/** Dashboard fora dos grupos — igual ao legado. */
export const NAVEGACAO_DASHBOARD: ModuloNavegacao = {
  id: 'dashboard',
  label: 'Dashboard',
  icon: 'dashboard',
  pathPrefixes: ['/'],
  filhos: [{ label: 'Dashboard', routeName: 'dashboard' }],
};

/**
 * Estrutura 100% alinhada ao menu do legado (Sidebar.tsx):
 * Operacional → Produção → Financeiro → Relacionamento → Gestão → Base
 */
export const NAVEGACAO_GRUPOS: GrupoNavegacao[] = [
  {
    id: 'operacional',
    label: 'Operacional',
    modulos: [
      {
        id: 'vendas',
        label: 'Vendas e Pedidos',
        icon: 'shopping_cart',
        pathPrefixes: [
          '/pedidos-venda',
          '/orcamentos',
          '/pdv',
          '/metas-vendedor',
          '/representantes',
          '/regras-comissao',
          '/aprovacoes',
          '/devolucoes-venda',
        ],
        filhos: [
          {
            label: 'Pedidos',
            routeName: 'pedidos-venda',
            permissao: Permissoes.PedidosVenda.Visualizar,
          },
          {
            label: 'Orçamentos',
            routeName: 'orcamentos',
            permissao: Permissoes.Orcamentos.Visualizar,
          },
          {
            label: 'PDV',
            routeName: 'pdv-vender',
            permissao: Permissoes.Pdv.Visualizar,
          },
          {
            label: 'Aprovações',
            routeName: 'aprovacoes',
            permissao: Permissoes.Aprovacoes.Visualizar,
          },
          {
            label: 'Devoluções',
            routeName: 'devolucoes-venda',
            permissao: Permissoes.DevolucoesVenda.Visualizar,
          },
          {
            label: 'Comissões',
            routeName: 'regras-comissao',
            permissao: Permissoes.RegrasComissao.Visualizar,
          },
          {
            label: 'Metas',
            routeName: 'metas-vendedor',
            permissao: Permissoes.MetasVendedor.Visualizar,
          },
          {
            label: 'Representantes',
            routeName: 'representantes',
            permissao: Permissoes.Representantes.Visualizar,
          },
        ],
      },
      {
        id: 'estoque',
        label: 'Estoque',
        icon: 'inventory_2',
        pathPrefixes: ['/estoque'],
        filhos: [
          {
            label: 'Saldos',
            routeName: 'estoque-saldos',
            permissao: Permissoes.Estoque.Visualizar,
          },
          {
            label: 'Movimentações',
            routeName: 'estoque-movimentacoes',
            permissao: Permissoes.Estoque.Visualizar,
          },
          {
            label: 'Lotes',
            routeName: 'estoque-lotes',
            permissao: Permissoes.Estoque.Visualizar,
          },
          {
            label: 'Alertas',
            routeName: 'estoque-alertas',
            permissao: Permissoes.Estoque.Visualizar,
          },
          {
            label: 'Transferências',
            routeName: 'estoque-transferencias',
            permissao: Permissoes.Estoque.Visualizar,
          },
          {
            label: 'Inventários',
            routeName: 'estoque-inventarios',
            permissao: Permissoes.Estoque.Visualizar,
          },
          {
            label: 'Estoque inicial',
            routeName: 'estoque-inicial',
            permissao: Permissoes.Estoque.Visualizar,
          },
        ],
      },
      {
        id: 'compras',
        label: 'Compras e Fornecedores',
        icon: 'local_shipping',
        pathPrefixes: ['/compras', '/expedicao', '/fornecedores'],
        filhos: [
          {
            label: 'Recebimentos',
            routeName: 'recebimentos-compra',
            permissao: Permissoes.Compras.Visualizar,
          },
          {
            label: 'Histórico',
            routeName: 'historico-compras',
            permissao: Permissoes.Compras.Visualizar,
          },
          {
            label: 'Fornecedores',
            routeName: 'fornecedores',
          },
          {
            label: 'Solicitações',
            routeName: 'solicitacoes-compra',
            permissao: Permissoes.Compras.Visualizar,
            flag: 'fluxoCompleto',
          },
          {
            label: 'Cotações',
            routeName: 'cotacoes-compra',
            permissao: Permissoes.Compras.Visualizar,
            flag: 'fluxoCompleto',
          },
          {
            label: 'Contratos fornecimento',
            routeName: 'contratos-fornecimento',
            permissao: Permissoes.Compras.Visualizar,
            flag: 'fluxoCompleto',
          },
          {
            label: 'Pedidos compra',
            routeName: 'pedidos-compra',
            permissao: Permissoes.Compras.Visualizar,
            flag: 'fluxoCompleto',
          },
          {
            label: 'Aprovações',
            routeName: 'compras-aprovacoes',
            permissao: Permissoes.Compras.Visualizar,
            flag: 'fluxoCompleto',
          },
          {
            label: 'Alçadas / config',
            routeName: 'compras-alcadas',
            permissao: Permissoes.Compras.Visualizar,
            flag: 'fluxoCompleto',
          },
          {
            label: 'Expedição',
            routeName: 'expedicao',
            permissao: Permissoes.Expedicao.Visualizar,
          },
        ],
      },
      {
        id: 'logistica',
        label: 'Logística e Transporte',
        icon: 'local_shipping',
        pathPrefixes: ['/logistica'],
        filhos: [
          {
            label: 'Dashboard',
            routeName: 'logistica-dashboard',
            permissao: Permissoes.Logistica.Visualizar,
          },
          {
            label: 'Frota',
            routeName: 'logistica-veiculos',
            permissao: Permissoes.Logistica.Visualizar,
          },
          {
            label: 'Cargas',
            routeName: 'logistica-cargas',
            permissao: Permissoes.Logistica.Visualizar,
          },
          {
            label: 'Romaneios',
            routeName: 'logistica-romaneios',
            permissao: Permissoes.Logistica.Visualizar,
          },
          {
            label: 'Docs',
            routeName: 'logistica-docs-transporte',
            permissao: Permissoes.Logistica.Visualizar,
          },
          {
            label: 'Transportadoras',
            routeName: 'logistica-transportadoras',
            permissao: Permissoes.Logistica.Visualizar,
          },
          {
            label: 'Abastecimento',
            routeName: 'logistica-abastecimentos',
            permissao: Permissoes.Logistica.Visualizar,
          },
          {
            label: 'Custos',
            routeName: 'logistica-custos',
            permissao: Permissoes.Logistica.Visualizar,
          },
        ],
      },
    ],
  },
  {
    id: 'producao',
    label: 'Produção',
    modulos: [
      {
        id: 'producao-beneficiamento',
        label: 'Produção e Beneficiamento',
        icon: 'precision_manufacturing',
        flag: 'industriaProducao',
        pathPrefixes: ['/producao'],
        filhos: [
          {
            label: 'Ordens produção',
            routeName: 'ordens-producao',
            permissao: Permissoes.Producao.Visualizar,
            flag: 'industriaProducao',
          },
          {
            label: 'Receitas / BOM',
            routeName: 'receitas-producao',
            permissao: Permissoes.Producao.Visualizar,
            flag: 'industriaProducao',
          },
          {
            label: 'Beneficiamentos',
            routeName: 'beneficiamentos',
            permissao: Permissoes.Producao.Visualizar,
            flag: 'industriaProducao',
          },
          {
            label: 'Laudos qualidade',
            routeName: 'laudos',
            permissao: Permissoes.Producao.Visualizar,
            flag: 'industriaProducao',
          },
          {
            label: 'Fichas técnicas',
            routeName: 'fichas-tecnicas',
            permissao: Permissoes.Producao.Visualizar,
            flag: 'industriaProducao',
          },
          {
            label: 'Paradas de linha',
            routeName: 'paradas-linha',
            permissao: Permissoes.Producao.Visualizar,
            flag: 'industriaProducao',
          },
          {
            label: 'OEE',
            routeName: 'oee',
            permissao: Permissoes.Producao.Visualizar,
            flag: 'industriaProducao',
          },
        ],
      },
      {
        id: 'safras',
        label: 'Gestão de Safras',
        icon: 'agriculture',
        pathPrefixes: ['/safras', '/rastreabilidade'],
        filhos: [
          {
            label: 'Fazendas',
            routeName: 'safras-fazendas',
            permissao: Permissoes.Rastreabilidade.Visualizar,
          },
          {
            label: 'Glebas',
            routeName: 'safras-glebas',
            permissao: Permissoes.Rastreabilidade.Visualizar,
          },
          {
            label: 'Talhões',
            routeName: 'talhoes',
            permissao: Permissoes.Rastreabilidade.Visualizar,
          },
          {
            label: 'Aplicações',
            routeName: 'aplicacoes',
            permissao: Permissoes.Rastreabilidade.Visualizar,
          },
          {
            label: 'Diário de campo',
            routeName: 'safras-diario-campo',
            permissao: Permissoes.Rastreabilidade.Visualizar,
          },
          {
            label: 'Histórico aplicações',
            routeName: 'safras-historico-aplicacoes',
            permissao: Permissoes.Rastreabilidade.Visualizar,
          },
          {
            label: 'Histórico produtividade',
            routeName: 'safras-historico-produtividade',
            permissao: Permissoes.Rastreabilidade.Visualizar,
          },
          {
            label: 'Importação geo',
            routeName: 'safras-geo',
            permissao: Permissoes.Rastreabilidade.Visualizar,
          },
          {
            label: 'Visitas técnicas',
            routeName: 'safras-visitas-tecnicas',
            permissao: Permissoes.Rastreabilidade.Visualizar,
            flag: 'revenda',
          },
          {
            label: 'Recomendações',
            routeName: 'safras-recomendacoes',
            permissao: Permissoes.Rastreabilidade.Visualizar,
            flag: 'revenda',
          },
          {
            label: 'Planejamento de safras',
            routeName: 'safras-planejamento',
            permissao: Permissoes.Rastreabilidade.Visualizar,
            flag: 'industria',
          },
          {
            label: 'OS agrícola',
            routeName: 'safras-ordens-servico',
            permissao: Permissoes.Rastreabilidade.Visualizar,
            flag: 'industria',
          },
          {
            label: 'Custeio',
            routeName: 'safras-custeio',
            permissao: Permissoes.Rastreabilidade.Visualizar,
            flag: 'industria',
          },
          {
            label: 'OEE campo',
            routeName: 'safras-oee-campo',
            permissao: Permissoes.Rastreabilidade.Visualizar,
            flag: 'industria',
          },
        ],
      },
    ],
  },
  {
    id: 'financeiro-grupo',
    label: 'Financeiro',
    modulos: [
      {
        id: 'financeiro',
        label: 'Financeiro',
        icon: 'account_balance',
        pathPrefixes: ['/financeiro', '/formas-pagamento-config'],
        filhos: [
          {
            label: 'Contas a pagar',
            routeName: 'contas-pagar',
            permissao: Permissoes.Financeiro.Visualizar,
          },
          {
            label: 'Contas a receber',
            routeName: 'contas-receber',
            permissao: Permissoes.Financeiro.Visualizar,
          },
          {
            label: 'Fluxo de caixa',
            routeName: 'fluxo-caixa',
            permissao: Permissoes.Financeiro.Visualizar,
          },
          {
            label: 'Conciliação',
            routeName: 'conciliacao-bancaria',
            permissao: Permissoes.Financeiro.Visualizar,
          },
          {
            label: 'Tesouraria',
            routeName: 'tesouraria',
            permissao: Permissoes.Financeiro.Visualizar,
          },
          {
            label: 'Orçamento financeiro',
            routeName: 'orcamento-financeiro',
            permissao: Permissoes.Financeiro.Visualizar,
          },
          {
            label: 'Condições de pagamento',
            routeName: 'condicoes-pagamento',
            permissao: Permissoes.Financeiro.Visualizar,
          },
          {
            label: 'Formas de pagamento',
            routeName: 'formas-pagamento-config',
            permissao: Permissoes.FormasPagamentoConfig.Visualizar,
          },
          {
            label: 'Contas bancárias',
            routeName: 'contas-bancarias',
            permissao: Permissoes.Financeiro.Visualizar,
          },
          {
            label: 'Caixas',
            routeName: 'caixas',
            permissao: Permissoes.Financeiro.Visualizar,
          },
          {
            label: 'Centros de custo',
            routeName: 'centros-custo',
            permissao: Permissoes.Financeiro.Visualizar,
          },
          {
            label: 'Transferências',
            routeName: 'transferencias-financeiras',
            permissao: Permissoes.Financeiro.Visualizar,
          },
          {
            label: 'Cheques',
            routeName: 'cheques',
            permissao: Permissoes.Financeiro.Visualizar,
          },
          {
            label: 'Boletos',
            routeName: 'boletos',
            permissao: Permissoes.Financeiro.Visualizar,
          },
          {
            label: 'Antecipações',
            routeName: 'antecipacoes',
            permissao: Permissoes.Financeiro.Visualizar,
          },
          {
            label: 'Cotações / multi-moeda',
            routeName: 'cotacoes-moeda',
            permissao: Permissoes.Financeiro.Visualizar,
          },
        ],
      },
      {
        id: 'fiscal',
        label: 'Fiscal e Tributário',
        icon: 'receipt_long',
        pathPrefixes: ['/fiscal'],
        filhos: [
          {
            label: 'Notas fiscais',
            routeName: 'fiscal-notas-fiscais',
            permissao: Permissoes.Fiscal.Visualizar,
          },
          {
            label: 'Contingência',
            routeName: 'fiscal-contingencia',
            permissao: Permissoes.Fiscal.Visualizar,
          },
          {
            label: 'Inutilizações',
            routeName: 'fiscal-inutilizacoes',
            permissao: Permissoes.Fiscal.Visualizar,
          },
          {
            label: 'PIS/COFINS NCM',
            routeName: 'fiscal-ncm-pis-cofins',
            permissao: Permissoes.Fiscal.Visualizar,
          },
          {
            label: 'MVA NCM/UF',
            routeName: 'fiscal-mva-ncm-uf',
            permissao: Permissoes.Fiscal.Visualizar,
          },
          {
            label: 'GNRE',
            routeName: 'fiscal-gnre',
            permissao: Permissoes.Fiscal.Visualizar,
          },
          {
            label: 'Funrural',
            routeName: 'fiscal-funrural',
            permissao: Permissoes.Fiscal.Visualizar,
          },
          {
            label: 'Regimes por CNPJ',
            routeName: 'fiscal-regimes-cnpj',
            permissao: Permissoes.Fiscal.Visualizar,
          },
          {
            label: 'SPED',
            routeName: 'fiscal-sped',
            permissao: Permissoes.Fiscal.Visualizar,
          },
          {
            label: 'Configuração fiscal',
            routeName: 'fiscal-config',
            permissao: Permissoes.Fiscal.Visualizar,
          },
        ],
      },
      {
        id: 'cobranca',
        label: 'Cobrança e Crédito',
        icon: 'credit_card',
        pathPrefixes: [
          '/cobranca-credito',
          '/financeiro/regua-cobranca',
          '/financeiro/renegociacoes',
          '/crm/credito',
        ],
        filhos: [
          {
            label: 'Painel crédito',
            routeName: 'cobranca-credito',
            permissao: Permissoes.CobrancaCredito.Visualizar,
          },
          {
            label: 'Régua de cobrança',
            routeName: 'regua-cobranca',
            permissao: Permissoes.Financeiro.Visualizar,
          },
          {
            label: 'Renegociações',
            routeName: 'renegociacoes',
            permissao: Permissoes.Financeiro.Visualizar,
          },
          {
            label: 'CRM Crédito',
            routeName: 'crm-credito',
            permissao: Permissoes.Crm.Visualizar,
          },
        ],
      },
      {
        id: 'contratos',
        label: 'Contratos Agrícolas',
        icon: 'draw',
        pathPrefixes: ['/contratos'],
        filhos: [
          {
            label: 'Contratos',
            routeName: 'contratos',
            permissao: Permissoes.Contratos.Visualizar,
          },
        ],
      },
    ],
  },
  {
    id: 'relacionamento',
    label: 'Relacionamento',
    modulos: [
      {
        id: 'crm',
        label: 'CRM Agrícola',
        icon: 'support_agent',
        pathPrefixes: ['/crm'],
        filhos: [
          {
            label: 'Dashboard',
            routeName: 'crm-dashboard',
            permissao: Permissoes.Crm.Visualizar,
          },
          {
            label: 'Carteira',
            routeName: 'crm-carteira',
            permissao: Permissoes.Crm.Visualizar,
          },
          {
            label: 'Oportunidades',
            routeName: 'crm-oportunidades',
            permissao: Permissoes.Crm.Visualizar,
          },
          {
            label: 'Amostras',
            routeName: 'crm-amostras',
            permissao: Permissoes.Crm.Visualizar,
          },
          {
            label: 'Campanhas',
            routeName: 'crm-campanhas',
            permissao: Permissoes.Crm.Visualizar,
          },
        ],
      },
    ],
  },
  {
    id: 'gestao',
    label: 'Gestão',
    modulos: [
      {
        id: 'rh',
        label: 'RH e Folha',
        icon: 'groups',
        pathPrefixes: ['/colaboradores'],
        filhos: [
          {
            label: 'Colaboradores',
            routeName: 'colaboradores',
            permissao: Permissoes.Colaboradores.Visualizar,
          },
        ],
      },
      {
        id: 'manutencao',
        label: 'Manutenção e Ativos',
        icon: 'handyman',
        pathPrefixes: ['/manutencao'],
        filhos: [
          {
            label: 'Dashboard',
            routeName: 'manutencao-dashboard',
            permissao: Permissoes.Manutencao.Visualizar,
          },
          {
            label: 'Ativos',
            routeName: 'manutencao-ativos',
            permissao: Permissoes.Manutencao.Visualizar,
          },
          {
            label: 'Planos preventivos',
            routeName: 'manutencao-planos',
            permissao: Permissoes.Manutencao.Visualizar,
          },
          {
            label: 'Ordens de serviço',
            routeName: 'manutencao-ordens',
            permissao: Permissoes.Manutencao.Visualizar,
          },
          {
            label: 'Checklists',
            routeName: 'manutencao-checklists',
            permissao: Permissoes.Manutencao.Visualizar,
          },
          {
            label: 'Custos',
            routeName: 'manutencao-custos',
            permissao: Permissoes.Manutencao.Visualizar,
          },
        ],
      },
      {
        id: 'relatorios',
        label: 'BI e Relatórios',
        icon: 'analytics',
        pathPrefixes: ['/relatorios'],
        filhos: [
          {
            label: 'Relatórios',
            routeName: 'relatorios',
            permissao: Permissoes.Relatorios.Visualizar,
          },
        ],
      },
    ],
  },
  {
    id: 'base',
    label: 'Base',
    modulos: [
      {
        id: 'cadastros',
        label: 'Cadastros Gerais',
        icon: 'menu_book',
        pathPrefixes: [
          '/unidades',
          '/clientes',
          '/produtos',
          '/categorias-produto',
          '/unidades-medida',
          '/tabelas-preco',
        ],
        filhos: [
          { label: 'Unidades', routeName: 'unidades' },
          {
            label: 'Clientes',
            routeName: 'clientes',
            permissao: Permissoes.Clientes.Visualizar,
          },
          {
            label: 'Produtos',
            routeName: 'produtos',
            permissao: Permissoes.Produtos.Visualizar,
          },
          {
            label: 'Categorias',
            routeName: 'categorias-produto',
            permissao: Permissoes.CategoriasProduto.Visualizar,
          },
          {
            label: 'Unid. de medida',
            routeName: 'unidades-medida',
            permissao: Permissoes.UnidadesMedida.Visualizar,
          },
          {
            label: 'Tabelas de preço',
            routeName: 'tabelas-preco',
            permissao: Permissoes.TabelasPreco.Visualizar,
          },
        ],
      },
      {
        id: 'configuracoes',
        label: 'Configurações',
        icon: 'settings',
        pathPrefixes: ['/usuarios', '/auditoria'],
        filhos: [
          {
            label: 'Usuários',
            routeName: 'usuarios',
            permissao: Permissoes.Usuarios.Visualizar,
          },
          {
            label: 'Auditoria',
            routeName: 'auditoria',
            permissao: Permissoes.Auditoria.Visualizar,
          },
        ],
      },
    ],
  },
];

/** Lista plana de todos os módulos (dashboard + grupos) para resolução de rota. */
export const NAVEGACAO_MODULOS: ModuloNavegacao[] = [
  NAVEGACAO_DASHBOARD,
  ...NAVEGACAO_GRUPOS.flatMap((grupo) => grupo.modulos),
];
