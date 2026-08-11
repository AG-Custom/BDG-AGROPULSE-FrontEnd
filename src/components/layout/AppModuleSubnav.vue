<template>
  <nav v-if="mostrarSubnav" class="app-module-subnav" aria-label="Subnavegação do módulo">
    <div class="app-module-subnav__scroll">
      <router-link
        v-for="item in filhosVisiveis"
        :key="chaveItem(item)"
        :to="destinoItem(item)"
        class="app-module-subnav__link"
        :class="{ 'app-module-subnav__link--active': filhoAtivo(item) }"
        @click="onFilhoClick"
      >
        {{ item.label }}
      </router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useNavegacaoModulos } from 'composables/useNavegacaoModulos';
import type { ItemNavegacao } from 'constants/navegacao-modulos';
import type { RouteLocationRaw } from 'vue-router';

const {
  filhosVisiveis,
  mostrarSubnav,
  filhoAtivo,
  moduloAtivo,
  definirModuloPreferido,
} = useNavegacaoModulos();

function chaveItem(item: ItemNavegacao): string {
  if (!item.query) {
    return item.routeName;
  }
  return `${item.routeName}?${new URLSearchParams(item.query).toString()}`;
}

function destinoItem(item: ItemNavegacao): RouteLocationRaw {
  return item.query
    ? { name: item.routeName, query: item.query }
    : { name: item.routeName };
}

function onFilhoClick(): void {
  if (moduloAtivo.value) {
    definirModuloPreferido(moduloAtivo.value.id);
  }
}
</script>

<style scoped>
.app-module-subnav {
  background: var(--color-surface-default);
  border-bottom: var(--border-width-thin) solid var(--color-border-strong);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-2) var(--page-padding);
  position: sticky;
  top: var(--subnav-sticky-top, var(--header-height));
  z-index: var(--z-index-sticky);
}

.app-module-subnav__scroll {
  display: flex;
  gap: var(--spacing-1);
  overflow-x: auto;
  scrollbar-width: thin;
}

.app-module-subnav__link {
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  flex-shrink: 0;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  padding: var(--spacing-2) var(--spacing-3);
  text-decoration: none;
  transition: var(--transition-color), background-color var(--duration-fast) ease;
  white-space: nowrap;
}

.app-module-subnav__link:hover {
  background: var(--color-bg-subtle);
  color: var(--color-text-primary);
}

.app-module-subnav__link--active {
  background: var(--color-primary-50);
  color: var(--color-primary-700);
  font-weight: var(--font-weight-semibold);
}
</style>
