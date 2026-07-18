<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Dashboard de logística"
      subtitulo="Frota, cargas em rota, romaneios e alertas de documentos."
    />

    <section class="agro-section">
      <agro-form-skeleton v-if="carregando && !dashboard" :campos="4" />
      <template v-else-if="dashboard">
        <div class="row q-col-gutter-md q-mb-md">
          <div v-for="item in kpis" :key="item.label" class="col-6 col-md-4">
            <agro-card>
              <div class="text-caption">{{ item.label }}</div>
              <div class="text-metric kpi-valor">{{ item.valor }}</div>
            </agro-card>
          </div>
        </div>
        <agro-card>
          <div class="text-caption">Atalhos</div>
          <div class="atalhos">
            <agro-btn flat color="primary" label="Frota" descricao="Ir para frota" :to="{ name: 'logistica-veiculos' }" />
            <agro-btn flat color="primary" label="Cargas" descricao="Ir para cargas" :to="{ name: 'logistica-cargas' }" />
            <agro-btn flat color="primary" label="Romaneios" descricao="Ir para romaneios" :to="{ name: 'logistica-romaneios' }" />
            <agro-btn flat color="primary" label="Custos" descricao="Ir para custos" :to="{ name: 'logistica-custos' }" />
          </div>
        </agro-card>
      </template>
      <empty-state
        v-else
        titulo="Sem dados"
        descricao="Não foi possível carregar o dashboard."
        icon="local_shipping"
      />
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useLogistica } from 'composables/useLogistica';
import { computed, onMounted } from 'vue';

const { dashboard, carregando, carregarDashboard } = useLogistica();

const kpis = computed(() => {
  const d = dashboard.value;
  if (!d) return [];
  return [
    { label: 'Total de veículos', valor: String(d.totalVeiculos) },
    { label: 'Disponíveis', valor: String(d.veiculosDisponiveis) },
    { label: 'Veículos em rota', valor: String(d.veiculosEmRota) },
    { label: 'Cargas em rota', valor: String(d.cargasEmRota) },
    { label: 'Romaneios pendentes', valor: String(d.romaneiosPendentes) },
    { label: 'Alertas de documentos', valor: String(d.alertasDocumentos) },
  ];
});

onMounted(() => {
  void carregarDashboard();
});
</script>

<style scoped>
.kpi-valor {
  font-size: var(--font-size-xl);
  margin-top: var(--spacing-1);
}
.atalhos {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
  margin-top: var(--spacing-2);
}
</style>
