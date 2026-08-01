<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Fluxo de caixa"
      subtitulo="Entradas, saídas e saldo diário, semanal ou projetado."
    />

    <section class="agro-section">
      <agro-card>
        <div class="agro-filter-bar q-mb-md row q-col-gutter-md">
          <div class="col-12 col-md-3">
            <filtro-escopo-select v-model="filtroEscopo" @update:model-value="carregarFluxo" />
          </div>
          <div class="col-12 col-md-3">
            <q-select
              v-model="filtroPeriodo"
              outlined
              dense
              emit-value
              map-options
              label="Período"
              :options="PeriodoFluxoCaixaOpcoes"
              @update:model-value="carregarFluxo"
            />
          </div>
          <div class="col-12 col-md-2">
            <q-input
              v-model.number="filtroDias"
              outlined
              dense
              type="number"
              label="Dias"
              @update:model-value="carregarFluxo"
            />
          </div>
        </div>

        <div v-if="fluxo" class="resumo row q-col-gutter-md q-mb-md">
          <div class="col-12 col-md-4">
            <div class="resumo-item">
              <span class="label">Saldo em contas</span>
              <span class="text-metric valor">{{ formatarMoeda(fluxo.saldoContas) }}</span>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="resumo-item">
              <span class="label">Saldo em caixas</span>
              <span class="text-metric valor">{{ formatarMoeda(fluxo.saldoCaixas) }}</span>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="resumo-item">
              <span class="label">Saldo total</span>
              <span class="text-metric valor">{{ formatarMoeda(saldoTotal) }}</span>
            </div>
          </div>
        </div>

        <agro-table-skeleton v-if="carregando && !fluxo" :colunas="4" />
        <empty-state
          v-else-if="!carregando && (!fluxo || fluxo.itens.length === 0)"
          titulo="Sem dados de fluxo"
          descricao="Não há movimentações no período selecionado."
          icon="waterfall_chart"
        />
        <q-table
          v-else-if="fluxo"
          flat
          bordered
          row-key="data"
          :rows="fluxo.itens"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[15, 30, 60]"
        >
          <template #body-cell-data="props">
            <q-td :props="props">{{ formatarData(props.row.data) }}</q-td>
          </template>
          <template #body-cell-entradasPrevistas="props">
            <q-td :props="props" class="text-metric">
              {{ formatarMoeda(props.row.entradasPrevistas) }}
            </q-td>
          </template>
          <template #body-cell-saidasPrevistas="props">
            <q-td :props="props" class="text-metric">
              {{ formatarMoeda(props.row.saidasPrevistas) }}
            </q-td>
          </template>
          <template #body-cell-saldoProjetado="props">
            <q-td :props="props" class="text-metric">
              {{ formatarMoeda(props.row.saldoProjetado) }}
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import FiltroEscopoSelect from 'components/financeiro/FiltroEscopoSelect.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useFluxoCaixa } from 'composables/useFluxoCaixa';
import {
  EscopoFinanceiro,
  PeriodoFluxoCaixa,
  PeriodoFluxoCaixaOpcoes,
  type EscopoFinanceiroValor,
  type PeriodoFluxoCaixaValor,
} from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { FluxoCaixaItemDto } from 'types/dtos/financeiro-gestao.dto';
import { formatarData, formatarMoeda } from 'utils/formatters';
import { computed, onMounted, ref } from 'vue';

const { fluxo, carregando, carregar } = useFluxoCaixa();
const filtroEscopo = ref<EscopoFinanceiroValor | null>(EscopoFinanceiro.Unidade);
const filtroPeriodo = ref<PeriodoFluxoCaixaValor>(PeriodoFluxoCaixa.Diario);
const filtroDias = ref(30);

const saldoTotal = computed(() =>
  fluxo.value ? fluxo.value.saldoContas + fluxo.value.saldoCaixas : 0,
);

const colunas: QTableColumn<FluxoCaixaItemDto>[] = [
  { name: 'data', label: 'Data', field: 'data', align: 'left' },
  { name: 'entradasPrevistas', label: 'Entradas', field: 'entradasPrevistas', align: 'right' },
  { name: 'saidasPrevistas', label: 'Saídas', field: 'saidasPrevistas', align: 'right' },
  { name: 'saldoProjetado', label: 'Saldo projetado', field: 'saldoProjetado', align: 'right' },
];

async function carregarFluxo(): Promise<void> {
  await carregar({
    escopo: filtroEscopo.value ?? undefined,
    periodo: filtroPeriodo.value,
    dias: filtroDias.value,
  });
}

onMounted(() => {
  void carregarFluxo();
});
</script>

<style scoped>
.resumo-item {
  border: var(--border-width-thin) solid var(--color-border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-4);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}
.label {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}
.valor {
  font-size: var(--font-size-lg);
}
</style>
