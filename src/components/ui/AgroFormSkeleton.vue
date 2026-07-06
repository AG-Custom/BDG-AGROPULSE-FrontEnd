<template>
  <div class="agro-form-skeleton" role="status" aria-label="Carregando formulário">
    <div v-for="campo in campos" :key="`campo-${campo}`" class="agro-form-skeleton__field">
      <q-skeleton type="text" width="35%" animation="fade" />
      <q-skeleton type="QInput" animation="fade" />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    campos?: number;
  }>(),
  {
    campos: 6,
  },
);
</script>

<style scoped>
.agro-form-skeleton {
  display: grid;
  gap: var(--spacing-5);
  grid-template-columns: 1fr;
}

.agro-form-skeleton__field {
  display: grid;
  gap: var(--spacing-1);
}

@media (min-width: 960px) {
  .agro-form-skeleton {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
