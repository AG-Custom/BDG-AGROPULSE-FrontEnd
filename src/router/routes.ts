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
