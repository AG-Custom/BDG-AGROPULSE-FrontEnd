import { createRouter, createWebHistory } from 'vue-router';

import { usePerfilSafras } from 'composables/usePerfilSafras';
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
  const precisaConsolePlataforma = authStore.precisaConsolePlataforma;
  const precisaSelecionarUnidade = authStore.precisaSelecionarUnidade;
  const temEmpresa = authStore.temEmpresa;
  const temUnidade = authStore.temUnidade;
  const isSuperHost = authStore.isSuperHost;

  if (autenticado && precisaConsolePlataforma && !to.meta.plataforma) {
    return { name: 'plataforma' };
  }

  if (
    autenticado &&
    precisaSelecionarUnidade &&
    !to.meta.selecaoUnidade &&
    !(isSuperHost && to.meta.plataforma)
  ) {
    return { name: 'selecionar-unidade' };
  }

  if (autenticado && temUnidade && to.meta.selecaoUnidade) {
    return { name: 'dashboard' };
  }

  if (to.meta.convidado && autenticado) {
    if (precisaConsolePlataforma) {
      return { name: 'plataforma' };
    }

    if (precisaSelecionarUnidade) {
      return { name: 'selecionar-unidade' };
    }

    if (temUnidade) {
      return { name: 'dashboard' };
    }
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

  if (to.meta.requerSuperHost && !isSuperHost) {
    return { name: 'dashboard' };
  }

  if ((to.meta.requerEmpresa || to.meta.requerUnidade) && autenticado && temEmpresa && !temUnidade) {
    return { name: 'selecionar-unidade' };
  }

  if ((to.meta.requerEmpresa || to.meta.requerUnidade) && autenticado && !temEmpresa && isSuperHost) {
    return { name: 'plataforma' };
  }

  const permissao = to.meta.permissao;
  if (typeof permissao === 'string' && !authStore.possuiPermissao(permissao)) {
    return { name: 'dashboard' };
  }

  if (to.meta.requerIndustria && temEmpresa) {
    const { isIndustria, carregarPerfil } = usePerfilSafras();
    await carregarPerfil();
    if (!isIndustria.value) {
      return { name: 'dashboard' };
    }
  }

  return true;
});
