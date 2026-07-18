<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Dashboard CRM Agrícola"
      subtitulo="Visitas, pipeline, amostras, crédito e campanhas."
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
          <div class="col-12 col-md-6">
            <agro-card>
              <div class="text-caption">Atalhos</div>
              <div class="atalhos">
                <agro-btn
                  flat
                  color="primary"
                  label="Carteira"
                  descricao="Ir para carteira"
                  :to="{ name: 'crm-carteira' }"
                />
                <agro-btn
                  flat
                  color="primary"
                  label="Oportunidades"
                  descricao="Ir para oportunidades"
                  :to="{ name: 'crm-oportunidades' }"
                />
                <agro-btn
                  flat
                  color="primary"
                  label="Amostras"
                  descricao="Ir para amostras"
                  :to="{ name: 'crm-amostras' }"
                />
                <agro-btn
                  flat
                  color="primary"
                  label="Campanhas"
                  descricao="Ir para campanhas"
                  :to="{ name: 'crm-campanhas' }"
                />
                <agro-btn
                  flat
                  color="primary"
                  label="Crédito"
                  descricao="Ir para crédito"
                  :to="{ name: 'crm-credito' }"
                />
                <agro-btn
                  flat
                  color="primary"
                  label="Visitas técnicas"
                  descricao="Ir para visitas"
                  :to="{ name: 'safras-visitas-tecnicas' }"
                />
              </div>
            </agro-card>
          </div>
        </div>
      </template>
      <empty-state
        v-else
        titulo="Sem dados"
        descricao="Não foi possível carregar o dashboard."
        icon="groups"
      />
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useCrm } from 'composables/useCrm';
import { formatarMoeda } from 'utils/formatters';
import { computed, onMounted } from 'vue';

const { dashboard, carregando, carregarDashboard } = useCrm();

const kpis = computed(() => {
  const d = dashboard.value;
  if (!d) return [];
  return [
    { label: 'Visitas no mês', valor: String(d.visitasMes) },
    { label: 'Oportunidades abertas', valor: String(d.oportunidadesAbertas) },
    { label: 'Valor do pipeline', valor: formatarMoeda(d.valorPipeline) },
    { label: 'Amostras ativas', valor: String(d.amostrasAtivas) },
    {
      label: 'Conversão de amostras',
      valor: `${d.conversaoAmostrasPct}%`,
    },
    {
      label: 'Score médio de crédito',
      valor: d.scoreMedioCredito != null ? String(d.scoreMedioCredito) : '—',
    },
    { label: 'Campanhas ativas', valor: String(d.campanhasAtivas) },
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
