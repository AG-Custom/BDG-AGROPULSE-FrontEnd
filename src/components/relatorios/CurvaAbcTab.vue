<template>
  <div class="painel">
    <div class="agro-filter-bar">
      <q-select
        v-model="dimensao"
        outlined
        dense
        label="Dimensão"
        emit-value
        map-options
        :options="DimensaoCurvaAbcOpcoes"
        class="filtro-dimensao"
      />
      <q-input v-model="dias" outlined dense label="Dias" type="number" class="filtro" />
      <agro-btn
        color="primary"
        unelevated
        label="Atualizar"
        descricao="Carregar curva ABC"
        :loading="carregando"
        @click="atualizar"
      />
      <relatorio-export-buttons :loading="exportando" @exportar="exportar" />
    </div>

    <agro-table-skeleton v-if="carregando && curvaAbc.length === 0" :colunas="6" />
    <empty-state
      v-else-if="!carregando && curvaAbc.length === 0"
      titulo="Sem dados"
      descricao="Não há vendas no período informado."
      icon="analytics"
    />
    <q-table
      v-else
      flat
      bordered
      row-key="produtoId"
      :rows="curvaAbc"
      :columns="colunas"
      :loading="carregando"
      :rows-per-page-options="[10, 25, 50]"
    >
      <template #body-cell-receita="props">
        <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.receita) }}</q-td>
      </template>
      <template #body-cell-lucro="props">
        <q-td :props="props" class="text-metric">
          {{ props.row.lucro != null ? formatarMoeda(props.row.lucro) : '—' }}
        </q-td>
      </template>
      <template #body-cell-participacaoReceitaPercentual="props">
        <q-td :props="props" class="text-metric">
          {{ formatarDecimal(props.row.participacaoReceitaPercentual) }}%
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
import {
  DimensaoCurvaAbc,
  DimensaoCurvaAbcOpcoes,
  type DimensaoCurvaAbcValor,
  type ExportacaoFormatoValor,
} from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { CurvaAbcLucratividadeItemDto } from 'types/dtos/relatorio.dto';
import { formatarDecimal, formatarMoeda } from 'utils/formatters';
import { computed, onMounted, ref } from 'vue';

const { curvaAbc, carregando, exportando, carregarCurvaAbc, exportarCurvaAbc } = useRelatorios();
const { verCustos } = useVerCustos();
const dias = ref('30');
const dimensao = ref<DimensaoCurvaAbcValor>(DimensaoCurvaAbc.Produto);

const colunas = computed(() => {
  const base: QTableColumn<CurvaAbcLucratividadeItemDto>[] = [
    { name: 'produtoCodigo', label: 'Código', field: 'produtoCodigo', align: 'left' },
    { name: 'produtoDescricao', label: 'Nome', field: 'produtoDescricao', align: 'left' },
    { name: 'classeAbc', label: 'Classe', field: 'classeAbc', align: 'left' },
    { name: 'receita', label: 'Receita', field: 'receita', align: 'right' },
    { name: 'lucro', label: 'Lucro', field: 'lucro', align: 'right' },
    {
      name: 'participacaoReceitaPercentual',
      label: 'Part. %',
      field: 'participacaoReceitaPercentual',
      align: 'right',
    },
  ];
  return verCustos.value ? base : base.filter((c) => c.name !== 'lucro');
});

function params() {
  return {
    dias: Number(dias.value) || undefined,
    dimensao: dimensao.value,
  };
}

async function atualizar(): Promise<void> {
  await carregarCurvaAbc(params());
}

async function exportar(formato: ExportacaoFormatoValor): Promise<void> {
  await exportarCurvaAbc(formato, params());
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
.filtro-dimensao {
  min-width: 160px;
}
</style>
