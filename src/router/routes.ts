import type { RouteRecordRaw } from 'vue-router';

import { Permissoes } from 'constants/permissoes';

export const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('layouts/AuthLayout.vue'),
    meta: { publica: true, convidado: true, layout: 'auth' },
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('pages/auth/LoginPage.vue'),
      },
    ],
  },
  {
    path: '/cadastro',
    component: () => import('layouts/AuthLayout.vue'),
    meta: { publica: true, convidado: true, layout: 'auth' },
    children: [
      {
        path: '',
        name: 'cadastro',
        component: () => import('pages/auth/RegisterPage.vue'),
      },
    ],
  },
  {
    path: '/confirm-email',
    component: () => import('layouts/AuthLayout.vue'),
    meta: { publica: true, layout: 'auth' },
    children: [
      {
        path: '',
        name: 'confirm-email',
        component: () => import('pages/auth/ConfirmEmailPage.vue'),
      },
    ],
  },
  {
    path: '/selecionar-unidade',
    component: () => import('layouts/AuthLayout.vue'),
    meta: { requerAuth: true, selecaoUnidade: true, layout: 'auth' },
    children: [
      {
        path: '',
        name: 'selecionar-unidade',
        component: () => import('pages/auth/SelecionarUnidadePage.vue'),
      },
    ],
  },
  {
    path: '/onboarding',
    component: () => import('layouts/OnboardingLayout.vue'),
    meta: { requerAuth: true, onboarding: true, layout: 'onboarding' },
    children: [
      {
        path: '',
        name: 'onboarding',
        component: () => import('pages/onboarding/OnboardingPage.vue'),
      },
    ],
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { layout: 'main', requerEmpresa: true, requerUnidade: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('pages/dashboard/DashboardPage.vue'),
        meta: {
          breadcrumb: 'navegacao.dashboard',
          permissao: Permissoes.Dashboard.Visualizar,
        },
      },
      {
        path: 'notificacoes',
        name: 'notificacoes',
        component: () => import('pages/notificacoes/NotificacoesPage.vue'),
        meta: {
          breadcrumb: 'navegacao.notificacoes',
          permissao: Permissoes.Notificacoes.Visualizar,
        },
      },
      {
        path: 'unidades',
        name: 'unidades',
        component: () => import('pages/unidades/UnidadesListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.unidades',
          permissao: Permissoes.Unidades.Visualizar,
        },
      },
      {
        path: 'unidades/nova',
        name: 'unidade-nova',
        component: () => import('pages/unidades/UnidadeFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.unidadeNova',
          breadcrumbPais: ['navegacao.unidades'],
          permissao: Permissoes.Unidades.Visualizar,
        },
      },
      {
        path: 'unidades/:id/editar',
        name: 'unidade-editar',
        component: () => import('pages/unidades/UnidadeFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.unidadeEditar',
          breadcrumbPais: ['navegacao.unidades'],
          permissao: Permissoes.Unidades.Visualizar,
        },
      },
      {
        path: 'unidades/:id',
        name: 'unidade-visualizar',
        component: () => import('pages/unidades/UnidadeFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.unidadeVisualizar',
          breadcrumbPais: ['navegacao.unidades'],
          permissao: Permissoes.Unidades.Visualizar,
        },
      },
      {
        path: 'cnpjs',
        name: 'cnpjs',
        component: () => import('pages/cnpjs/CnpjsListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.empresa',
          permissao: Permissoes.Cnpjs.Visualizar,
        },
      },
      {
        path: 'cnpjs/novo',
        name: 'cnpj-novo',
        component: () => import('pages/cnpjs/CnpjFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.cnpjNovo',
          breadcrumbPais: ['navegacao.empresa'],
          permissao: Permissoes.Cnpjs.Visualizar,
        },
      },
      {
        path: 'cnpjs/:id/editar',
        name: 'cnpj-editar',
        component: () => import('pages/cnpjs/CnpjFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.cnpjEditar',
          breadcrumbPais: ['navegacao.empresa'],
          permissao: Permissoes.Cnpjs.Visualizar,
        },
      },
      {
        path: 'cnpjs/:id',
        name: 'cnpj-visualizar',
        component: () => import('pages/cnpjs/CnpjFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.cnpjVisualizar',
          breadcrumbPais: ['navegacao.empresa'],
          permissao: Permissoes.Cnpjs.Visualizar,
        },
      },
      {
        path: 'fornecedores',
        name: 'fornecedores',
        component: () => import('pages/fornecedores/FornecedoresListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.fornecedores',
          permissao: Permissoes.Fornecedores.Visualizar,
        },
      },
      {
        path: 'fornecedores/novo',
        name: 'fornecedor-novo',
        component: () => import('pages/fornecedores/FornecedorFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.fornecedorNovo',
          breadcrumbPais: ['navegacao.fornecedores'],
          permissao: Permissoes.Fornecedores.Visualizar,
        },
      },
      {
        path: 'fornecedores/:id/editar',
        name: 'fornecedor-editar',
        component: () => import('pages/fornecedores/FornecedorFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.fornecedorEditar',
          breadcrumbPais: ['navegacao.fornecedores'],
          permissao: Permissoes.Fornecedores.Visualizar,
        },
      },
      {
        path: 'fornecedores/:id',
        name: 'fornecedor-visualizar',
        component: () => import('pages/fornecedores/FornecedorFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.fornecedorVisualizar',
          breadcrumbPais: ['navegacao.fornecedores'],
          permissao: Permissoes.Fornecedores.Visualizar,
        },
      },
      {
        path: 'clientes',
        name: 'clientes',
        component: () => import('pages/clientes/ClientesListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.clientes',
          permissao: Permissoes.Clientes.Visualizar,
        },
      },
      {
        path: 'clientes/novo',
        name: 'cliente-novo',
        component: () => import('pages/clientes/ClienteFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.clienteNovo',
          breadcrumbPais: ['navegacao.clientes'],
          permissao: Permissoes.Clientes.Visualizar,
        },
      },
      {
        path: 'clientes/:id/editar',
        name: 'cliente-editar',
        component: () => import('pages/clientes/ClienteFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.clienteEditar',
          breadcrumbPais: ['navegacao.clientes'],
          permissao: Permissoes.Clientes.Visualizar,
        },
      },
      {
        path: 'clientes/:id',
        name: 'cliente-visualizar',
        component: () => import('pages/clientes/ClienteFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.clienteVisualizar',
          breadcrumbPais: ['navegacao.clientes'],
          permissao: Permissoes.Clientes.Visualizar,
        },
      },
      {
        path: 'produtos',
        name: 'produtos',
        component: () => import('pages/produtos/ProdutosListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.produtos',
          permissao: Permissoes.Produtos.Visualizar,
        },
      },
      {
        path: 'produtos/novo',
        name: 'produto-novo',
        component: () => import('pages/produtos/ProdutoFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.produtoNovo',
          breadcrumbPais: ['navegacao.produtos'],
          permissao: Permissoes.Produtos.Visualizar,
        },
      },
      {
        path: 'produtos/:id/editar',
        name: 'produto-editar',
        component: () => import('pages/produtos/ProdutoFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.produtoEditar',
          breadcrumbPais: ['navegacao.produtos'],
          permissao: Permissoes.Produtos.Visualizar,
        },
      },
      {
        path: 'produtos/:id',
        name: 'produto-visualizar',
        component: () => import('pages/produtos/ProdutoFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.produtoVisualizar',
          breadcrumbPais: ['navegacao.produtos'],
          permissao: Permissoes.Produtos.Visualizar,
        },
      },
      {
        path: 'categorias-produto',
        name: 'categorias-produto',
        component: () => import('pages/categorias-produto/CategoriasProdutoListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.categoriasProduto',
          permissao: Permissoes.CategoriasProduto.Visualizar,
        },
      },
      {
        path: 'unidades-medida',
        name: 'unidades-medida',
        component: () => import('pages/unidades-medida/UnidadesMedidaListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.unidadesMedida',
          permissao: Permissoes.UnidadesMedida.Visualizar,
        },
      },
      {
        path: 'tabelas-preco',
        name: 'tabelas-preco',
        component: () => import('pages/tabelas-preco/TabelasPrecoListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.tabelasPreco',
          permissao: Permissoes.TabelasPreco.Visualizar,
        },
      },
      {
        path: 'tabelas-preco/novo',
        name: 'tabela-preco-novo',
        component: () => import('pages/tabelas-preco/TabelaPrecoFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.tabelaPrecoNovo',
          breadcrumbPais: ['navegacao.tabelasPreco'],
          permissao: Permissoes.TabelasPreco.Visualizar,
        },
      },
      {
        path: 'tabelas-preco/:id/editar',
        name: 'tabela-preco-editar',
        component: () => import('pages/tabelas-preco/TabelaPrecoFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.tabelaPrecoEditar',
          breadcrumbPais: ['navegacao.tabelasPreco'],
          permissao: Permissoes.TabelasPreco.Visualizar,
        },
      },
      {
        path: 'tabelas-preco/:id',
        name: 'tabela-preco-visualizar',
        component: () => import('pages/tabelas-preco/TabelaPrecoFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.tabelaPrecoVisualizar',
          breadcrumbPais: ['navegacao.tabelasPreco'],
          permissao: Permissoes.TabelasPreco.Visualizar,
        },
      },
      {
        path: 'estoque/saldos',
        name: 'estoque-saldos',
        component: () => import('pages/estoque/SaldosListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.estoqueSaldos',
          permissao: Permissoes.Estoque.Visualizar,
        },
      },
      {
        path: 'estoque/lotes',
        name: 'estoque-lotes',
        component: () => import('pages/estoque/LotesListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.estoqueLotes',
          permissao: Permissoes.Estoque.Visualizar,
        },
      },
      {
        path: 'estoque/movimentacoes',
        name: 'estoque-movimentacoes',
        component: () => import('pages/estoque/MovimentacoesListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.estoqueMovimentacoes',
          permissao: Permissoes.Estoque.Visualizar,
        },
      },
      {
        path: 'estoque/inicial',
        name: 'estoque-inicial',
        component: () => import('pages/estoque/EstoqueInicialPage.vue'),
        meta: {
          breadcrumb: 'navegacao.estoqueInicial',
          permissao: Permissoes.Estoque.Visualizar,
        },
      },
      {
        path: 'estoque/inventarios',
        name: 'estoque-inventarios',
        component: () => import('pages/estoque/InventariosListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.estoqueInventarios',
          permissao: Permissoes.Estoque.Visualizar,
        },
      },
      {
        path: 'estoque/inventarios/:id',
        name: 'estoque-inventario-detalhe',
        component: () => import('pages/estoque/InventarioDetalhePage.vue'),
        meta: {
          breadcrumb: 'navegacao.estoqueInventarioDetalhe',
          breadcrumbPais: ['navegacao.estoqueInventarios'],
          permissao: Permissoes.Estoque.Visualizar,
        },
      },
      {
        path: 'estoque/alertas',
        name: 'estoque-alertas',
        component: () => import('pages/estoque/AlertasEstoquePage.vue'),
        meta: {
          breadcrumb: 'navegacao.estoqueAlertas',
          permissao: Permissoes.Estoque.Visualizar,
        },
      },
      {
        path: 'estoque/transferencias',
        name: 'estoque-transferencias',
        component: () => import('pages/estoque/TransferenciasListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.estoqueTransferencias',
          permissao: Permissoes.Estoque.Visualizar,
        },
      },
      {
        path: 'estoque/transferencias/nova',
        name: 'estoque-transferencia-nova',
        component: () => import('pages/estoque/TransferenciaFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.estoqueTransferenciaNova',
          breadcrumbPais: ['navegacao.estoqueTransferencias'],
          permissao: Permissoes.Estoque.Visualizar,
        },
      },
      {
        path: 'estoque/transferencias/:id',
        name: 'estoque-transferencia-detalhe',
        component: () => import('pages/estoque/TransferenciaDetalhePage.vue'),
        meta: {
          breadcrumb: 'navegacao.estoqueTransferenciaDetalhe',
          breadcrumbPais: ['navegacao.estoqueTransferencias'],
          permissao: Permissoes.Estoque.Visualizar,
        },
      },
      {
        path: 'pedidos-venda',
        name: 'pedidos-venda',
        component: () => import('pages/pedidos-venda/PedidosVendaListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.pedidosVenda',
          permissao: Permissoes.PedidosVenda.Visualizar,
        },
      },
      {
        path: 'pedidos-venda/novo',
        name: 'pedido-venda-novo',
        component: () => import('pages/pedidos-venda/PedidoVendaFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.pedidoVendaNovo',
          breadcrumbPais: ['navegacao.pedidosVenda'],
          permissao: Permissoes.PedidosVenda.Visualizar,
        },
      },
      {
        path: 'pedidos-venda/:id/editar',
        name: 'pedido-venda-editar',
        component: () => import('pages/pedidos-venda/PedidoVendaFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.pedidoVendaEditar',
          breadcrumbPais: ['navegacao.pedidosVenda'],
          permissao: Permissoes.PedidosVenda.Visualizar,
        },
      },
      {
        path: 'pedidos-venda/:id',
        name: 'pedido-venda-detalhe',
        component: () => import('pages/pedidos-venda/PedidoVendaDetalhePage.vue'),
        meta: {
          breadcrumb: 'navegacao.pedidoVendaDetalhe',
          breadcrumbPais: ['navegacao.pedidosVenda'],
          permissao: Permissoes.PedidosVenda.Visualizar,
        },
      },
      {
        path: 'aprovacoes',
        name: 'aprovacoes',
        component: () => import('pages/aprovacoes/AprovacoesListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.aprovacoes',
          permissao: Permissoes.Aprovacoes.Visualizar,
        },
      },
      {
        path: 'formas-pagamento-config',
        name: 'formas-pagamento-config',
        component: () => import('pages/financeiro/FormasPagamentoConfigListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.formasPagamentoConfig',
          permissao: Permissoes.FormasPagamentoConfig.Visualizar,
        },
      },
      {
        path: 'formas-pagamento-config/novo',
        name: 'forma-pagamento-config-nova',
        component: () => import('pages/financeiro/FormaPagamentoConfigFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.formaPagamentoConfigNova',
          breadcrumbPais: ['navegacao.formasPagamentoConfig'],
          permissao: Permissoes.FormasPagamentoConfig.Editar,
        },
      },
      {
        path: 'formas-pagamento-config/:id/editar',
        name: 'forma-pagamento-config-editar',
        component: () => import('pages/financeiro/FormaPagamentoConfigFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.formaPagamentoConfigEditar',
          breadcrumbPais: ['navegacao.formasPagamentoConfig'],
          permissao: Permissoes.FormasPagamentoConfig.Editar,
        },
      },
      {
        path: 'formas-pagamento-config/:id',
        name: 'forma-pagamento-config-visualizar',
        component: () => import('pages/financeiro/FormaPagamentoConfigFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.formaPagamentoConfigVisualizar',
          breadcrumbPais: ['navegacao.formasPagamentoConfig'],
          permissao: Permissoes.FormasPagamentoConfig.Visualizar,
        },
      },
      {
        path: 'financeiro/contas-receber',
        name: 'contas-receber',
        component: () => import('pages/financeiro/ContasReceberListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.contasReceber',
          permissao: Permissoes.Financeiro.Visualizar,
        },
      },
      {
        path: 'financeiro/contas-pagar',
        name: 'contas-pagar',
        component: () => import('pages/financeiro/ContasPagarListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.contasPagar',
          permissao: Permissoes.Financeiro.Visualizar,
        },
      },
      {
        path: 'financeiro/condicoes-pagamento',
        name: 'condicoes-pagamento',
        component: () => import('pages/financeiro/CondicoesPagamentoListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.condicoesPagamento',
          permissao: Permissoes.Financeiro.Visualizar,
        },
      },
      {
        path: 'financeiro/contas-bancarias',
        name: 'contas-bancarias',
        component: () => import('pages/financeiro/ContasBancariasListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.contasBancarias',
          permissao: Permissoes.Financeiro.Visualizar,
        },
      },
      {
        path: 'financeiro/caixas',
        name: 'caixas',
        component: () => import('pages/financeiro/CaixasListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.caixas',
          permissao: Permissoes.Financeiro.Visualizar,
        },
      },
      {
        path: 'financeiro/centros-custo',
        name: 'centros-custo',
        component: () => import('pages/financeiro/CentrosCustoListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.centrosCusto',
          permissao: Permissoes.Financeiro.Visualizar,
        },
      },
      {
        path: 'financeiro/transferencias',
        name: 'transferencias-financeiras',
        component: () => import('pages/financeiro/TransferenciasListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.transferenciasFinanceiras',
          permissao: Permissoes.Financeiro.Visualizar,
        },
      },
      {
        path: 'financeiro/cheques',
        name: 'cheques',
        component: () => import('pages/financeiro/ChequesListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.cheques',
          permissao: Permissoes.Financeiro.Visualizar,
        },
      },
      {
        path: 'financeiro/fluxo-caixa',
        name: 'fluxo-caixa',
        component: () => import('pages/financeiro/FluxoCaixaPage.vue'),
        meta: {
          breadcrumb: 'navegacao.fluxoCaixa',
          permissao: Permissoes.Financeiro.Visualizar,
        },
      },
      {
        path: 'financeiro/tesouraria',
        name: 'tesouraria',
        component: () => import('pages/financeiro/TesourariaPage.vue'),
        meta: {
          breadcrumb: 'navegacao.tesouraria',
          permissao: Permissoes.Financeiro.Visualizar,
        },
      },
      {
        path: 'financeiro/conciliacao-bancaria',
        name: 'conciliacao-bancaria',
        component: () => import('pages/financeiro/ConciliacaoBancariaPage.vue'),
        meta: {
          breadcrumb: 'navegacao.conciliacaoBancaria',
          permissao: Permissoes.Financeiro.Visualizar,
        },
      },
      {
        path: 'financeiro/boletos',
        name: 'boletos',
        component: () => import('pages/financeiro/BoletosListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.boletos',
          permissao: Permissoes.Financeiro.Visualizar,
        },
      },
      {
        path: 'financeiro/regua-cobranca',
        name: 'regua-cobranca',
        component: () => import('pages/financeiro/ReguaCobrancaPage.vue'),
        meta: {
          breadcrumb: 'navegacao.reguaCobranca',
          permissao: Permissoes.Financeiro.Visualizar,
        },
      },
      {
        path: 'financeiro/renegociacoes',
        name: 'renegociacoes',
        component: () => import('pages/financeiro/RenegociacoesListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.renegociacoes',
          permissao: Permissoes.Financeiro.Visualizar,
        },
      },
      {
        path: 'financeiro/antecipacoes',
        name: 'antecipacoes',
        component: () => import('pages/financeiro/AntecipacoesPage.vue'),
        meta: {
          breadcrumb: 'navegacao.antecipacoes',
          permissao: Permissoes.Financeiro.Visualizar,
        },
      },
      {
        path: 'financeiro/orcamento',
        name: 'orcamento-financeiro',
        component: () => import('pages/financeiro/OrcamentoFinanceiroPage.vue'),
        meta: {
          breadcrumb: 'navegacao.orcamentoFinanceiro',
          permissao: Permissoes.Financeiro.Visualizar,
        },
      },
      {
        path: 'financeiro/cotacoes-moeda',
        name: 'cotacoes-moeda',
        component: () => import('pages/financeiro/CotacoesMoedaPage.vue'),
        meta: {
          breadcrumb: 'navegacao.cotacoesMoeda',
          permissao: Permissoes.Financeiro.Visualizar,
        },
      },
      {
        path: 'orcamentos',
        name: 'orcamentos',
        component: () => import('pages/orcamentos/OrcamentosListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.orcamentos',
          permissao: Permissoes.Orcamentos.Visualizar,
        },
      },
      {
        path: 'orcamentos/novo',
        name: 'orcamento-novo',
        component: () => import('pages/orcamentos/OrcamentoFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.orcamentoNovo',
          breadcrumbPais: ['navegacao.orcamentos'],
          permissao: Permissoes.Orcamentos.Visualizar,
        },
      },
      {
        path: 'orcamentos/:id/editar',
        name: 'orcamento-editar',
        component: () => import('pages/orcamentos/OrcamentoFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.orcamentoEditar',
          breadcrumbPais: ['navegacao.orcamentos'],
          permissao: Permissoes.Orcamentos.Visualizar,
        },
      },
      {
        path: 'orcamentos/:id',
        name: 'orcamento-detalhe',
        component: () => import('pages/orcamentos/OrcamentoDetalhePage.vue'),
        meta: {
          breadcrumb: 'navegacao.orcamentoDetalhe',
          breadcrumbPais: ['navegacao.orcamentos'],
          permissao: Permissoes.Orcamentos.Visualizar,
        },
      },
      {
        path: 'pdv',
        name: 'pdv-vender',
        component: () => import('pages/pdv/PdvVenderPage.vue'),
        meta: {
          breadcrumb: 'navegacao.pdv',
          permissao: Permissoes.Pdv.Visualizar,
        },
      },
      {
        path: 'pdv/vendas',
        name: 'pdv-vendas',
        component: () => import('pages/pdv/PdvVendasListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.pdvVendas',
          breadcrumbPais: ['navegacao.pdv'],
          permissao: Permissoes.Pdv.Visualizar,
        },
      },
      {
        path: 'pdv/vendas/:id',
        name: 'pdv-venda-detalhe',
        component: () => import('pages/pdv/PdvVendaDetalhePage.vue'),
        meta: {
          breadcrumb: 'navegacao.pdvVendaDetalhe',
          breadcrumbPais: ['navegacao.pdvVendas'],
          permissao: Permissoes.Pdv.Visualizar,
        },
      },
      {
        path: 'compras/solicitacoes',
        name: 'solicitacoes-compra',
        component: () => import('pages/compras/SolicitacoesCompraListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.solicitacoesCompra',
          permissao: Permissoes.Compras.Visualizar,
        },
      },
      {
        path: 'compras/solicitacoes/nova',
        name: 'solicitacao-compra-nova',
        component: () => import('pages/compras/SolicitacaoCompraFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.solicitacaoCompraNova',
          breadcrumbPais: ['navegacao.solicitacoesCompra'],
          permissao: Permissoes.Compras.Visualizar,
        },
      },
      {
        path: 'compras/solicitacoes/:id',
        name: 'solicitacao-compra-detalhe',
        component: () => import('pages/compras/SolicitacaoCompraDetalhePage.vue'),
        meta: {
          breadcrumb: 'navegacao.solicitacaoCompraDetalhe',
          breadcrumbPais: ['navegacao.solicitacoesCompra'],
          permissao: Permissoes.Compras.Visualizar,
        },
      },
      {
        path: 'compras/cotacoes',
        name: 'cotacoes-compra',
        component: () => import('pages/compras/CotacoesCompraListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.cotacoesCompra',
          permissao: Permissoes.Compras.Visualizar,
        },
      },
      {
        path: 'compras/cotacoes/nova',
        name: 'cotacao-compra-nova',
        component: () => import('pages/compras/CotacaoCompraFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.cotacaoCompraNova',
          breadcrumbPais: ['navegacao.cotacoesCompra'],
          permissao: Permissoes.Compras.Visualizar,
        },
      },
      {
        path: 'compras/cotacoes/:id',
        name: 'cotacao-compra-detalhe',
        component: () => import('pages/compras/CotacaoCompraDetalhePage.vue'),
        meta: {
          breadcrumb: 'navegacao.cotacaoCompraDetalhe',
          breadcrumbPais: ['navegacao.cotacoesCompra'],
          permissao: Permissoes.Compras.Visualizar,
        },
      },
      {
        path: 'compras/contratos-fornecimento',
        name: 'contratos-fornecimento',
        component: () => import('pages/compras/ContratosFornecimentoListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.contratosFornecimento',
          permissao: Permissoes.Compras.Visualizar,
        },
      },
      {
        path: 'compras/contratos-fornecimento/novo',
        name: 'contrato-fornecimento-novo',
        component: () => import('pages/compras/ContratoFornecimentoFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.contratoFornecimentoNovo',
          breadcrumbPais: ['navegacao.contratosFornecimento'],
          permissao: Permissoes.Compras.Visualizar,
        },
      },
      {
        path: 'compras/contratos-fornecimento/:id/editar',
        name: 'contrato-fornecimento-editar',
        component: () => import('pages/compras/ContratoFornecimentoFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.contratoFornecimentoEditar',
          breadcrumbPais: ['navegacao.contratosFornecimento'],
          permissao: Permissoes.Compras.Visualizar,
        },
      },
      {
        path: 'compras/contratos-fornecimento/:id',
        name: 'contrato-fornecimento-visualizar',
        component: () => import('pages/compras/ContratoFornecimentoFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.contratoFornecimentoVisualizar',
          breadcrumbPais: ['navegacao.contratosFornecimento'],
          permissao: Permissoes.Compras.Visualizar,
        },
      },
      {
        path: 'compras/pedidos',
        name: 'pedidos-compra',
        component: () => import('pages/compras/PedidosCompraListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.pedidosCompra',
          permissao: Permissoes.Compras.Visualizar,
        },
      },
      {
        path: 'compras/pedidos/novo',
        name: 'pedido-compra-novo',
        component: () => import('pages/compras/PedidoCompraFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.pedidoCompraNovo',
          breadcrumbPais: ['navegacao.pedidosCompra'],
          permissao: Permissoes.Compras.Visualizar,
        },
      },
      {
        path: 'compras/pedidos/:id',
        name: 'pedido-compra-detalhe',
        component: () => import('pages/compras/PedidoCompraDetalhePage.vue'),
        meta: {
          breadcrumb: 'navegacao.pedidoCompraDetalhe',
          breadcrumbPais: ['navegacao.pedidosCompra'],
          permissao: Permissoes.Compras.Visualizar,
        },
      },
      {
        path: 'compras/recebimentos',
        name: 'recebimentos-compra',
        component: () => import('pages/compras/RecebimentosCompraListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.recebimentosCompra',
          permissao: Permissoes.Compras.Visualizar,
        },
      },
      {
        path: 'compras/recebimentos/novo',
        name: 'recebimento-compra-novo',
        component: () => import('pages/compras/RecebimentoCompraFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.recebimentoCompraNovo',
          breadcrumbPais: ['navegacao.recebimentosCompra'],
          permissao: Permissoes.Compras.Visualizar,
        },
      },
      {
        path: 'compras/recebimentos/:id',
        name: 'recebimento-compra-detalhe',
        component: () => import('pages/compras/RecebimentoCompraDetalhePage.vue'),
        meta: {
          breadcrumb: 'navegacao.recebimentoCompraDetalhe',
          breadcrumbPais: ['navegacao.recebimentosCompra'],
          permissao: Permissoes.Compras.Visualizar,
        },
      },
      {
        path: 'compras/historico',
        name: 'historico-compras',
        component: () => import('pages/compras/HistoricoComprasPage.vue'),
        meta: {
          breadcrumb: 'navegacao.historicoCompras',
          permissao: Permissoes.Compras.Visualizar,
        },
      },
      {
        path: 'compras/aprovacoes',
        name: 'compras-aprovacoes',
        component: () => import('pages/compras/ComprasAprovacoesPage.vue'),
        meta: {
          breadcrumb: 'navegacao.comprasAprovacoes',
          permissao: Permissoes.Compras.Visualizar,
        },
      },
      {
        path: 'compras/alcadas',
        name: 'compras-alcadas',
        component: () => import('pages/compras/ComprasAlcadasPage.vue'),
        meta: {
          breadcrumb: 'navegacao.comprasAlcadas',
          permissao: Permissoes.Compras.Visualizar,
        },
      },
      {
        path: 'compras/contas-pagar',
        redirect: { name: 'contas-pagar' },
      },
      {
        path: 'devolucoes-venda',
        name: 'devolucoes-venda',
        component: () => import('pages/devolucoes-venda/DevolucoesVendaListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.devolucoesVenda',
          permissao: Permissoes.DevolucoesVenda.Visualizar,
        },
      },
      {
        path: 'devolucoes-venda/nova',
        name: 'devolucao-venda-nova',
        component: () => import('pages/devolucoes-venda/DevolucaoVendaFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.devolucaoVendaNova',
          breadcrumbPais: ['navegacao.devolucoesVenda'],
          permissao: Permissoes.DevolucoesVenda.Visualizar,
        },
      },
      {
        path: 'devolucoes-venda/:id',
        name: 'devolucao-venda-detalhe',
        component: () => import('pages/devolucoes-venda/DevolucaoVendaDetalhePage.vue'),
        meta: {
          breadcrumb: 'navegacao.devolucaoVendaDetalhe',
          breadcrumbPais: ['navegacao.devolucoesVenda'],
          permissao: Permissoes.DevolucoesVenda.Visualizar,
        },
      },
      {
        path: 'expedicao',
        name: 'expedicao',
        component: () => import('pages/expedicao/ExpedicaoListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.expedicao',
          permissao: Permissoes.Expedicao.Visualizar,
        },
      },
      {
        path: 'expedicao/:pedidoId/romaneio',
        name: 'expedicao-romaneio',
        component: () => import('pages/expedicao/ExpedicaoRomaneioPage.vue'),
        meta: {
          breadcrumb: 'navegacao.expedicaoRomaneio',
          breadcrumbPais: ['navegacao.expedicao'],
          permissao: Permissoes.Expedicao.Visualizar,
        },
      },
      {
        path: 'fiscal',
        name: 'fiscal-config',
        component: () => import('pages/fiscal/FiscalConfigPage.vue'),
        meta: {
          breadcrumb: 'navegacao.fiscal',
          permissao: Permissoes.Fiscal.Visualizar,
        },
      },
      {
        path: 'fiscal/notas-fiscais',
        name: 'fiscal-notas-fiscais',
        component: () => import('pages/fiscal/NotasFiscaisListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.notasFiscais',
          breadcrumbPais: ['navegacao.fiscal'],
          permissao: Permissoes.Fiscal.Visualizar,
        },
      },
      {
        path: 'fiscal/contingencia',
        name: 'fiscal-contingencia',
        component: () => import('pages/fiscal/ContingenciaFiscalPage.vue'),
        meta: {
          breadcrumb: 'navegacao.contingenciaFiscal',
          breadcrumbPais: ['navegacao.fiscal'],
          permissao: Permissoes.Fiscal.Visualizar,
        },
      },
      {
        path: 'fiscal/inutilizacoes',
        name: 'fiscal-inutilizacoes',
        component: () => import('pages/fiscal/InutilizacoesListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.inutilizacoesFiscais',
          breadcrumbPais: ['navegacao.fiscal'],
          permissao: Permissoes.Fiscal.Visualizar,
        },
      },
      {
        path: 'fiscal/ncm-pis-cofins',
        name: 'fiscal-ncm-pis-cofins',
        component: () => import('pages/fiscal/NcmPisCofinsListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.ncmPisCofins',
          breadcrumbPais: ['navegacao.fiscal'],
          permissao: Permissoes.Fiscal.Visualizar,
        },
      },
      {
        path: 'fiscal/mva-ncm-uf',
        name: 'fiscal-mva-ncm-uf',
        component: () => import('pages/fiscal/MvaNcmUfListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.mvaNcmUf',
          breadcrumbPais: ['navegacao.fiscal'],
          permissao: Permissoes.Fiscal.Visualizar,
        },
      },
      {
        path: 'fiscal/gnre',
        name: 'fiscal-gnre',
        component: () => import('pages/fiscal/GnreListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.gnre',
          breadcrumbPais: ['navegacao.fiscal'],
          permissao: Permissoes.Fiscal.Visualizar,
        },
      },
      {
        path: 'fiscal/funrural',
        name: 'fiscal-funrural',
        component: () => import('pages/fiscal/FunruralPage.vue'),
        meta: {
          breadcrumb: 'navegacao.funrural',
          breadcrumbPais: ['navegacao.fiscal'],
          permissao: Permissoes.Fiscal.Visualizar,
        },
      },
      {
        path: 'fiscal/regimes-cnpj',
        name: 'fiscal-regimes-cnpj',
        component: () => import('pages/fiscal/RegimesCnpjListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.regimesCnpj',
          breadcrumbPais: ['navegacao.fiscal'],
          permissao: Permissoes.Fiscal.Visualizar,
        },
      },
      {
        path: 'fiscal/sped',
        name: 'fiscal-sped',
        component: () => import('pages/fiscal/SpedFiscalPage.vue'),
        meta: {
          breadcrumb: 'navegacao.spedFiscal',
          breadcrumbPais: ['navegacao.fiscal'],
          permissao: Permissoes.Fiscal.Visualizar,
        },
      },
      {
        path: 'fiscal/calculo-impostos',
        name: 'fiscal-calculo-impostos',
        component: () => import('pages/fiscal/CalculoImpostosPage.vue'),
        meta: {
          breadcrumb: 'navegacao.calculoImpostos',
          breadcrumbPais: ['navegacao.fiscal'],
          permissao: Permissoes.Fiscal.Visualizar,
        },
      },
      {
        path: 'contratos',
        name: 'contratos',
        component: () => import('pages/contratos/ContratosListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.contratos',
          permissao: Permissoes.Contratos.Visualizar,
        },
      },
      {
        path: 'contratos/novo',
        name: 'contrato-novo',
        component: () => import('pages/contratos/ContratoFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.contratoNovo',
          breadcrumbPais: ['navegacao.contratos'],
          permissao: Permissoes.Contratos.Visualizar,
        },
      },
      {
        path: 'contratos/:id/editar',
        name: 'contrato-editar',
        component: () => import('pages/contratos/ContratoFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.contratoEditar',
          breadcrumbPais: ['navegacao.contratos'],
          permissao: Permissoes.Contratos.Visualizar,
        },
      },
      {
        path: 'contratos/:id',
        name: 'contrato-detalhe',
        component: () => import('pages/contratos/ContratoDetalhePage.vue'),
        meta: {
          breadcrumb: 'navegacao.contratoDetalhe',
          breadcrumbPais: ['navegacao.contratos'],
          permissao: Permissoes.Contratos.Visualizar,
        },
      },
      {
        path: 'producao/ordens',
        name: 'ordens-producao',
        component: () => import('pages/producao/OrdensProducaoListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.ordensProducao',
          permissao: Permissoes.Producao.Visualizar,
          requerIndustria: true,
        },
      },
      {
        path: 'producao/ordens/nova',
        name: 'ordem-producao-nova',
        component: () => import('pages/producao/OrdemProducaoFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.ordemProducaoNova',
          breadcrumbPais: ['navegacao.ordensProducao'],
          permissao: Permissoes.Producao.Visualizar,
          requerIndustria: true,
        },
      },
      {
        path: 'producao/ordens/:id/editar',
        name: 'ordem-producao-editar',
        component: () => import('pages/producao/OrdemProducaoFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.ordemProducaoEditar',
          breadcrumbPais: ['navegacao.ordensProducao'],
          permissao: Permissoes.Producao.Visualizar,
          requerIndustria: true,
        },
      },
      {
        path: 'producao/ordens/:id',
        name: 'ordem-producao-detalhe',
        component: () => import('pages/producao/OrdemProducaoDetalhePage.vue'),
        meta: {
          breadcrumb: 'navegacao.ordemProducaoDetalhe',
          breadcrumbPais: ['navegacao.ordensProducao'],
          permissao: Permissoes.Producao.Visualizar,
          requerIndustria: true,
        },
      },
      {
        path: 'producao/beneficiamentos',
        name: 'beneficiamentos',
        component: () => import('pages/producao/BeneficiamentosListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.beneficiamentos',
          permissao: Permissoes.Producao.Visualizar,
          requerIndustria: true,
        },
      },
      {
        path: 'producao/beneficiamentos/novo',
        name: 'beneficiamento-novo',
        component: () => import('pages/producao/BeneficiamentoFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.beneficiamentoNovo',
          breadcrumbPais: ['navegacao.beneficiamentos'],
          permissao: Permissoes.Producao.Visualizar,
          requerIndustria: true,
        },
      },
      {
        path: 'producao/beneficiamentos/:id/editar',
        name: 'beneficiamento-editar',
        component: () => import('pages/producao/BeneficiamentoFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.beneficiamentoEditar',
          breadcrumbPais: ['navegacao.beneficiamentos'],
          permissao: Permissoes.Producao.Visualizar,
          requerIndustria: true,
        },
      },
      {
        path: 'producao/beneficiamentos/:id',
        name: 'beneficiamento-visualizar',
        component: () => import('pages/producao/BeneficiamentoFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.beneficiamentoVisualizar',
          breadcrumbPais: ['navegacao.beneficiamentos'],
          permissao: Permissoes.Producao.Visualizar,
          requerIndustria: true,
        },
      },
      {
        path: 'producao/receitas',
        name: 'receitas-producao',
        component: () => import('pages/producao/ReceitasListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.receitasProducao',
          permissao: Permissoes.Producao.Visualizar,
          requerIndustria: true,
        },
      },
      {
        path: 'producao/receitas/nova',
        name: 'receita-producao-nova',
        component: () => import('pages/producao/ReceitaFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.receitaProducaoNova',
          breadcrumbPais: ['navegacao.receitasProducao'],
          permissao: Permissoes.Producao.Visualizar,
          requerIndustria: true,
        },
      },
      {
        path: 'producao/receitas/:id/editar',
        name: 'receita-producao-editar',
        component: () => import('pages/producao/ReceitaFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.receitaProducaoEditar',
          breadcrumbPais: ['navegacao.receitasProducao'],
          permissao: Permissoes.Producao.Visualizar,
          requerIndustria: true,
        },
      },
      {
        path: 'producao/receitas/:id',
        name: 'receita-producao-visualizar',
        component: () => import('pages/producao/ReceitaFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.receitaProducaoVisualizar',
          breadcrumbPais: ['navegacao.receitasProducao'],
          permissao: Permissoes.Producao.Visualizar,
          requerIndustria: true,
        },
      },
      {
        path: 'producao/laudos',
        name: 'laudos',
        component: () => import('pages/producao/LaudosListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.laudos',
          permissao: Permissoes.Producao.Visualizar,
          requerIndustria: true,
        },
      },
      {
        path: 'producao/laudos/novo',
        name: 'laudo-novo',
        component: () => import('pages/producao/LaudoFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.laudoNovo',
          breadcrumbPais: ['navegacao.laudos'],
          permissao: Permissoes.Producao.Visualizar,
          requerIndustria: true,
        },
      },
      {
        path: 'producao/laudos/:id',
        name: 'laudo-detalhe',
        component: () => import('pages/producao/LaudoFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.laudoDetalhe',
          breadcrumbPais: ['navegacao.laudos'],
          permissao: Permissoes.Producao.Visualizar,
          requerIndustria: true,
        },
      },
      {
        path: 'producao/fichas-tecnicas',
        name: 'fichas-tecnicas',
        component: () => import('pages/producao/FichasTecnicasListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.fichasTecnicas',
          permissao: Permissoes.Producao.Visualizar,
          requerIndustria: true,
        },
      },
      {
        path: 'producao/fichas-tecnicas/nova',
        name: 'ficha-tecnica-nova',
        component: () => import('pages/producao/FichaTecnicaFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.fichaTecnicaNova',
          breadcrumbPais: ['navegacao.fichasTecnicas'],
          permissao: Permissoes.Producao.Visualizar,
          requerIndustria: true,
        },
      },
      {
        path: 'producao/fichas-tecnicas/:id/editar',
        name: 'ficha-tecnica-editar',
        component: () => import('pages/producao/FichaTecnicaFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.fichaTecnicaEditar',
          breadcrumbPais: ['navegacao.fichasTecnicas'],
          permissao: Permissoes.Producao.Visualizar,
          requerIndustria: true,
        },
      },
      {
        path: 'producao/fichas-tecnicas/:id',
        name: 'ficha-tecnica-visualizar',
        component: () => import('pages/producao/FichaTecnicaFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.fichaTecnicaVisualizar',
          breadcrumbPais: ['navegacao.fichasTecnicas'],
          permissao: Permissoes.Producao.Visualizar,
          requerIndustria: true,
        },
      },
      {
        path: 'producao/paradas',
        name: 'paradas-linha',
        component: () => import('pages/producao/ParadasListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.paradasLinha',
          permissao: Permissoes.Producao.Visualizar,
          requerIndustria: true,
        },
      },
      {
        path: 'producao/oee',
        name: 'oee',
        component: () => import('pages/producao/OeePage.vue'),
        meta: {
          breadcrumb: 'navegacao.oee',
          permissao: Permissoes.Producao.Visualizar,
          requerIndustria: true,
        },
      },
      {
        path: 'manutencao',
        name: 'manutencao-dashboard',
        component: () => import('pages/manutencao/ManutencaoDashboardPage.vue'),
        meta: {
          breadcrumb: 'navegacao.manutencaoDashboard',
          permissao: Permissoes.Manutencao.Visualizar,
        },
      },
      {
        path: 'manutencao/ativos',
        name: 'manutencao-ativos',
        component: () => import('pages/manutencao/AtivosListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.manutencaoAtivos',
          permissao: Permissoes.Manutencao.Visualizar,
        },
      },
      {
        path: 'manutencao/ativos/novo',
        name: 'manutencao-ativo-novo',
        component: () => import('pages/manutencao/AtivoFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.manutencaoAtivoNovo',
          breadcrumbPais: ['navegacao.manutencaoAtivos'],
          permissao: Permissoes.Manutencao.Visualizar,
        },
      },
      {
        path: 'manutencao/ativos/:id/editar',
        name: 'manutencao-ativo-editar',
        component: () => import('pages/manutencao/AtivoFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.manutencaoAtivoEditar',
          breadcrumbPais: ['navegacao.manutencaoAtivos'],
          permissao: Permissoes.Manutencao.Visualizar,
        },
      },
      {
        path: 'manutencao/ativos/:id',
        name: 'manutencao-ativo-detalhe',
        component: () => import('pages/manutencao/AtivoDetalhePage.vue'),
        meta: {
          breadcrumb: 'navegacao.manutencaoAtivoDetalhe',
          breadcrumbPais: ['navegacao.manutencaoAtivos'],
          permissao: Permissoes.Manutencao.Visualizar,
        },
      },
      {
        path: 'manutencao/planos',
        name: 'manutencao-planos',
        component: () => import('pages/manutencao/PlanosListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.manutencaoPlanos',
          permissao: Permissoes.Manutencao.Visualizar,
        },
      },
      {
        path: 'manutencao/ordens',
        name: 'manutencao-ordens',
        component: () => import('pages/manutencao/OrdensServicoListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.manutencaoOrdens',
          permissao: Permissoes.Manutencao.Visualizar,
        },
      },
      {
        path: 'manutencao/ordens/nova',
        name: 'manutencao-ordem-nova',
        component: () => import('pages/manutencao/OrdemServicoFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.manutencaoOrdemNova',
          breadcrumbPais: ['navegacao.manutencaoOrdens'],
          permissao: Permissoes.Manutencao.Visualizar,
        },
      },
      {
        path: 'manutencao/ordens/:id',
        name: 'manutencao-ordem-detalhe',
        component: () => import('pages/manutencao/OrdemServicoDetalhePage.vue'),
        meta: {
          breadcrumb: 'navegacao.manutencaoOrdemDetalhe',
          breadcrumbPais: ['navegacao.manutencaoOrdens'],
          permissao: Permissoes.Manutencao.Visualizar,
        },
      },
      {
        path: 'manutencao/checklists',
        name: 'manutencao-checklists',
        component: () => import('pages/manutencao/ChecklistsListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.manutencaoChecklists',
          permissao: Permissoes.Manutencao.Visualizar,
        },
      },
      {
        path: 'manutencao/checklists/novo',
        name: 'manutencao-checklist-novo',
        component: () => import('pages/manutencao/ChecklistFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.manutencaoChecklistNovo',
          breadcrumbPais: ['navegacao.manutencaoChecklists'],
          permissao: Permissoes.Manutencao.Visualizar,
        },
      },
      {
        path: 'manutencao/custos',
        name: 'manutencao-custos',
        component: () => import('pages/manutencao/CustosManutencaoPage.vue'),
        meta: {
          breadcrumb: 'navegacao.manutencaoCustos',
          permissao: Permissoes.Manutencao.Visualizar,
        },
      },
      {
        path: 'logistica',
        name: 'logistica-dashboard',
        component: () => import('pages/logistica/LogisticaDashboardPage.vue'),
        meta: {
          breadcrumb: 'navegacao.logisticaDashboard',
          permissao: Permissoes.Logistica.Visualizar,
        },
      },
      {
        path: 'logistica/veiculos',
        name: 'logistica-veiculos',
        component: () => import('pages/logistica/VeiculosListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.logisticaVeiculos',
          permissao: Permissoes.Logistica.Visualizar,
        },
      },
      {
        path: 'logistica/veiculos/novo',
        name: 'logistica-veiculo-novo',
        component: () => import('pages/logistica/VeiculoFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.logisticaVeiculoNovo',
          breadcrumbPais: ['navegacao.logisticaVeiculos'],
          permissao: Permissoes.Logistica.Visualizar,
        },
      },
      {
        path: 'logistica/veiculos/:id/editar',
        name: 'logistica-veiculo-editar',
        component: () => import('pages/logistica/VeiculoFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.logisticaVeiculoEditar',
          breadcrumbPais: ['navegacao.logisticaVeiculos'],
          permissao: Permissoes.Logistica.Visualizar,
        },
      },
      {
        path: 'logistica/veiculos/:id',
        name: 'logistica-veiculo-visualizar',
        component: () => import('pages/logistica/VeiculoFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.logisticaVeiculoVisualizar',
          breadcrumbPais: ['navegacao.logisticaVeiculos'],
          permissao: Permissoes.Logistica.Visualizar,
        },
      },
      {
        path: 'logistica/cargas',
        name: 'logistica-cargas',
        component: () => import('pages/logistica/CargasListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.logisticaCargas',
          permissao: Permissoes.Logistica.Visualizar,
        },
      },
      {
        path: 'logistica/cargas/novo',
        name: 'logistica-carga-nova',
        component: () => import('pages/logistica/CargaFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.logisticaCargaNova',
          breadcrumbPais: ['navegacao.logisticaCargas'],
          permissao: Permissoes.Logistica.Visualizar,
        },
      },
      {
        path: 'logistica/cargas/:id/editar',
        name: 'logistica-carga-editar',
        component: () => import('pages/logistica/CargaFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.logisticaCargaEditar',
          breadcrumbPais: ['navegacao.logisticaCargas'],
          permissao: Permissoes.Logistica.Visualizar,
        },
      },
      {
        path: 'logistica/cargas/:id',
        name: 'logistica-carga-detalhe',
        component: () => import('pages/logistica/CargaDetalhePage.vue'),
        meta: {
          breadcrumb: 'navegacao.logisticaCargaDetalhe',
          breadcrumbPais: ['navegacao.logisticaCargas'],
          permissao: Permissoes.Logistica.Visualizar,
        },
      },
      {
        path: 'logistica/romaneios',
        name: 'logistica-romaneios',
        component: () => import('pages/logistica/RomaneiosListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.logisticaRomaneios',
          permissao: Permissoes.Logistica.Visualizar,
        },
      },
      {
        path: 'logistica/romaneios/:id',
        name: 'logistica-romaneio-detalhe',
        component: () => import('pages/logistica/RomaneioDetalhePage.vue'),
        meta: {
          breadcrumb: 'navegacao.logisticaRomaneioDetalhe',
          breadcrumbPais: ['navegacao.logisticaRomaneios'],
          permissao: Permissoes.Logistica.Visualizar,
        },
      },
      {
        path: 'logistica/transportadoras',
        name: 'logistica-transportadoras',
        component: () => import('pages/logistica/TransportadorasListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.logisticaTransportadoras',
          permissao: Permissoes.Logistica.Visualizar,
        },
      },
      {
        path: 'logistica/transportadoras/:id',
        name: 'logistica-transportadora-detalhe',
        component: () => import('pages/logistica/TransportadoraDetalhePage.vue'),
        meta: {
          breadcrumb: 'navegacao.logisticaTransportadoraDetalhe',
          breadcrumbPais: ['navegacao.logisticaTransportadoras'],
          permissao: Permissoes.Logistica.Visualizar,
        },
      },
      {
        path: 'logistica/abastecimentos',
        name: 'logistica-abastecimentos',
        component: () => import('pages/logistica/AbastecimentosListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.logisticaAbastecimentos',
          permissao: Permissoes.Logistica.Visualizar,
        },
      },
      {
        path: 'logistica/docs-transporte',
        name: 'logistica-docs-transporte',
        component: () => import('pages/logistica/DocsTransporteListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.logisticaDocsTransporte',
          permissao: Permissoes.Logistica.Visualizar,
        },
      },
      {
        path: 'logistica/custos',
        name: 'logistica-custos',
        component: () => import('pages/logistica/CustoLogisticaPage.vue'),
        meta: {
          breadcrumb: 'navegacao.logisticaCustos',
          permissao: Permissoes.Logistica.Visualizar,
        },
      },
      {
        path: 'crm',
        name: 'crm-dashboard',
        component: () => import('pages/crm/CrmDashboardPage.vue'),
        meta: {
          breadcrumb: 'navegacao.crmDashboard',
          permissao: Permissoes.Crm.Visualizar,
        },
      },
      {
        path: 'crm/carteira',
        name: 'crm-carteira',
        component: () => import('pages/crm/CarteiraAgronomicaPage.vue'),
        meta: {
          breadcrumb: 'navegacao.crmCarteira',
          permissao: Permissoes.Crm.Visualizar,
        },
      },
      {
        path: 'crm/oportunidades',
        name: 'crm-oportunidades',
        component: () => import('pages/crm/OportunidadesListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.crmOportunidades',
          permissao: Permissoes.Crm.Visualizar,
        },
      },
      {
        path: 'crm/oportunidades/novo',
        name: 'crm-oportunidade-nova',
        component: () => import('pages/crm/OportunidadeFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.crmOportunidadeNova',
          breadcrumbPais: ['navegacao.crmOportunidades'],
          permissao: Permissoes.Crm.Visualizar,
        },
      },
      {
        path: 'crm/oportunidades/:id/editar',
        name: 'crm-oportunidade-editar',
        component: () => import('pages/crm/OportunidadeFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.crmOportunidadeEditar',
          breadcrumbPais: ['navegacao.crmOportunidades'],
          permissao: Permissoes.Crm.Visualizar,
        },
      },
      {
        path: 'crm/oportunidades/:id',
        name: 'crm-oportunidade-visualizar',
        component: () => import('pages/crm/OportunidadeFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.crmOportunidadeVisualizar',
          breadcrumbPais: ['navegacao.crmOportunidades'],
          permissao: Permissoes.Crm.Visualizar,
        },
      },
      {
        path: 'crm/amostras',
        name: 'crm-amostras',
        component: () => import('pages/crm/AmostrasListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.crmAmostras',
          permissao: Permissoes.Crm.Visualizar,
        },
      },
      {
        path: 'crm/amostras/novo',
        name: 'crm-amostra-nova',
        component: () => import('pages/crm/AmostraFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.crmAmostraNova',
          breadcrumbPais: ['navegacao.crmAmostras'],
          permissao: Permissoes.Crm.Visualizar,
        },
      },
      {
        path: 'crm/amostras/:id/editar',
        name: 'crm-amostra-editar',
        component: () => import('pages/crm/AmostraFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.crmAmostraEditar',
          breadcrumbPais: ['navegacao.crmAmostras'],
          permissao: Permissoes.Crm.Visualizar,
        },
      },
      {
        path: 'crm/amostras/:id',
        name: 'crm-amostra-visualizar',
        component: () => import('pages/crm/AmostraFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.crmAmostraVisualizar',
          breadcrumbPais: ['navegacao.crmAmostras'],
          permissao: Permissoes.Crm.Visualizar,
        },
      },
      {
        path: 'crm/campanhas',
        name: 'crm-campanhas',
        component: () => import('pages/crm/CampanhasListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.crmCampanhas',
          permissao: Permissoes.Crm.Visualizar,
        },
      },
      {
        path: 'crm/campanhas/:id',
        name: 'crm-campanha-detalhe',
        component: () => import('pages/crm/CampanhaDetalhePage.vue'),
        meta: {
          breadcrumb: 'navegacao.crmCampanhaDetalhe',
          breadcrumbPais: ['navegacao.crmCampanhas'],
          permissao: Permissoes.Crm.Visualizar,
        },
      },
      {
        path: 'crm/credito',
        name: 'crm-credito',
        component: () => import('pages/crm/AnalisesCreditoListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.crmCredito',
          permissao: Permissoes.Crm.Visualizar,
        },
      },
      {
        path: 'crm/credito/:id',
        name: 'crm-credito-detalhe',
        component: () => import('pages/crm/AnaliseCreditoDetalhePage.vue'),
        meta: {
          breadcrumb: 'navegacao.crmCreditoDetalhe',
          breadcrumbPais: ['navegacao.crmCredito'],
          permissao: Permissoes.Crm.Visualizar,
        },
      },
      {
        path: 'rastreabilidade/talhoes',
        name: 'talhoes',
        component: () => import('pages/rastreabilidade/TalhoesListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.talhoes',
          permissao: Permissoes.Rastreabilidade.Visualizar,
        },
      },
      {
        path: 'rastreabilidade/aplicacoes',
        name: 'aplicacoes',
        component: () => import('pages/rastreabilidade/AplicacoesListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.aplicacoes',
          permissao: Permissoes.Rastreabilidade.Visualizar,
        },
      },
      {
        path: 'rastreabilidade/aplicacoes/nova',
        name: 'aplicacao-nova',
        component: () => import('pages/rastreabilidade/AplicacaoFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.aplicacaoNova',
          breadcrumbPais: ['navegacao.aplicacoes'],
          permissao: Permissoes.Rastreabilidade.Visualizar,
        },
      },
      {
        path: 'rastreabilidade/aplicacoes/:id/editar',
        name: 'aplicacao-editar',
        component: () => import('pages/rastreabilidade/AplicacaoFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.aplicacaoEditar',
          breadcrumbPais: ['navegacao.aplicacoes'],
          permissao: Permissoes.Rastreabilidade.Visualizar,
        },
      },
      {
        path: 'rastreabilidade/aplicacoes/:id',
        name: 'aplicacao-visualizar',
        component: () => import('pages/rastreabilidade/AplicacaoFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.aplicacaoVisualizar',
          breadcrumbPais: ['navegacao.aplicacoes'],
          permissao: Permissoes.Rastreabilidade.Visualizar,
        },
      },
      {
        path: 'safras/fazendas',
        name: 'safras-fazendas',
        component: () => import('pages/safras/FazendasListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.fazendas',
          permissao: Permissoes.Rastreabilidade.Visualizar,
        },
      },
      {
        path: 'safras/glebas',
        name: 'safras-glebas',
        component: () => import('pages/safras/GlebasListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.glebas',
          permissao: Permissoes.Rastreabilidade.Visualizar,
        },
      },
      {
        path: 'safras/diario-campo',
        name: 'safras-diario-campo',
        component: () => import('pages/safras/DiarioCampoPage.vue'),
        meta: {
          breadcrumb: 'navegacao.diarioCampo',
          permissao: Permissoes.Rastreabilidade.Visualizar,
        },
      },
      {
        path: 'safras/historico-aplicacoes',
        name: 'safras-historico-aplicacoes',
        component: () => import('pages/safras/HistoricoAplicacoesPage.vue'),
        meta: {
          breadcrumb: 'navegacao.historicoAplicacoes',
          permissao: Permissoes.Rastreabilidade.Visualizar,
        },
      },
      {
        path: 'safras/historico-produtividade',
        name: 'safras-historico-produtividade',
        component: () => import('pages/safras/HistoricoProdutividadePage.vue'),
        meta: {
          breadcrumb: 'navegacao.historicoProdutividade',
          permissao: Permissoes.Rastreabilidade.Visualizar,
        },
      },
      {
        path: 'safras/geo',
        name: 'safras-geo',
        component: () => import('pages/safras/GeoImportPage.vue'),
        meta: {
          breadcrumb: 'navegacao.geoImport',
          permissao: Permissoes.Rastreabilidade.Visualizar,
        },
      },
      {
        path: 'safras/visitas-tecnicas',
        name: 'safras-visitas-tecnicas',
        component: () => import('pages/safras/VisitasTecnicasListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.visitasTecnicas',
          permissao: Permissoes.Rastreabilidade.Visualizar,
        },
      },
      {
        path: 'safras/recomendacoes',
        name: 'safras-recomendacoes',
        component: () => import('pages/safras/RecomendacoesListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.recomendacoes',
          permissao: Permissoes.Rastreabilidade.Visualizar,
        },
      },
      {
        path: 'safras/planejamento',
        name: 'safras-planejamento',
        component: () => import('pages/safras/SafrasListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.planejamentoSafras',
          permissao: Permissoes.Rastreabilidade.Visualizar,
        },
      },
      {
        path: 'safras/planejamento/nova',
        name: 'safra-nova',
        component: () => import('pages/safras/SafraFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.safraNova',
          breadcrumbPais: ['navegacao.planejamentoSafras'],
          permissao: Permissoes.Rastreabilidade.Visualizar,
        },
      },
      {
        path: 'safras/planejamento/:id/editar',
        name: 'safra-editar',
        component: () => import('pages/safras/SafraFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.safraEditar',
          breadcrumbPais: ['navegacao.planejamentoSafras'],
          permissao: Permissoes.Rastreabilidade.Visualizar,
        },
      },
      {
        path: 'safras/planejamento/:id',
        name: 'safra-visualizar',
        component: () => import('pages/safras/SafraFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.safraVisualizar',
          breadcrumbPais: ['navegacao.planejamentoSafras'],
          permissao: Permissoes.Rastreabilidade.Visualizar,
        },
      },
      {
        path: 'safras/ordens-servico',
        name: 'safras-ordens-servico',
        component: () => import('pages/safras/OrdensServicoAgricolaListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.ordensServicoAgricola',
          permissao: Permissoes.Rastreabilidade.Visualizar,
        },
      },
      {
        path: 'safras/custeio',
        name: 'safras-custeio',
        component: () => import('pages/safras/CusteioSafraPage.vue'),
        meta: {
          breadcrumb: 'navegacao.custeioSafra',
          permissao: Permissoes.Rastreabilidade.Visualizar,
        },
      },
      {
        path: 'safras/oee-campo',
        name: 'safras-oee-campo',
        component: () => import('pages/safras/OeeCampoPage.vue'),
        meta: {
          breadcrumb: 'navegacao.oeeCampo',
          permissao: Permissoes.Rastreabilidade.Visualizar,
        },
      },
      {
        path: 'cobranca-credito',
        name: 'cobranca-credito',
        component: () => import('pages/cobranca-credito/CobrancaCreditoPage.vue'),
        meta: {
          breadcrumb: 'navegacao.cobrancaCredito',
          permissao: Permissoes.CobrancaCredito.Visualizar,
        },
      },
      {
        path: 'relatorios',
        name: 'relatorios',
        component: () => import('pages/relatorios/RelatoriosPage.vue'),
        meta: {
          breadcrumb: 'navegacao.relatorios',
          permissao: Permissoes.Relatorios.Visualizar,
        },
      },
      {
        path: 'metas-vendedor',
        name: 'metas-vendedor',
        component: () => import('pages/metas-vendedor/MetasVendedorListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.metasVendedor',
          permissao: Permissoes.MetasVendedor.Visualizar,
        },
      },
      {
        path: 'representantes',
        name: 'representantes',
        component: () => import('pages/representantes/RepresentantesListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.representantes',
          permissao: Permissoes.Representantes.Visualizar,
        },
      },
      {
        path: 'regras-comissao',
        name: 'regras-comissao',
        component: () => import('pages/regras-comissao/RegrasComissaoListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.regrasComissao',
          permissao: Permissoes.RegrasComissao.Visualizar,
        },
      },
      {
        path: 'usuarios/:usuarioId/permissoes',
        name: 'usuario-permissoes',
        component: () => import('pages/permissoes/PermissaoGranularPage.vue'),
        meta: {
          breadcrumb: 'navegacao.permissoesGranulares',
          breadcrumbPais: ['navegacao.usuarios'],
          permissao: Permissoes.PermissoesGranulares.Configurar,
        },
      },
      {
        path: 'usuarios',
        name: 'usuarios',
        component: () => import('pages/usuarios/UsuariosListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.usuarios',
          permissao: Permissoes.Usuarios.Configurar,
        },
      },
      {
        path: 'usuarios/novo',
        name: 'usuario-novo',
        component: () => import('pages/usuarios/UsuarioFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.usuarioNovo',
          breadcrumbPais: ['navegacao.usuarios'],
          permissao: Permissoes.Usuarios.Configurar,
        },
      },
      {
        path: 'usuarios/:id/editar',
        name: 'usuario-editar',
        component: () => import('pages/usuarios/UsuarioFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.usuarioEditar',
          breadcrumbPais: ['navegacao.usuarios'],
          permissao: Permissoes.Usuarios.Configurar,
        },
      },
      {
        path: 'usuarios/:id',
        name: 'usuario-visualizar',
        component: () => import('pages/usuarios/UsuarioFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.usuarioVisualizar',
          breadcrumbPais: ['navegacao.usuarios'],
          permissao: Permissoes.Usuarios.Configurar,
        },
      },
      {
        path: 'colaboradores',
        name: 'colaboradores',
        component: () => import('pages/colaboradores/ColaboradoresListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.colaboradores',
          permissao: Permissoes.Colaboradores.Visualizar,
        },
      },
      {
        path: 'colaboradores/novo',
        name: 'colaborador-novo',
        component: () => import('pages/colaboradores/ColaboradorFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.colaboradorNovo',
          breadcrumbPais: ['navegacao.colaboradores'],
          permissao: Permissoes.Colaboradores.Visualizar,
        },
      },
      {
        path: 'colaboradores/:id/editar',
        name: 'colaborador-editar',
        component: () => import('pages/colaboradores/ColaboradorFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.colaboradorEditar',
          breadcrumbPais: ['navegacao.colaboradores'],
          permissao: Permissoes.Colaboradores.Visualizar,
        },
      },
      {
        path: 'colaboradores/:id',
        name: 'colaborador-visualizar',
        component: () => import('pages/colaboradores/ColaboradorFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.colaboradorVisualizar',
          breadcrumbPais: ['navegacao.colaboradores'],
          permissao: Permissoes.Colaboradores.Visualizar,
        },
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    name: 'not-found',
    component: () => import('pages/ErrorNotFound.vue'),
    meta: { publica: true },
  },
];
