<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="OEE de campo"
      subtitulo="Disponibilidade, performance e qualidade agrícola."
    />

    <section class="agro-section">
      <agro-card>
        <div class="agro-filter-bar">
          <q-input
            v-model.number="mes"
            outlined
            dense
            type="number"
            label="Mês"
            class="filtro"
            min="1"
            max="12"
          />
          <q-input
            v-model.number="ano"
            outlined
            dense
            type="number"
            label="Ano"
            class="filtro"
            min="2020"
          />
          <agro-btn
            color="primary"
            unelevated
            label="Atualizar"
            descricao="Carregar OEE campo"
            :loading="carregando"
            @click="carregar(mes, ano)"
          />
        </div>

        <agro-form-skeleton v-if="carregando && !oee" :campos="4" />
        <empty-state
          v-else-if="!carregando && !oee"
          titulo="Sem dados de OEE"
          descricao="Não há dados suficientes para o período."
          icon="speed"
        />
        <div v-else-if="oee" class="metricas-wrap">
          <div class="metricas">
            <div class="metrica">
              <div class="text-caption">Disponibilidade</div>
              <div class="text-metric valor">{{ formatarDecimal(oee.disponibilidade) }}%</div>
            </div>
            <div class="metrica">
              <div class="text-caption">Performance</div>
              <div class="text-metric valor">{{ formatarDecimal(oee.performance) }}%</div>
            </div>
            <div class="metrica">
              <div class="text-caption">Qualidade</div>
              <div class="text-metric valor">{{ formatarDecimal(oee.qualidade) }}%</div>
            </div>
            <div class="metrica destaque">
              <div class="text-caption">OEE</div>
              <div class="text-metric valor">{{ formatarDecimal(oee.oee) }}%</div>
            </div>
          </div>
          <p v-if="oee.heuristica" class="heuristica text-caption">{{ oee.heuristica }}</p>
        </div>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useOeeCampo } from 'composables/useOeeCampo';
import { formatarDecimal } from 'utils/formatters';
import { onMounted, ref } from 'vue';

const { oee, carregando, carregar } = useOeeCampo();
const agora = new Date();
const mes = ref(agora.getMonth() + 1);
const ano = ref(agora.getFullYear());

onMounted(() => {
  void carregar(mes.value, ano.value);
});
</script>

<style scoped>
.filtro {
  max-width: 120px;
}
.metricas {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: var(--spacing-4);
  margin-top: var(--spacing-4);
}
.metrica {
  padding: var(--spacing-4);
  border: var(--border-width-thin) solid var(--color-border-default);
  border-radius: var(--radius-md);
}
.metrica.destaque {
  border-left: var(--border-width-accent) solid var(--color-primary-500);
}
.valor {
  font-size: var(--font-size-xl);
  margin-top: var(--spacing-2);
}
.heuristica {
  margin-top: var(--spacing-4);
  color: var(--color-text-secondary);
}
</style>
