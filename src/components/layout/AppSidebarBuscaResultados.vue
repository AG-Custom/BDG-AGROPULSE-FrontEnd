<template>
  <p v-if="resultados.length === 0" class="sidebar-busca-resultados__vazio" role="status">
    Nenhum item encontrado para “{{ termo }}”.
  </p>
  <section v-for="grupo in resultados" :key="grupo.moduloId" class="sidebar-busca-resultados__grupo">
    <p class="sidebar-busca-resultados__local">
      <q-icon :name="grupo.moduloIcon" size="16px" />
      <span>{{ rotuloLocal(grupo) }}</span>
    </p>
    <router-link
      v-for="item in grupo.itens"
      :key="chaveItem(item)"
      v-close-popup
      :to="destino(item)"
      class="sidebar-busca-resultados__item"
      :aria-label="`${item.label}, em ${rotuloLocal(grupo)}`"
      @click="emit('abrir', grupo.moduloId)"
    >
      {{ item.label }}
    </router-link>
  </section>
</template>

<script setup lang="ts">
import type { ItemNavegacao } from 'constants/navegacao-modulos';
import type { ResultadoBuscaMenu } from 'utils/navegacao-busca';
import type { RouteLocationRaw } from 'vue-router';

defineProps<{
  resultados: ResultadoBuscaMenu[];
  termo: string;
}>();

const emit = defineEmits<{
  abrir: [moduloId: string];
}>();

function rotuloLocal(grupo: ResultadoBuscaMenu): string {
  if (!grupo.grupoLabel || grupo.grupoLabel === grupo.moduloLabel) {
    return grupo.moduloLabel;
  }
  return `${grupo.grupoLabel} · ${grupo.moduloLabel}`;
}

function chaveItem(item: ItemNavegacao): string {
  if (!item.query) return item.routeName;
  return `${item.routeName}?${new URLSearchParams(item.query).toString()}`;
}

function destino(item: ItemNavegacao): RouteLocationRaw {
  return item.query ? { name: item.routeName, query: item.query } : { name: item.routeName };
}
</script>

<style scoped>
.sidebar-busca-resultados__vazio {
  color: var(--color-sidebar-text-muted);
  font-size: var(--font-size-sm);
  margin: var(--spacing-3) var(--spacing-2);
}

.sidebar-busca-resultados__grupo {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
  margin-top: var(--spacing-3);
}

.sidebar-busca-resultados__local {
  align-items: center;
  color: var(--color-sidebar-accent);
  display: flex;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  gap: var(--spacing-2);
  letter-spacing: 0.04em;
  margin: 0;
  padding: 0 var(--spacing-3);
  text-transform: uppercase;
}

.sidebar-busca-resultados__item {
  border-radius: var(--radius-md);
  color: var(--color-sidebar-text);
  display: block;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  padding: var(--spacing-2) var(--spacing-3);
  text-decoration: none;
}

.sidebar-busca-resultados__item:hover {
  background: var(--color-sidebar-item-hover);
}
</style>
