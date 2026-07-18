<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Análise de crédito"
      :subtitulo="analise ? `Cliente ${analise.clienteId}` : 'Detalhes do score'"
    >
      <agro-btn
        color="primary"
        unelevated
        icon="refresh"
        label="Recalcular"
        descricao="Recalcular análise"
        :loading="salvando"
        :disable="!analise"
        @click="recalcular"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-form-skeleton v-if="carregando && !analise" :campos="5" />
      <template v-else-if="analise">
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
              <div class="text-caption">Status</div>
              <div>{{ rotuloStatus(analise.status) }}</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Classificação</div>
              <div>{{ analise.classificacao || '—' }}</div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Limite aprovado</div>
              <div class="text-metric">
                {{
                  analise.limiteAprovado != null
                    ? formatarMoeda(analise.limiteAprovado)
                    : '—'
                }}
              </div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Parcelas em atraso</div>
              <div class="text-metric">
                {{ analise.parcelasAtraso != null ? analise.parcelasAtraso : '—' }}
              </div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Adimplência</div>
              <div class="text-metric">
                {{
                  analise.adimplenciaPct != null ? `${analise.adimplenciaPct}%` : '—'
                }}
              </div>
            </div>
            <div class="col-6 col-md-3">
              <div class="text-caption">Analisado em</div>
              <div>{{ formatarDataHora(analise.analisadoEm) || '—' }}</div>
            </div>
            <div class="col-12">
              <div class="text-caption">Observações</div>
              <div>{{ analise.observacoes || '—' }}</div>
            </div>
          </div>
          <div class="agro-form-actions">
            <agro-btn flat label="Voltar" descricao="Voltar" :to="{ name: 'crm-credito' }" />
          </div>
        </agro-card>
      </template>
      <empty-state
        v-else
        titulo="Análise não encontrada"
        descricao="Não foi possível carregar os dados."
        icon="account_balance"
      />
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useCrm } from 'composables/useCrm';
import { StatusAnaliseCreditoOpcoes } from 'constants/enums';
import { formatarDataHora, formatarMoeda } from 'utils/formatters';
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const { analise, carregando, salvando, obterAnalise, recalcularAnalise } = useCrm();
const id = String(route.params.id);

const mapaStatus = computed(() => {
  const m = new Map<string, string>();
  for (const o of StatusAnaliseCreditoOpcoes) m.set(o.value, o.label);
  return m;
});

const kpis = computed(() => {
  const a = analise.value;
  if (!a) return [];
  return [
    { label: 'Score', valor: String(a.score) },
    { label: 'Limite sugerido', valor: formatarMoeda(a.limiteSugerido) },
    { label: 'Classe', valor: a.classificacao || '—' },
    { label: 'Status', valor: rotuloStatus(a.status) },
  ];
});

function rotuloStatus(status: string): string {
  return mapaStatus.value.get(status) ?? status;
}

async function recalcular(): Promise<void> {
  if (!analise.value) return;
  await recalcularAnalise(analise.value.clienteId);
}

onMounted(() => {
  void obterAnalise(id);
});
</script>

<style scoped>
.kpi {
  font-size: var(--font-size-xl);
  margin-top: var(--spacing-1);
}
</style>
