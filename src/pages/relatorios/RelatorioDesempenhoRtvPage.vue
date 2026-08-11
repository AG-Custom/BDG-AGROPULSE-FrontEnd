<template>
  <relatorio-page-shell
    titulo="Desempenho por RTV"
    subtitulo="Metas, conversão, volume, ticket médio e comissões por vendedor."
  >
    <q-tabs
      v-model="visao"
      dense
      class="text-primary"
      active-color="primary"
      indicator-color="primary"
    >
      <q-tab name="desempenho" label="Desempenho" />
      <q-tab name="comissoes" label="Comissões" />
    </q-tabs>
    <q-separator />
    <desempenho-equipe-tab v-if="visao === 'desempenho'" />
    <comissoes-tab v-else />
  </relatorio-page-shell>
</template>

<script setup lang="ts">
import ComissoesTab from 'components/relatorios/ComissoesTab.vue';
import DesempenhoEquipeTab from 'components/relatorios/DesempenhoEquipeTab.vue';
import RelatorioPageShell from 'components/relatorios/RelatorioPageShell.vue';
import { ref } from 'vue';

const visao = ref<'desempenho' | 'comissoes'>('desempenho');
</script>
