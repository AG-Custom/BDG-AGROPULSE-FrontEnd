<template>
  <q-layout view="hHh lpR fFf" class="onboarding-layout">
    <q-header class="onboarding-layout__header">
      <q-toolbar class="onboarding-layout__toolbar">
        <agro-logo size="sm" />
        <q-space />
        <agro-btn
          flat
          dense
          icon="logout"
          label="Sair"
          descricao="Encerrar sessão e voltar ao login"
          class="onboarding-layout__logout"
          @click="sair"
        />
      </q-toolbar>
    </q-header>

    <q-page-container class="onboarding-layout__content">
      <router-view :key="$route.name ?? $route.path" />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import AgroLogo from 'components/shared/AgroLogo.vue';
import { useAuth } from 'composables/useAuth';
import { useRouter } from 'vue-router';

const router = useRouter();
const { sair: sairAuth } = useAuth();

async function sair(): Promise<void> {
  await sairAuth();
  await router.push({ name: 'login' });
}
</script>

<style scoped>
.onboarding-layout__header {
  background: var(--color-surface-default);
  border-bottom: var(--border-width-thin) solid var(--color-border-default);
  color: var(--color-text-primary);
}

.onboarding-layout__toolbar {
  min-height: var(--header-height);
}

.onboarding-layout__content {
  background: var(--color-bg-default);
}

.onboarding-layout__logout {
  color: var(--color-text-secondary);
}
</style>
