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
    ],
  },
  {
    path: '/:catchAll(.*)*',
    name: 'not-found',
    component: () => import('pages/ErrorNotFound.vue'),
    meta: { publica: true },
  },
];
