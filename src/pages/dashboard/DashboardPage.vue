<template>
  <q-page class="agro-page">
    <app-page-header titulo="Painel AgroPulse" subtitulo="Visão geral da operação agrícola." />

    <section class="agro-section dashboard-grid">
      <metric-tile icon="groups" label="Clientes" value="0" trend="+12%" />
      <metric-tile icon="inventory_2" label="Produtos" value="0" />
      <metric-tile icon="shopping_cart" label="Pedidos" value="0" trend="+5%" />
      <metric-tile icon="agriculture" label="Safras" value="0" trend="Safra ativa" accent />
    </section>

    <section class="agro-section">
      <agro-card>
        <template #header>
          <div class="dashboard-section-header">
            <span class="text-h3">Atividade recente</span>
            <agro-badge label="Em breve" variant="info" />
          </div>
        </template>
        <empty-state
          titulo="Nenhuma atividade ainda"
          descricao="Quando você começar a operar, os últimos eventos aparecerão aqui."
          icon="timeline"
        >
          <q-btn color="primary" unelevated label="Explorar funcionalidades" disable />
        </empty-state>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import MetricTile from 'components/ui/MetricTile.vue';
</script>

<style scoped>
.dashboard-grid {
  display: grid;
  gap: var(--spacing-4);
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.dashboard-section-header {
  align-items: center;
  display: flex;
  gap: var(--spacing-3);
  justify-content: space-between;
}
</style>
