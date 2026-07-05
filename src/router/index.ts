import { createRouter, createWebHistory } from 'vue-router';

import { useAuthStore } from 'stores/auth.store';

import { routes } from './routes';

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();

  if (!authStore.verificado) {
    await authStore.verificar();
  }

  const autenticado = authStore.autenticado;
  const precisaOnboarding = authStore.precisaOnboarding;
  const temEmpresa = authStore.temEmpresa;

  if (autenticado && precisaOnboarding && !to.meta.onboarding) {
    return { name: 'onboarding' };
  }

  if (autenticado && temEmpresa && to.meta.onboarding) {
    return { name: 'dashboard' };
  }

  if (to.meta.convidado && autenticado && temEmpresa) {
    return { name: 'dashboard' };
  }

  if (to.meta.publica) {
    return true;
  }

  if (to.meta.requerAuth && !autenticado) {
    return { name: 'login', query: { redirect: to.fullPath } };
  }

  if (!autenticado) {
    return { name: 'login', query: { redirect: to.fullPath } };
  }

  const permissao = to.meta.permissao;
  if (typeof permissao === 'string' && !authStore.possuiPermissao(permissao)) {
    return { name: 'dashboard' };
  }

  return true;
});
