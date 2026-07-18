<template>
  <div class="progresso">
    <div class="progresso__cabecalho">
      <span class="text-caption">Entrega física</span>
      <span class="text-metric">{{ percentual }}%</span>
    </div>
    <q-linear-progress
      :value="fracao"
      color="primary"
      track-color="grey-3"
      rounded
      size="8px"
    />
    <div class="progresso__detalhe text-caption text-secondary">
      Entregue
      <span class="text-metric">{{ formatarDecimal(entregue) }}</span>
      de
      <span class="text-metric">{{ formatarDecimal(comprometido) }}</span>
      · Saldo
      <span class="text-metric">{{ formatarDecimal(saldo) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatarDecimal } from 'utils/formatters';
import { computed } from 'vue';

const props = defineProps<{
  comprometido: number;
  entregue: number;
}>();

const saldo = computed(() => Math.max(0, props.comprometido - props.entregue));

const fracao = computed(() => {
  if (props.comprometido <= 0) return 0;
  return Math.min(1, props.entregue / props.comprometido);
});

const percentual = computed(() => Math.round(fracao.value * 100));
</script>

<style scoped>
.progresso {
  display: grid;
  gap: var(--spacing-2);
}

.progresso__cabecalho {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.progresso__detalhe {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-1);
}
</style>
