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
  const precisaSelecionarUnidade = authStore.precisaSelecionarUnidade;
  const temEmpresa = authStore.temEmpresa;
  const temUnidade = authStore.temUnidade;

  if (autenticado && precisaOnboarding && !to.meta.onboarding) {
    return { name: 'onboarding' };
  }

  if (autenticado && precisaSelecionarUnidade && !to.meta.selecaoUnidade) {
    return { name: 'selecionar-unidade' };
  }

  if (autenticado && temUnidade && (to.meta.onboarding || to.meta.selecaoUnidade)) {
    return { name: 'dashboard' };
  }

  if (to.meta.convidado && autenticado && temUnidade) {
    return { name: 'dashboard' };
  }

  if (to.meta.convidado && autenticado && precisaSelecionarUnidade) {
    return { name: 'selecionar-unidade' };
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

  if ((to.meta.requerEmpresa || to.meta.requerUnidade) && autenticado && temEmpresa && !temUnidade) {
    return { name: 'selecionar-unidade' };
  }

  const permissao = to.meta.permissao;
  if (typeof permissao === 'string' && !authStore.possuiPermissao(permissao)) {
    return { name: 'dashboard' };
  }

  return true;
});
