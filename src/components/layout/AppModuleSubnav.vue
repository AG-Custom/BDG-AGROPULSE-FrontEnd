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
  border-bottom: var(--border-width-thin) solid var(--color-border-default);
  padding: 0 var(--page-padding);
}

.app-module-subnav__scroll {
  display: flex;
  gap: var(--spacing-1);
  overflow-x: auto;
  scrollbar-width: thin;
}

.app-module-subnav__link {
  color: var(--color-text-secondary);
  flex-shrink: 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  padding: var(--spacing-3) var(--spacing-3);
  position: relative;
  text-decoration: none;
  transition: var(--transition-color);
  white-space: nowrap;
}

.app-module-subnav__link:hover {
  color: var(--color-text-primary);
}

.app-module-subnav__link--active {
  color: var(--color-primary-600);
}

.app-module-subnav__link--active::after {
  background: var(--color-primary-500);
  bottom: 0;
  content: '';
  height: var(--border-width-accent);
  left: var(--spacing-2);
  position: absolute;
  right: var(--spacing-2);
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
}
</style>
