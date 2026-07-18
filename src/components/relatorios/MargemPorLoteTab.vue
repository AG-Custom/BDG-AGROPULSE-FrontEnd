<template>
  <div class="painel">
    <div class="agro-filter-bar">
      <q-input v-model="dias" outlined dense label="Dias" type="number" class="filtro" />
      <agro-btn
        color="primary"
        unelevated
        label="Atualizar"
        descricao="Carregar margem por lote"
        :loading="carregando"
        @click="atualizar"
      />
      <relatorio-export-buttons :loading="exportando" @exportar="exportar" />
    </div>

    <agro-table-skeleton v-if="carregando && margemPorLote.length === 0" :colunas="7" />
    <empty-state
      v-else-if="!carregando && margemPorLote.length === 0"
      titulo="Sem margem por lote"
      descricao="Não há vendas com lote no período informado."
      icon="inventory_2"
    />
    <q-table
      v-else
      flat
      bordered
      row-key="loteId"
      :rows="margemPorLote"
      :columns="colunas"
      :loading="carregando"
      :rows-per-page-options="[10, 25, 50]"
    >
      <template #body-cell-receita="props">
        <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.receita) }}</q-td>
      </template>
      <template #body-cell-custoLote="props">
        <q-td :props="props" class="text-metric">
          {{ props.row.custoLote != null ? formatarMoeda(props.row.custoLote) : '—' }}
        </q-td>
      </template>
      <template #body-cell-lucro="props">
        <q-td :props="props" class="text-metric">
          {{ props.row.lucro != null ? formatarMoeda(props.row.lucro) : '—' }}
        </q-td>
      </template>
      <template #body-cell-margemPercentual="props">
        <q-td :props="props" class="text-metric">
          {{
            props.row.margemPercentual != null
              ? `${formatarDecimal(props.row.margemPercentual)}%`
              : '—'
          }}
        </q-td>
      </template>
      <template #body-cell-quantidadeVendida="props">
        <q-td :props="props" class="text-metric">
          {{ formatarDecimal(props.row.quantidadeVendida) }}
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
import type { MargemPorLoteItemDto } from 'types/dtos/relatorio.dto';
import { formatarDecimal, formatarMoeda } from 'utils/formatters';
import { computed, onMounted, ref } from 'vue';

const { margemPorLote, carregando, exportando, carregarMargemPorLote, exportarMargemPorLote } =
  useRelatorios();
const { verCustos } = useVerCustos();
const dias = ref('90');

const colunas = computed(() => {
  const base: QTableColumn<MargemPorLoteItemDto>[] = [
    { name: 'numeroLote', label: 'Lote', field: 'numeroLote', align: 'left' },
    { name: 'produtoCodigo', label: 'Código', field: 'produtoCodigo', align: 'left' },
    { name: 'produtoDescricao', label: 'Produto', field: 'produtoDescricao', align: 'left' },
    { name: 'quantidadeVendida', label: 'Qtd.', field: 'quantidadeVendida', align: 'right' },
    { name: 'receita', label: 'Receita', field: 'receita', align: 'right' },
    { name: 'custoLote', label: 'Custo lote', field: 'custoLote', align: 'right' },
    { name: 'lucro', label: 'Lucro', field: 'lucro', align: 'right' },
    { name: 'margemPercentual', label: 'Margem %', field: 'margemPercentual', align: 'right' },
  ];
  if (verCustos.value) return base;
  return base.filter((c) => !['custoLote', 'lucro', 'margemPercentual'].includes(c.name));
});

function params() {
  return { dias: Number(dias.value) || undefined };
}

async function atualizar(): Promise<void> {
  await carregarMargemPorLote(params());
}

async function exportar(formato: ExportacaoFormatoValor): Promise<void> {
  await exportarMargemPorLote(formato, params());
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
