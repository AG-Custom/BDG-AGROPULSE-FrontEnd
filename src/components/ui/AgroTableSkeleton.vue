<template>
  <div class="agro-table-skeleton" role="status" aria-label="Carregando dados">
    <div class="agro-table-skeleton__header">
      <q-skeleton
        v-for="coluna in colunas"
        :key="`header-${coluna}`"
        type="text"
        width="60%"
        animation="fade"
      />
    </div>
    <div v-for="linha in linhas" :key="`row-${linha}`" class="agro-table-skeleton__row">
      <q-skeleton
        v-for="coluna in colunas"
        :key="`cell-${linha}-${coluna}`"
        type="text"
        :width="coluna === 1 ? '80%' : '50%'"
        animation="fade"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    linhas?: number;
    colunas?: number;
  }>(),
  {
    linhas: 5,
    colunas: 5,
  },
);
</script>

<style scoped>
.agro-table-skeleton {
  border: var(--border-width-thin) solid var(--color-border-default);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.agro-table-skeleton__header,
.agro-table-skeleton__row {
  align-items: center;
  display: grid;
  gap: var(--spacing-4);
  grid-template-columns: repeat(v-bind(colunas), 1fr);
  min-height: 52px;
  padding: 0 var(--spacing-4);
}

.agro-table-skeleton__header {
  background: var(--color-bg-subtle);
  border-bottom: var(--border-width-thin) solid var(--color-border-default);
}

.agro-table-skeleton__row + .agro-table-skeleton__row {
  border-top: var(--border-width-thin) solid var(--color-border-default);
}
</style>
