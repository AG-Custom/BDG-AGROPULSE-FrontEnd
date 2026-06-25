import type { RouteRecordRaw } from 'vue-router';

import { Permissoes } from 'constants/permissoes';

export const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('layouts/AuthLayout.vue'),
    meta: { publica: true },
    children: [
      {
        path: '',
        component: () => import('pages/auth/LoginPage.vue'),
      },
    ],
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
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
