<template>
  <q-page class="agro-page">
    <app-page-header titulo="Campanha" :subtitulo="campanha?.nome ?? 'Detalhes e métricas'" />

    <section class="agro-section">
      <agro-form-skeleton v-if="carregando && !campanha" :campos="5" />
      <template v-else-if="campanha">
        <div class="row q-col-gutter-md q-mb-md">
          <div v-for="kpi in kpis" :key="kpi.label" class="col-6 col-md-3">
            <agro-card>
              <div class="text-caption">{{ kpi.label }}</div>
              <div class="text-metric kpi">{{ kpi.valor }}</div>
            </agro-card>
          </div>
        </div>

        <agro-card>
          <div class="row q-col-gutter-md">
            <div class="col-6 col-md-3">
              <div class="text-caption">Canal</div>
              <div>{{ rotuloCanal(campanha.tipoCanal) }}</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Status</div>
              <div>{{ rotuloStatus(campanha.status) }}</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Início</div>
              <div>{{ formatarData(campanha.dataInicio) || '—' }}</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Fim</div>
              <div>{{ formatarData(campanha.dataFim) || '—' }}</div>
            </div>
            <div class="col-12">
              <div class="text-caption">Segmento</div>
              <div>{{ campanha.segmento || '—' }}</div>
            </div>
          </div>
          <div class="agro-form-actions">
            <agro-btn flat label="Voltar" descricao="Voltar" :to="{ name: 'crm-campanhas' }" />
          </div>
        </agro-card>
      </template>
      <empty-state
        v-else
        titulo="Campanha não encontrada"
        descricao="Não foi possível carregar os dados."
        icon="campaign"
      />
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useCrm } from 'composables/useCrm';
import { StatusCampanhaOpcoes, TipoCanalCampanhaOpcoes } from 'constants/enums';
import { formatarData } from 'utils/formatters';
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const { campanha, carregando, obterCampanha } = useCrm();
const id = String(route.params.id);

const mapaCanal = computed(() => {
  const m = new Map<string, string>();
  for (const o of TipoCanalCampanhaOpcoes) m.set(o.value, o.label);
  return m;
});

const mapaStatus = computed(() => {
  const m = new Map<string, string>();
  for (const o of StatusCampanhaOpcoes) m.set(o.value, o.label);
  return m;
});

const kpis = computed(() => {
  const c = campanha.value;
  if (!c) return [];
  return [
    { label: 'Envios', valor: String(c.envios) },
    { label: 'Aberturas', valor: String(c.aberturas) },
    { label: 'Respostas', valor: String(c.respostas) },
    { label: 'Conversões', valor: String(c.conversoes) },
  ];
});

function rotuloCanal(canal: string): string {
  return mapaCanal.value.get(canal) ?? canal;
}

function rotuloStatus(status: string): string {
  return mapaStatus.value.get(status) ?? status;
}

onMounted(() => {
  void obterCampanha(id);
});
</script>

<style scoped>
.kpi {
  font-size: var(--font-size-xl);
  margin-top: var(--spacing-1);
}
</style>
