<template>
  <relatorio-page-shell
    titulo="Rentabilidade por Linha de Produto"
    subtitulo="Margem por categoria e dimensões comerciais, com visão por lote."
  >
    <q-tabs
      v-model="visao"
      dense
      class="text-primary"
      active-color="primary"
      indicator-color="primary"
    >
      <q-tab name="linha" label="Por dimensão" />
      <q-tab v-if="verCustos" name="lote" label="Margem por lote" />
    </q-tabs>
    <q-separator />
    <rentabilidade-tab v-if="visao === 'linha'" />
    <margem-por-lote-tab v-else-if="visao === 'lote'" />
  </relatorio-page-shell>
</template>

<script setup lang="ts">
import MargemPorLoteTab from 'components/relatorios/MargemPorLoteTab.vue';
import RelatorioPageShell from 'components/relatorios/RelatorioPageShell.vue';
import RentabilidadeTab from 'components/relatorios/RentabilidadeTab.vue';
import { useVerCustos } from 'composables/useVerCustos';
import { ref, watch } from 'vue';

const { verCustos } = useVerCustos();
const visao = ref<'linha' | 'lote'>('linha');

watch(verCustos, (ok) => {
  if (!ok && visao.value === 'lote') {
    visao.value = 'linha';
  }
});
</script>
