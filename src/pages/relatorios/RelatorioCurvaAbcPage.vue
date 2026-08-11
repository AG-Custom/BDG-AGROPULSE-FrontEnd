<template>
  <relatorio-page-shell
    titulo="Curva ABC de Vendas"
    subtitulo="Classificação por volume de faturamento e margem de lucro."
  >
    <curva-abc-tab />
  </relatorio-page-shell>
</template>

<script setup lang="ts">
import CurvaAbcTab from 'components/relatorios/CurvaAbcTab.vue';
import RelatorioPageShell from 'components/relatorios/RelatorioPageShell.vue';
</script>
