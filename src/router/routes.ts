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
    meta: { layout: 'main', requerEmpresa: true },
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
    ],
  },
  {
    path: '/:catchAll(.*)*',
    name: 'not-found',
    component: () => import('pages/ErrorNotFound.vue'),
    meta: { publica: true },
  },
];
