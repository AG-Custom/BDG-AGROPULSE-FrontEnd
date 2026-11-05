<template>
  <span class="status-pill" :class="`status-pill--${tom}`">{{ rotulo }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  tipo: 'situacao' | 'manifestacao';
  codigo: string | null;
}>();

const situacoes: Record<string, string> = {
  autorizada: 'Autorizada',
  cancelada: 'Cancelada',
  denegada: 'Denegada',
};

const manifestacoes: Record<string, string> = {
  ciencia: 'Ciência',
  confirmacao: 'Confirmação',
  desconhecimento: 'Desconhecimento',
  nao_realizada: 'Não realizada',
};

const rotulo = computed(() => {
  if (props.tipo === 'situacao') {
    const codigo = props.codigo ?? '';
    return situacoes[codigo.toLowerCase()] ?? (codigo || '—');
  }
  if (!props.codigo) return 'Sem manifestação';
  return manifestacoes[props.codigo] ?? props.codigo;
});

const tom = computed(() => {
  if (props.tipo === 'situacao') {
    const chave = (props.codigo ?? '').toLowerCase();
    if (chave === 'autorizada' || chave === 'cancelada' || chave === 'denegada') return chave;
    return 'neutra';
  }
  if (!props.codigo) return 'pendente';
  if (props.codigo === 'nao_realizada') return 'nao-realizada';
  if (props.codigo in manifestacoes) return props.codigo;
  return 'neutra';
});
</script>

<style scoped>
.status-pill {
  border-radius: var(--radius-full);
  color: var(--color-text-inverse);
  display: inline-flex;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  letter-spacing: var(--letter-spacing-wide);
  line-height: 1.2;
  padding: var(--spacing-2) var(--spacing-3);
  white-space: nowrap;
}

.status-pill--autorizada,
.status-pill--confirmacao {
  background: var(--color-success-500);
}

.status-pill--cancelada,
.status-pill--denegada,
.status-pill--desconhecimento {
  background: var(--color-error-500);
}

.status-pill--pendente {
  background: var(--color-warning-700);
}

.status-pill--ciencia {
  background: var(--color-info-500);
}

.status-pill--nao-realizada {
  background: var(--color-accent-700);
}

.status-pill--neutra {
  background: var(--color-neutral-700);
}
</style>
