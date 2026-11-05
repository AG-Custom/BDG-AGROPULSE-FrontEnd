<template>
  <div
    class="sidebar-secoes"
    :class="{ 'sidebar-secoes--flutuante': flutuante }"
    role="group"
    :aria-label="`Seções de ${rotuloModulo}`"
  >
    <q-item
      v-for="secao in secoes"
      :key="secao.id"
      v-close-popup="flutuante"
      clickable
      v-ripple
      :to="{ name: secao.routeNameDestino }"
      active-class=""
      exact-active-class=""
      class="sidebar-secoes__item"
      :class="{ 'sidebar-secoes__item--ativo': secao.id === secaoAtivaId }"
      :aria-label="secao.label"
      :aria-current="secao.id === secaoAtivaId ? 'page' : undefined"
      @click="emit('selecionar')"
    >
      <q-item-section avatar class="sidebar-secoes__icone">
        <q-icon :name="secao.icon" size="18px" />
      </q-item-section>
      <q-item-section class="sidebar-secoes__label">
        {{ secao.label }}
      </q-item-section>
    </q-item>
  </div>
</template>

<script setup lang="ts">
import type { SecaoNavegacaoVisivel } from 'composables/useNavegacaoModulos';

defineProps<{
  secoes: SecaoNavegacaoVisivel[];
  secaoAtivaId: string | null;
  rotuloModulo: string;
  flutuante?: boolean;
}>();

const emit = defineEmits<{
  selecionar: [];
}>();
</script>

<style scoped>
.sidebar-secoes {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
  margin: 0 0 var(--spacing-1) var(--spacing-5);
  padding-left: var(--spacing-2);
  border-left: var(--border-width-thin) solid var(--color-sidebar-border);
}

.sidebar-secoes--flutuante {
  border-left: 0;
  margin: 0;
  min-width: 200px;
  padding: var(--spacing-2);
}

.sidebar-secoes__item {
  border-radius: var(--radius-md);
  color: var(--color-sidebar-text-secondary);
  min-height: 36px;
  padding: var(--spacing-1) var(--spacing-3);
  transition: var(--transition-bg), var(--transition-color);
}

.sidebar-secoes__item:hover {
  background: var(--color-sidebar-item-hover);
  color: var(--color-sidebar-text);
}

.sidebar-secoes__icone {
  min-width: 26px;
  padding-right: var(--spacing-2);
}

.sidebar-secoes__icone :deep(.q-icon) {
  color: var(--color-sidebar-text-muted);
}

.sidebar-secoes__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.sidebar-secoes__item--ativo {
  background: var(--color-sidebar-item-active-bg);
  color: var(--color-sidebar-item-active-text);
}

.sidebar-secoes__item--ativo .sidebar-secoes__icone :deep(.q-icon) {
  color: var(--color-sidebar-accent);
}
</style>
