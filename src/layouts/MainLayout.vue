<template>
  <q-layout view="hHh Lpr lFf" class="main-layout">
    <q-header class="main-layout__header">
      <q-toolbar class="main-layout__toolbar">
        <agro-btn
          flat
          round
          dense
          icon="menu"
          descricao="Alternar menu lateral"
          @click="drawer = !drawer"
        />
        <agro-logo size="sm" :show-text="false" class="main-layout__logo-mobile" />
        <q-space />
        <div class="main-layout__actions">
          <notificacoes-menu v-if="podeVerNotificacoes" />
          <empresa-header-link />
          <agro-btn
            outline
            dense
            no-caps
            icon="logout"
            label="Sair"
            descricao="Encerrar sessão e voltar ao login"
            class="main-layout__logout"
            @click="sair"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" :width="260" class="main-layout__drawer">
      <div class="main-layout__drawer-brand">
        <agro-logo size="md" inverse />
        <div v-if="usuario" class="main-layout__user">
          <div class="main-layout__user-name">{{ nomeUsuario }}</div>
          <div class="main-layout__user-email">{{ usuario.email }}</div>
        </div>
        <unidade-switcher />
      </div>
      <app-sidebar />
    </q-drawer>

    <q-page-container class="main-layout__content">
      <router-view :key="`${String($route.name ?? $route.path)}-${unidadeId ?? ''}`" />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import AppSidebar from 'components/layout/AppSidebar.vue';
import EmpresaHeaderLink from 'components/layout/EmpresaHeaderLink.vue';
import NotificacoesMenu from 'components/layout/NotificacoesMenu.vue';
import UnidadeSwitcher from 'components/layout/UnidadeSwitcher.vue';
import AgroLogo from 'components/shared/AgroLogo.vue';
import { useAuth } from 'composables/useAuth';
import { useNotificacoes } from 'composables/useNotificacoes';
import { Permissoes } from 'constants/permissoes';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const INTERVALO_POLLING_MS = 60_000;

const drawer = ref(true);
const router = useRouter();
const { sair: sairAuth, usuario, unidadeId, possuiPermissao } = useAuth();
const { carregar: carregarNotificacoes } = useNotificacoes();

const nomeUsuario = computed(() => usuario.value?.nome ?? '');
const podeVerNotificacoes = computed(() =>
  possuiPermissao(Permissoes.Notificacoes.Visualizar),
);

let pollingTimer: ReturnType<typeof setInterval> | undefined;

function iniciarPolling(): void {
  pararPolling();

  if (!podeVerNotificacoes.value) {
    return;
  }

  void carregarNotificacoes({ apenasNaoLidas: true });
  pollingTimer = setInterval(() => {
    void carregarNotificacoes({ apenasNaoLidas: true });
  }, INTERVALO_POLLING_MS);
}

function pararPolling(): void {
  if (pollingTimer) {
    clearInterval(pollingTimer);
    pollingTimer = undefined;
  }
}

async function sair(): Promise<void> {
  pararPolling();
  await sairAuth();
  await router.push({ name: 'login' });
}

watch(podeVerNotificacoes, (pode) => {
  if (pode) {
    iniciarPolling();
  } else {
    pararPolling();
  }
});

onMounted(() => {
  if (podeVerNotificacoes.value) {
    iniciarPolling();
  }
});

onUnmounted(() => {
  pararPolling();
});
</script>

<style scoped>
.main-layout__header {
  background: var(--color-surface-default);
  border-bottom: var(--border-width-thin) solid var(--color-border-default);
  color: var(--color-text-primary);
}

.main-layout__toolbar {
  min-height: var(--header-height);
}

.main-layout__drawer {
  background: var(--color-sidebar-bg);
}

.main-layout__drawer-brand {
  border-bottom: var(--border-width-thin) solid var(--color-sidebar-border);
  display: grid;
  gap: var(--spacing-3);
  padding: var(--spacing-5) var(--spacing-4);
}

.main-layout__user {
  display: grid;
  gap: var(--spacing-1);
}

.main-layout__user-name {
  color: var(--color-sidebar-text);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
}

.main-layout__user-email {
  color: var(--color-sidebar-text-secondary);
  font-size: var(--font-size-xs);
  line-height: var(--line-height-normal);
}

.main-layout__content {
  background: var(--color-bg-default);
  width: 100%;
}

.main-layout__logo-mobile {
  display: none;
}

.main-layout__actions {
  align-items: center;
  display: flex;
  gap: var(--spacing-2);
}

.main-layout__logout {
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
  letter-spacing: normal;
  text-transform: none;
}

.main-layout__logout:hover {
  background: var(--color-error-50);
  color: var(--color-error-700);
}

@media (max-width: 1023px) {
  .main-layout__logo-mobile {
    display: inline-flex;
    margin-left: var(--spacing-2);
  }
}
</style>
