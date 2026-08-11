<template>
  <relatorio-page-shell
    titulo="Mapa de Inadimplência e Risco"
    subtitulo="Atrasos, limite de crédito comprometido e risco comercial."
  >
    <inadimplencia-tab />
  </relatorio-page-shell>
</template>

<script setup lang="ts">
import InadimplenciaTab from 'components/relatorios/InadimplenciaTab.vue';
import RelatorioPageShell from 'components/relatorios/RelatorioPageShell.vue';
</script>
