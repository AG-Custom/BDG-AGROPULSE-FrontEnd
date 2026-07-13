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
        path: 'categorias-produto/novo',
        name: 'categoria-produto-novo',
        component: () => import('pages/categorias-produto/CategoriaProdutoFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.categoriaProdutoNovo',
          breadcrumbPais: ['navegacao.categoriasProduto'],
          permissao: Permissoes.CategoriasProduto.Visualizar,
        },
      },
      {
        path: 'categorias-produto/:id/editar',
        name: 'categoria-produto-editar',
        component: () => import('pages/categorias-produto/CategoriaProdutoFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.categoriaProdutoEditar',
          breadcrumbPais: ['navegacao.categoriasProduto'],
          permissao: Permissoes.CategoriasProduto.Visualizar,
        },
      },
      {
        path: 'categorias-produto/:id',
        name: 'categoria-produto-visualizar',
        component: () => import('pages/categorias-produto/CategoriaProdutoFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.categoriaProdutoVisualizar',
          breadcrumbPais: ['navegacao.categoriasProduto'],
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
        path: 'unidades-medida/novo',
        name: 'unidade-medida-novo',
        component: () => import('pages/unidades-medida/UnidadeMedidaFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.unidadeMedidaNovo',
          breadcrumbPais: ['navegacao.unidadesMedida'],
          permissao: Permissoes.UnidadesMedida.Visualizar,
        },
      },
      {
        path: 'unidades-medida/:id/editar',
        name: 'unidade-medida-editar',
        component: () => import('pages/unidades-medida/UnidadeMedidaFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.unidadeMedidaEditar',
          breadcrumbPais: ['navegacao.unidadesMedida'],
          permissao: Permissoes.UnidadesMedida.Visualizar,
        },
      },
      {
        path: 'unidades-medida/:id',
        name: 'unidade-medida-visualizar',
        component: () => import('pages/unidades-medida/UnidadeMedidaFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.unidadeMedidaVisualizar',
          breadcrumbPais: ['navegacao.unidadesMedida'],
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
          permissao: Permissoes.FormasPagamentoConfig.Visualizar,
        },
      },
      {
        path: 'formas-pagamento-config/:id/editar',
        name: 'forma-pagamento-config-editar',
        component: () => import('pages/financeiro/FormaPagamentoConfigFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.formaPagamentoConfigEditar',
          breadcrumbPais: ['navegacao.formasPagamentoConfig'],
          permissao: Permissoes.FormasPagamentoConfig.Visualizar,
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
        name: 'contas-pagar',
        component: () => import('pages/compras/ContasPagarListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.contasPagar',
          permissao: Permissoes.Compras.Visualizar,
        },
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
        },
      },
      {
        path: 'producao/beneficiamentos',
        name: 'beneficiamentos',
        component: () => import('pages/producao/BeneficiamentosListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.beneficiamentos',
          permissao: Permissoes.Producao.Visualizar,
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
        path: 'rastreabilidade/talhoes/novo',
        name: 'talhao-novo',
        component: () => import('pages/rastreabilidade/TalhaoFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.talhaoNovo',
          breadcrumbPais: ['navegacao.talhoes'],
          permissao: Permissoes.Rastreabilidade.Visualizar,
        },
      },
      {
        path: 'rastreabilidade/talhoes/:id/editar',
        name: 'talhao-editar',
        component: () => import('pages/rastreabilidade/TalhaoFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.talhaoEditar',
          breadcrumbPais: ['navegacao.talhoes'],
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
        path: 'relatorios',
        name: 'relatorios',
        component: () => import('pages/relatorios/RelatoriosPage.vue'),
        meta: {
          breadcrumb: 'navegacao.relatorios',
          permissao: Permissoes.Relatorios.Visualizar,
        },
      },
      {
        path: 'usuarios/:usuarioId/permissoes',
        name: 'usuario-permissoes',
        component: () => import('pages/permissoes/PermissaoGranularPage.vue'),
        meta: {
          breadcrumb: 'navegacao.permissoesGranulares',
          breadcrumbPais: ['navegacao.usuarios'],
          permissao: Permissoes.PermissoesGranulares.Visualizar,
        },
      },
      {
        path: 'usuarios',
        name: 'usuarios',
        component: () => import('pages/usuarios/UsuariosListPage.vue'),
        meta: {
          breadcrumb: 'navegacao.usuarios',
          permissao: Permissoes.Usuarios.Visualizar,
        },
      },
      {
        path: 'usuarios/novo',
        name: 'usuario-novo',
        component: () => import('pages/usuarios/UsuarioFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.usuarioNovo',
          breadcrumbPais: ['navegacao.usuarios'],
          permissao: Permissoes.Usuarios.Visualizar,
        },
      },
      {
        path: 'usuarios/:id/editar',
        name: 'usuario-editar',
        component: () => import('pages/usuarios/UsuarioFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.usuarioEditar',
          breadcrumbPais: ['navegacao.usuarios'],
          permissao: Permissoes.Usuarios.Visualizar,
        },
      },
      {
        path: 'usuarios/:id',
        name: 'usuario-visualizar',
        component: () => import('pages/usuarios/UsuarioFormPage.vue'),
        meta: {
          breadcrumb: 'navegacao.usuarioVisualizar',
          breadcrumbPais: ['navegacao.usuarios'],
          permissao: Permissoes.Usuarios.Visualizar,
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
