<template>
  <relatorio-page-shell
    titulo="Giro de Estoque"
    subtitulo="Tempo médio que cada produto leva para ser vendido."
  >
    <giro-estoque-tab />
  </relatorio-page-shell>
</template>

<script setup lang="ts">
import GiroEstoqueTab from 'components/relatorios/GiroEstoqueTab.vue';
import RelatorioPageShell from 'components/relatorios/RelatorioPageShell.vue';
</script>
