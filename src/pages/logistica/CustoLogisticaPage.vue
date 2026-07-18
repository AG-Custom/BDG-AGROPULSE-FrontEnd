<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Custo logístico"
      subtitulo="Abastecimento, pedágio e motorista por carga/região."
    />

    <section class="agro-section">
      <agro-card>
        <div class="agro-filter-bar q-mb-md">
          <q-select
            v-model="periodo"
            outlined
            dense
            label="Período"
            emit-value
            map-options
            :options="periodoOpcoes"
            class="filtro"
          />
          <agro-btn
            color="primary"
            unelevated
            label="Atualizar"
            descricao="Carregar relatório"
            :loading="carregando"
            @click="aplicar"
          />
        </div>

        <div v-if="custos" class="resumo q-mb-md row q-col-gutter-md">
          <div class="col-6 col-md-3">
            <div class="text-caption">Abastecimento</div>
            <div class="text-metric">{{ formatarMoeda(custos.totalAbastecimento) }}</div>
          </div>
          <div class="col-6 col-md-3">
            <div class="text-caption">Pedágio</div>
            <div class="text-metric">{{ formatarMoeda(custos.totalPedagio) }}</div>
          </div>
          <div class="col-6 col-md-3">
            <div class="text-caption">Motorista</div>
            <div class="text-metric">{{ formatarMoeda(custos.totalMotorista) }}</div>
          </div>
          <div class="col-6 col-md-3">
            <div class="text-caption">Total geral</div>
            <div class="text-metric total">{{ formatarMoeda(custos.totalGeral) }}</div>
          </div>
        </div>

        <agro-table-skeleton v-if="carregando && !custos" :colunas="5" />
        <empty-state
          v-else-if="!carregando && (!custos || custos.itens.length === 0)"
          titulo="Sem custos"
          descricao="Não há custos no período selecionado."
          icon="payments"
        />
        <q-table
          v-else-if="custos"
          flat
          bordered
          row-key="rowKey"
          :rows="linhas"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-custoAbastecimento="props">
            <q-td :props="props" class="text-metric">
              {{ formatarMoeda(props.row.custoAbastecimento) }}
            </q-td>
          </template>
          <template #body-cell-pedagio="props">
            <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.pedagio) }}</q-td>
          </template>
          <template #body-cell-custoMotorista="props">
            <q-td :props="props" class="text-metric">
              {{ formatarMoeda(props.row.custoMotorista) }}
            </q-td>
          </template>
          <template #body-cell-custoTotal="props">
            <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.custoTotal) }}</q-td>
          </template>
        </q-table>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useLogistica } from 'composables/useLogistica';
import type { QTableColumn } from 'quasar';
import type { CustoLogisticaItemDto } from 'types/dtos/logistica.dto';
import { formatarMoeda } from 'utils/formatters';
import { computed, onMounted, ref } from 'vue';

const { custos, carregando, carregarCustos } = useLogistica();
const periodo = ref<'semana' | 'mes' | 'trimestre'>('mes');

const periodoOpcoes = [
  { label: 'Semana', value: 'semana' },
  { label: 'Mês', value: 'mes' },
  { label: 'Trimestre', value: 'trimestre' },
];

type LinhaCusto = CustoLogisticaItemDto & { rowKey: string };

const linhas = computed<LinhaCusto[]>(() =>
  (custos.value?.itens ?? []).map((item, idx) => ({
    ...item,
    rowKey: item.cargaId ?? `${item.regiao}-${idx}`,
  })),
);

const colunas: QTableColumn<LinhaCusto>[] = [
  { name: 'cargaNumero', label: 'Carga', field: (r) => r.cargaNumero ?? '—', align: 'left' },
  { name: 'regiao', label: 'Região', field: 'regiao', align: 'left' },
  { name: 'custoAbastecimento', label: 'Abastecimento', field: 'custoAbastecimento', align: 'right' },
  { name: 'pedagio', label: 'Pedágio', field: 'pedagio', align: 'right' },
  { name: 'custoMotorista', label: 'Motorista', field: 'custoMotorista', align: 'right' },
  { name: 'custoTotal', label: 'Total', field: 'custoTotal', align: 'right' },
];

function aplicar(): void {
  void carregarCustos({ periodo: periodo.value });
}

onMounted(aplicar);
</script>

<style scoped>
.filtro {
  min-width: 160px;
}
.total {
  font-size: var(--font-size-xl);
  margin-top: var(--spacing-1);
}
</style>
