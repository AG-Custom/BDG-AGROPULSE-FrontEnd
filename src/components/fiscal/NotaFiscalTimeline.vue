<template>
  <ol class="timeline">
    <li v-for="item in itens" :key="item.id" class="timeline__item">
      <span class="timeline__marca" :class="`timeline__marca--${item.tom}`" />
      <div class="timeline__corpo">
        <p class="timeline__quando text-metric">{{ formatarDataHora(item.em) }}</p>
        <p class="timeline__titulo">{{ item.titulo }}</p>
        <p v-if="item.detalhe" class="timeline__detalhe">{{ item.detalhe }}</p>
      </div>
    </li>
  </ol>
</template>

<script setup lang="ts">
import type { LinhaTempoNota } from 'utils/nfe-timeline';
import { formatarDataHora } from 'utils/formatters';

defineProps<{
  itens: LinhaTempoNota[];
}>();
</script>

<style scoped>
.timeline {
  display: flex;
  flex-direction: column;
  list-style: none;
  margin: 0;
  padding: 0;
}

.timeline__item {
  display: grid;
  gap: var(--spacing-3);
  grid-template-columns: var(--spacing-4) 1fr;
  padding-bottom: var(--spacing-4);
  position: relative;
}

.timeline__item::before {
  background: var(--color-border-default);
  bottom: 0;
  content: '';
  left: calc(var(--spacing-2) - var(--border-width-thin));
  position: absolute;
  top: var(--spacing-4);
  width: var(--border-width-thin);
}

.timeline__item:last-child {
  padding-bottom: 0;
}

.timeline__item:last-child::before {
  display: none;
}

.timeline__marca {
  background: var(--color-surface-default);
  border: var(--border-width-medium) solid var(--color-border-strong);
  border-radius: var(--radius-full);
  height: var(--spacing-4);
  margin-top: var(--spacing-1);
  position: relative;
  width: var(--spacing-4);
  z-index: 1;
}

.timeline__marca--success {
  border-color: var(--color-success-500);
}

.timeline__marca--warning {
  border-color: var(--color-warning-500);
}

.timeline__marca--error {
  border-color: var(--color-error-500);
}

.timeline__marca--info {
  border-color: var(--color-primary-500);
}

.timeline__quando {
  color: var(--color-text-secondary);
  font-size: var(--font-size-xs);
  margin: 0;
}

.timeline__titulo {
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  margin: var(--spacing-1) 0 0;
}

.timeline__detalhe {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  margin: var(--spacing-1) 0 0;
}
</style>
