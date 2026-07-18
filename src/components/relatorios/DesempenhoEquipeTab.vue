<template>
  <div class="painel">
    <div class="agro-filter-bar">
      <q-input v-model.number="mes" outlined dense label="Mês" type="number" min="1" max="12" class="filtro" />
      <q-input v-model.number="ano" outlined dense label="Ano" type="number" class="filtro" />
      <agro-btn
        color="primary"
        unelevated
        label="Atualizar"
        descricao="Carregar desempenho da equipe"
        :loading="carregando"
        @click="atualizar"
      />
      <relatorio-export-buttons :loading="exportando" @exportar="exportar" />
    </div>

    <agro-table-skeleton v-if="carregando && desempenhoEquipe.length === 0" :colunas="6" />
    <empty-state
      v-else-if="!carregando && desempenhoEquipe.length === 0"
      titulo="Sem desempenho"
      descricao="Não há dados de equipe para o mês/ano informado."
      icon="groups"
    />
    <q-table
      v-else
      flat
      bordered
      row-key="vendedorUsuarioId"
      :rows="desempenhoEquipe"
      :columns="colunas"
      :loading="carregando"
      :rows-per-page-options="[10, 25, 50]"
    >
      <template #body-cell-faturamento="props">
        <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.faturamento) }}</q-td>
      </template>
      <template #body-cell-ticketMedio="props">
        <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.ticketMedio) }}</q-td>
      </template>
      <template #body-cell-valorComissao="props">
        <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.valorComissao) }}</q-td>
      </template>
      <template #body-cell-conversaoPercentual="props">
        <q-td :props="props" class="text-metric">
          {{ formatarDecimal(props.row.conversaoPercentual) }}%
        </q-td>
      </template>
      <template #body-cell-valorMeta="props">
        <q-td :props="props" class="text-metric">
          {{ props.row.valorMeta != null ? formatarMoeda(props.row.valorMeta) : '—' }}
        </q-td>
      </template>
      <template #body-cell-atingimentoMetaPercentual="props">
        <q-td :props="props" class="text-metric">
          {{
            props.row.atingimentoMetaPercentual != null
              ? `${formatarDecimal(props.row.atingimentoMetaPercentual)}%`
              : '—'
          }}
        </q-td>
      </template>
      <template #body-cell-pedidosFaturados="props">
        <q-td :props="props" class="text-metric">
          {{ props.row.pedidosFaturados }}/{{ props.row.pedidosTotais }}
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
import type { ExportacaoFormatoValor } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { DesempenhoEquipeItemDto } from 'types/dtos/relatorio.dto';
import { formatarDecimal, formatarMoeda } from 'utils/formatters';
import { onMounted, ref } from 'vue';

const {
  desempenhoEquipe,
  carregando,
  exportando,
  carregarDesempenhoEquipe,
  exportarDesempenhoEquipe,
} = useRelatorios();

const agora = new Date();
const mes = ref(agora.getMonth() + 1);
const ano = ref(agora.getFullYear());

const colunas: QTableColumn<DesempenhoEquipeItemDto>[] = [
  { name: 'vendedorUsuarioId', label: 'Vendedor', field: 'vendedorUsuarioId', align: 'left' },
  { name: 'pedidosFaturados', label: 'Pedidos', field: 'pedidosFaturados', align: 'right' },
  { name: 'faturamento', label: 'Faturamento', field: 'faturamento', align: 'right' },
  { name: 'ticketMedio', label: 'Ticket médio', field: 'ticketMedio', align: 'right' },
  {
    name: 'conversaoPercentual',
    label: 'Conversão %',
    field: 'conversaoPercentual',
    align: 'right',
  },
  { name: 'valorComissao', label: 'Comissão', field: 'valorComissao', align: 'right' },
  { name: 'valorMeta', label: 'Meta', field: 'valorMeta', align: 'right' },
  {
    name: 'atingimentoMetaPercentual',
    label: 'Meta %',
    field: 'atingimentoMetaPercentual',
    align: 'right',
  },
];

function params() {
  return {
    mes: mes.value || undefined,
    ano: ano.value || undefined,
  };
}

async function atualizar(): Promise<void> {
  await carregarDesempenhoEquipe(params());
}

async function exportar(formato: ExportacaoFormatoValor): Promise<void> {
  await exportarDesempenhoEquipe(formato, params());
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
  min-width: 100px;
  max-width: 120px;
}
</style>
