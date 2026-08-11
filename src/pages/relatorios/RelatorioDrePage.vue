<template>
  <relatorio-page-shell
    titulo="DRE Gerencial"
    subtitulo="Demonstrativo de resultado da operação no período."
  >
    <dre-tab />
  </relatorio-page-shell>
</template>

<script setup lang="ts">
import DreTab from 'components/relatorios/DreTab.vue';
import RelatorioPageShell from 'components/relatorios/RelatorioPageShell.vue';
</script>
