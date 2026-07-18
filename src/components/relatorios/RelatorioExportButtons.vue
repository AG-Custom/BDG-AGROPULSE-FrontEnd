<template>
  <div class="relatorio-export-btns">
    <agro-btn
      flat
      dense
      icon="table_view"
      label="Excel"
      descricao="Exportar para Excel"
      :loading="loading"
      @click="$emit('exportar', 'excel')"
    />
    <agro-btn
      flat
      dense
      icon="picture_as_pdf"
      label="PDF"
      descricao="Exportar para PDF"
      :loading="loading"
      @click="$emit('exportar', 'pdf')"
    />
  </div>
</template>

<script setup lang="ts">
import type { ExportacaoFormatoValor } from 'constants/enums';

defineProps<{
  loading?: boolean;
}>();

defineEmits<{
  exportar: [formato: ExportacaoFormatoValor];
}>();
</script>

<style scoped>
.relatorio-export-btns {
  display: flex;
  gap: var(--spacing-2);
  flex-wrap: wrap;
}
</style>
