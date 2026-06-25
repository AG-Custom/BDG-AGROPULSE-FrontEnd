<template>
  <q-page class="agro-page">
    <app-page-header titulo="Painel AgroPulse" subtitulo="Visão geral da operação agrícola." />

    <section class="agro-section dashboard-grid">
      <metric-tile label="Clientes" value="0" />
      <metric-tile label="Produtos" value="0" />
      <metric-tile label="Pedidos" value="0" />
      <metric-tile label="Safras" value="0" />
    </section>
  </q-page>
</template>

<script setup lang="ts">
import MetricTile from 'components/ui/MetricTile.vue';
</script>

<style scoped>
.dashboard-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}
</style>
