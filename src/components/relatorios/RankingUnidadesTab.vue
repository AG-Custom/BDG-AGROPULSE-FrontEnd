<template>
  <div class="painel">
    <div class="agro-filter-bar">
      <q-input v-model="dias" outlined dense label="Dias" type="number" class="filtro" />
      <agro-btn
        color="primary"
        unelevated
        label="Atualizar"
        descricao="Carregar ranking de unidades"
        :loading="carregando"
        @click="atualizar"
      />
      <relatorio-export-buttons :loading="exportando" @exportar="exportar" />
    </div>

    <agro-table-skeleton v-if="carregando && rankingUnidades.length === 0" :colunas="6" />
    <empty-state
      v-else-if="!carregando && rankingUnidades.length === 0"
      titulo="Sem ranking"
      descricao="Não há dados de unidades no período informado."
      icon="emoji_events"
    />
    <q-table
      v-else
      flat
      bordered
      row-key="unidadeId"
      :rows="rankingComPosicao"
      :columns="colunas"
      :loading="carregando"
      :rows-per-page-options="[10, 25, 50]"
    >
      <template #body-cell-posicao="props">
        <q-td :props="props" class="text-metric">{{ props.row.posicao }}</q-td>
      </template>
      <template #body-cell-faturamento="props">
        <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.faturamento) }}</q-td>
      </template>
      <template #body-cell-margemPercentual="props">
        <q-td :props="props" class="text-metric">
          {{
            verCustos && props.row.margemPercentual != null
              ? `${formatarDecimal(props.row.margemPercentual)}%`
              : '—'
          }}
        </q-td>
      </template>
      <template #body-cell-ticketMedio="props">
        <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.ticketMedio) }}</q-td>
      </template>
      <template #body-cell-inadimplenciaValor="props">
        <q-td :props="props" class="text-metric">
          {{ formatarMoeda(props.row.inadimplenciaValor) }}
        </q-td>
      </template>
      <template #body-cell-metaAtingimentoPercentual="props">
        <q-td :props="props" class="text-metric">
          {{
            props.row.metaAtingimentoPercentual != null
              ? `${formatarDecimal(props.row.metaAtingimentoPercentual)}%`
              : '—'
          }}
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import RelatorioExportButtons from 'components/relatorios/RelatorioExportButtons.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useRelatorios } from 'composables/useRelatorios';
import { useVerCustos } from 'composables/useVerCustos';
import type { ExportacaoFormatoValor } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import { formatarDecimal, formatarMoeda } from 'utils/formatters';
import { computed, onMounted, ref } from 'vue';

const {
  rankingUnidades,
  carregando,
  exportando,
  carregarRankingUnidades,
  exportarRankingUnidades,
} = useRelatorios();
const { verCustos } = useVerCustos();
const dias = ref('30');

const rankingComPosicao = computed(() =>
  rankingUnidades.value.map((item, index) => ({ ...item, posicao: index + 1 })),
);

const colunas = computed(() => {
  const base: QTableColumn[] = [
    { name: 'posicao', label: '#', field: 'posicao', align: 'left' },
    { name: 'unidadeNome', label: 'Unidade', field: 'unidadeNome', align: 'left' },
    { name: 'faturamento', label: 'Faturamento', field: 'faturamento', align: 'right' },
    { name: 'margemPercentual', label: 'Margem %', field: 'margemPercentual', align: 'right' },
    { name: 'ticketMedio', label: 'Ticket médio', field: 'ticketMedio', align: 'right' },
    {
      name: 'metaAtingimentoPercentual',
      label: 'Meta %',
      field: 'metaAtingimentoPercentual',
      align: 'right',
    },
    {
      name: 'inadimplenciaValor',
      label: 'Inadimplência',
      field: 'inadimplenciaValor',
      align: 'right',
    },
  ];
  return verCustos.value ? base : base.filter((c) => c.name !== 'margemPercentual');
});

function params() {
  return { dias: Number(dias.value) || undefined };
}

async function atualizar(): Promise<void> {
  await carregarRankingUnidades(params());
}

async function exportar(formato: ExportacaoFormatoValor): Promise<void> {
  await exportarRankingUnidades(formato, params());
}

onMounted(() => {
  void atualizar();
});
</script>

<style scoped>
.painel {
  padding-top: var(--spacing-4);
}
.filtro {
  min-width: 140px;
}
</style>
