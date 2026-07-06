<template>
  <q-layout view="hHh Lpr lFf" class="main-layout">
    <q-header class="main-layout__header">
      <q-toolbar class="main-layout__toolbar">
        <q-btn
          flat
          round
          dense
          icon="menu"
          aria-label="Alternar menu lateral"
          @click="drawer = !drawer"
        />
        <agro-logo size="sm" :show-text="false" class="main-layout__logo-mobile" />
        <q-space />
        <q-btn
          flat
          dense
          icon="logout"
          label="Sair"
          aria-label="Sair da conta"
          class="main-layout__logout"
          @click="sair"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" :width="260" class="main-layout__drawer">
      <div class="main-layout__drawer-brand">
        <agro-logo size="md" />
        <div v-if="usuario" class="main-layout__user">
          <div class="main-layout__user-name">{{ nomeUsuario }}</div>
          <div class="text-caption text-secondary">{{ usuario.email }}</div>
        </div>
      </div>
      <app-sidebar />
    </q-drawer>

    <q-page-container class="main-layout__content">
      <router-view :key="$route.name ?? $route.path" />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import AppSidebar from 'components/layout/AppSidebar.vue';
import AgroLogo from 'components/shared/AgroLogo.vue';
import { useAuth } from 'composables/useAuth';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const drawer = ref(true);
const router = useRouter();
const { sair: sairAuth, usuario } = useAuth();

const nomeUsuario = computed(() => usuario.value?.nome ?? '');

function sair(): void {
  sairAuth();
  void router.push({ name: 'login' });
}
</script>

<style scoped>
.main-layout__header {
  background: var(--color-surface-default);
  color: var(--color-text-primary);
}

.main-layout__toolbar {
  min-height: var(--header-height);
}

.main-layout__drawer {
  background: var(--color-neutral-50);
}

.main-layout__drawer-brand {
  border-bottom: var(--border-width-thin) solid var(--color-border-default);
  display: grid;
  gap: var(--spacing-3);
  padding: var(--spacing-5) var(--spacing-4);
}

.main-layout__user {
  display: grid;
  gap: var(--spacing-1);
}

.main-layout__user-name {
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
}

.main-layout__content {
  background: var(--color-bg-default);
  width: 100%;
}

.main-layout__logo-mobile {
  display: none;
}

.main-layout__logout {
  color: var(--color-text-secondary);
}

@media (max-width: 1023px) {
  .main-layout__logo-mobile {
    display: inline-flex;
    margin-left: var(--spacing-2);
  }
}
</style>
