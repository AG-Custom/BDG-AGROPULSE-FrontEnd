import { createRouter, createWebHistory } from 'vue-router';

import { useAuthStore } from 'stores/auth.store';

import { routes } from './routes';

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();

  if (to.meta.publica) {
    return true;
  }

  if (!authStore.verificado) {
    await authStore.verificar();
  }

  if (!authStore.autenticado) {
    return { name: 'login', query: { redirect: to.fullPath } };
  }

  const permissao = to.meta.permissao;
  if (typeof permissao === 'string' && !authStore.possuiPermissao(permissao)) {
    return { name: 'dashboard' };
  }

  return true;
});
