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
          <q-btn
            v-if="usuario"
            flat
            dense
            no-caps
            class="main-layout__user-menu"
            aria-label="Conta do usuário"
          >
            <q-icon name="account_circle" size="22px" />
            <span class="main-layout__user-menu-name">{{ nomeUsuario }}</span>
            <q-menu anchor="bottom right" self="top right">
              <q-list style="min-width: 220px">
                <q-item>
                  <q-item-section>
                    <q-item-label>{{ nomeUsuario }}</q-item-label>
                    <q-item-label caption>{{ usuario.email }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
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

    <q-drawer
      v-model="drawer"
      :width="drawerWidth"
      class="main-layout__drawer"
      :class="{ 'main-layout__drawer--collapsed': sidebarCollapsed }"
    >
      <div class="main-layout__drawer-inner">
        <div class="main-layout__drawer-brand">
          <agro-logo
            :size="sidebarCollapsed ? 'sm' : 'md'"
            inverse
            :show-text="!sidebarCollapsed"
          />
          <div v-if="usuario && !sidebarCollapsed" class="main-layout__user">
            <div class="main-layout__user-name">{{ nomeUsuario }}</div>
          </div>
          <unidade-switcher v-if="!sidebarCollapsed" compact />
        </div>
        <app-sidebar :collapsed="sidebarCollapsed" />
        <button
          type="button"
          class="main-layout__collapse-btn"
          :aria-label="sidebarCollapsed ? 'Expandir menu' : 'Recolher menu'"
          @click="alternarCollapse"
        >
          <q-icon :name="sidebarCollapsed ? 'chevron_right' : 'chevron_left'" size="18px" />
        </button>
      </div>
    </q-drawer>

    <q-page-container class="main-layout__content">
      <app-module-subnav />
      <router-view :key="`${String($route.name ?? $route.path)}-${unidadeId ?? ''}`" />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import AppModuleSubnav from 'components/layout/AppModuleSubnav.vue';
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
const STORAGE_SIDEBAR_COLLAPSED = 'agropulse.sidebar.collapsed';

const drawer = ref(true);
const sidebarCollapsed = ref(false);
const router = useRouter();
const { sair: sairAuth, usuario, unidadeId, possuiPermissao } = useAuth();
const { carregar: carregarNotificacoes } = useNotificacoes();

const nomeUsuario = computed(() => usuario.value?.nome ?? '');
const podeVerNotificacoes = computed(() =>
  possuiPermissao(Permissoes.Notificacoes.Visualizar),
);
const drawerWidth = computed(() =>
  sidebarCollapsed.value ? 72 : 260,
);

function lerCollapsePersistido(): boolean {
  try {
    return localStorage.getItem(STORAGE_SIDEBAR_COLLAPSED) === '1';
  } catch {
    return false;
  }
}

function alternarCollapse(): void {
  sidebarCollapsed.value = !sidebarCollapsed.value;
  try {
    localStorage.setItem(
      STORAGE_SIDEBAR_COLLAPSED,
      sidebarCollapsed.value ? '1' : '0',
    );
  } catch {
    /* ignore */
  }
}

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
  sidebarCollapsed.value = lerCollapsePersistido();
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

.main-layout__drawer :deep(.q-drawer__content) {
  overflow: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.main-layout__drawer :deep(.q-drawer__content::-webkit-scrollbar) {
  display: none;
}

.main-layout__drawer-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.main-layout__drawer-brand {
  border-bottom: var(--border-width-thin) solid var(--color-sidebar-border);
  display: grid;
  gap: var(--spacing-2);
  padding: var(--spacing-4);
}

.main-layout__drawer--collapsed .main-layout__drawer-brand {
  justify-items: center;
  padding: var(--spacing-3) var(--spacing-2);
}

.main-layout__user {
  display: grid;
  gap: var(--spacing-1);
}

.main-layout__user-name {
  color: var(--color-sidebar-text);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.main-layout__collapse-btn {
  align-items: center;
  background: transparent;
  border: none;
  border-top: var(--border-width-thin) solid var(--color-sidebar-border);
  color: var(--color-sidebar-text-muted);
  cursor: pointer;
  display: flex;
  flex-shrink: 0;
  height: 48px;
  justify-content: center;
  transition: var(--transition-color);
  width: 100%;
}

.main-layout__collapse-btn:hover {
  color: var(--color-sidebar-accent);
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

.main-layout__user-menu {
  align-items: center;
  color: var(--color-text-secondary);
  display: inline-flex;
  gap: var(--spacing-2);
  max-width: 180px;
}

.main-layout__user-menu-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

  .main-layout__user-menu-name {
    display: none;
  }
}
</style>
