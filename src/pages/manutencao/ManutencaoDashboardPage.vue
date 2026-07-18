<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Dashboard de manutenção"
      subtitulo="Visão geral de ativos, preventiva e ordens de serviço."
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
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <agro-card>
              <div class="text-caption">Atalhos</div>
              <div class="atalhos">
                <agro-btn flat color="primary" label="Ativos" descricao="Ir para ativos" :to="{ name: 'manutencao-ativos' }" />
                <agro-btn flat color="primary" label="Planos" descricao="Ir para planos" :to="{ name: 'manutencao-planos' }" />
                <agro-btn flat color="primary" label="Ordens" descricao="Ir para OS" :to="{ name: 'manutencao-ordens' }" />
                <agro-btn flat color="primary" label="Custos" descricao="Ir para custos" :to="{ name: 'manutencao-custos' }" />
              </div>
            </agro-card>
          </div>
        </div>
      </template>
      <empty-state
        v-else
        titulo="Sem dados"
        descricao="Não foi possível carregar o dashboard."
        icon="build"
      />
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useManutencao } from 'composables/useManutencao';
import { computed, onMounted } from 'vue';

const { dashboard, carregando, carregarDashboard } = useManutencao();

const kpis = computed(() => {
  const d = dashboard.value;
  if (!d) return [];
  return [
    { label: 'Total de ativos', valor: String(d.totalAtivos) },
    { label: 'Operacionais', valor: String(d.ativosOperacionais) },
    { label: 'Em manutenção', valor: String(d.ativosEmManutencao) },
    { label: 'OS abertas', valor: String(d.ordensAbertas) },
    { label: 'Planos vencidos', valor: String(d.planosVencidos) },
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
