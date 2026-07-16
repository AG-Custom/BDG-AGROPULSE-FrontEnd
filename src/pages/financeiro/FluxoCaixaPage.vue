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
              <span class="label">Saldo inicial</span>
              <span class="text-metric valor">{{ formatarMoeda(fluxo.saldoInicial) }}</span>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="resumo-item">
              <span class="label">Saldo final</span>
              <span class="text-metric valor">{{ formatarMoeda(fluxo.saldoFinal) }}</span>
            </div>
          </div>
        </div>

        <agro-table-skeleton v-if="carregando && !fluxo" :colunas="5" />
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
          <template #body-cell-entradas="props">
            <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.entradas) }}</q-td>
          </template>
          <template #body-cell-saidas="props">
            <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.saidas) }}</q-td>
          </template>
          <template #body-cell-saldo="props">
            <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.saldo) }}</q-td>
          </template>
          <template #body-cell-projetado="props">
            <q-td :props="props">
              <agro-badge
                v-if="props.row.projetado"
                label="Projetado"
                variant="info"
              />
              <span v-else>—</span>
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import FiltroEscopoSelect from 'components/financeiro/FiltroEscopoSelect.vue';
import AgroBadge from 'components/ui/AgroBadge.vue';
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
import { onMounted, ref } from 'vue';

const { fluxo, carregando, carregar } = useFluxoCaixa();
const filtroEscopo = ref<EscopoFinanceiroValor | null>(EscopoFinanceiro.Unidade);
const filtroPeriodo = ref<PeriodoFluxoCaixaValor>(PeriodoFluxoCaixa.Diario);
const filtroDias = ref(30);

const colunas: QTableColumn<FluxoCaixaItemDto>[] = [
  { name: 'data', label: 'Data', field: 'data', align: 'left' },
  { name: 'entradas', label: 'Entradas', field: 'entradas', align: 'right' },
  { name: 'saidas', label: 'Saídas', field: 'saidas', align: 'right' },
  { name: 'saldo', label: 'Saldo', field: 'saldo', align: 'right' },
  { name: 'projetado', label: 'Tipo', field: 'projetado', align: 'left' },
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
