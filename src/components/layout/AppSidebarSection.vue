<template>
  <q-expansion-item
    v-model="aberto"
    group="sidebar-modulos"
    :icon="icon"
    :label="label"
    dense
    class="app-sidebar-section"
    header-class="app-sidebar-section__header"
    expand-icon-class="app-sidebar-section__expand-icon"
  >
    <q-list class="app-sidebar-section__list">
      <slot />
    </q-list>
  </q-expansion-item>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps<{
  label: string;
  icon?: string;
  /** Prefixo(s) de path que mantêm a seção aberta (ex.: '/estoque'). Use '/' só para o Dashboard. */
  rotasAtivas?: string | string[];
  defaultOpened?: boolean;
}>();

const route = useRoute();
const aberto = ref(props.defaultOpened === true);

function pathCorresponde(prefixo: string): boolean {
  if (prefixo === '/') {
    return route.path === '/' || route.name === 'dashboard';
  }

  return route.path === prefixo || route.path.startsWith(`${prefixo}/`);
}

function rotaCorresponde(): boolean {
  if (!props.rotasAtivas) {
    return false;
  }

  const prefixes = Array.isArray(props.rotasAtivas) ? props.rotasAtivas : [props.rotasAtivas];
  return prefixes.some(pathCorresponde);
}

watch(
  () => route.fullPath,
  () => {
    if (rotaCorresponde()) {
      aberto.value = true;
    }
  },
  { immediate: true },
);
</script>

<style scoped>
.app-sidebar-section {
  margin-top: var(--spacing-1);
}

.app-sidebar-section :deep(.app-sidebar-section__header) {
  border-radius: var(--radius-md);
  color: var(--color-sidebar-text-muted);
  font-family: var(--font-family-display);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.06em;
  min-height: 40px;
  padding: var(--spacing-2) var(--spacing-3);
  text-transform: uppercase;
  transition: var(--transition-bg), var(--transition-color);
}

.app-sidebar-section :deep(.app-sidebar-section__header:hover) {
  background: var(--color-sidebar-item-hover);
  color: var(--color-sidebar-text);
}

.app-sidebar-section :deep(.q-expansion-item--expanded > .q-expansion-item__container > .app-sidebar-section__header) {
  color: var(--color-sidebar-text);
}

.app-sidebar-section :deep(.q-item__section--avatar) {
  min-width: 28px;
  padding-right: var(--spacing-2);
}

.app-sidebar-section :deep(.q-item__section--avatar .q-icon) {
  color: var(--color-sidebar-text-muted);
  font-size: 20px;
}

.app-sidebar-section :deep(.q-expansion-item--expanded > .q-expansion-item__container > .app-sidebar-section__header .q-item__section--avatar .q-icon) {
  color: var(--color-sidebar-accent);
}

.app-sidebar-section :deep(.app-sidebar-section__expand-icon) {
  color: var(--color-sidebar-text-muted);
  font-size: 18px;
}

.app-sidebar-section__list {
  padding: 0 var(--spacing-2) var(--spacing-2);
}
</style>
