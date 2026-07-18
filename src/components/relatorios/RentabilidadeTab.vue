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
        :options="RentabilidadeDimensaoOpcoes"
        class="filtro-dimensao"
      />
      <q-input v-model="dias" outlined dense label="Dias" type="number" class="filtro" />
      <agro-btn
        color="primary"
        unelevated
        label="Atualizar"
        descricao="Carregar rentabilidade"
        :loading="carregando"
        @click="atualizar"
      />
      <relatorio-export-buttons :loading="exportando" @exportar="exportar" />
    </div>

    <agro-table-skeleton v-if="carregando && rentabilidade.length === 0" :colunas="6" />
    <empty-state
      v-else-if="!carregando && rentabilidade.length === 0"
      titulo="Sem rentabilidade"
      descricao="Não há dados para a dimensão e período selecionados."
      icon="insights"
    />
    <q-table
      v-else
      flat
      bordered
      row-key="chave"
      :rows="rentabilidade"
      :columns="colunas"
      :loading="carregando"
      :rows-per-page-options="[10, 25, 50]"
    >
      <template #body-cell-receita="props">
        <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.receita) }}</q-td>
      </template>
      <template #body-cell-custo="props">
        <q-td :props="props" class="text-metric">
          {{ props.row.custo != null ? formatarMoeda(props.row.custo) : '—' }}
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
  RentabilidadeDimensao,
  RentabilidadeDimensaoOpcoes,
  type ExportacaoFormatoValor,
  type RentabilidadeDimensaoValor,
} from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { RentabilidadeItemDto } from 'types/dtos/relatorio.dto';
import { formatarDecimal, formatarMoeda } from 'utils/formatters';
import { computed, onMounted, ref } from 'vue';

const { rentabilidade, carregando, exportando, carregarRentabilidade, exportarRentabilidade } =
  useRelatorios();
const { verCustos } = useVerCustos();

const dimensao = ref<RentabilidadeDimensaoValor>(RentabilidadeDimensao.Produto);
const dias = ref('90');

const colunas = computed(() => {
  const base: QTableColumn<RentabilidadeItemDto>[] = [
    { name: 'chave', label: 'Chave', field: 'chave', align: 'left' },
    { name: 'nome', label: 'Nome', field: 'nome', align: 'left' },
    { name: 'receita', label: 'Receita', field: 'receita', align: 'right' },
    { name: 'custo', label: 'Custo', field: 'custo', align: 'right' },
    { name: 'lucro', label: 'Lucro', field: 'lucro', align: 'right' },
    { name: 'margemPercentual', label: 'Margem %', field: 'margemPercentual', align: 'right' },
    {
      name: 'participacaoReceitaPercentual',
      label: 'Part. %',
      field: 'participacaoReceitaPercentual',
      align: 'right',
    },
  ];
  if (verCustos.value) return base;
  return base.filter((c) => !['custo', 'lucro', 'margemPercentual'].includes(c.name));
});

function params() {
  return {
    dimensao: dimensao.value,
    dias: Number(dias.value) || undefined,
  };
}

async function atualizar(): Promise<void> {
  await carregarRentabilidade(params());
}

async function exportar(formato: ExportacaoFormatoValor): Promise<void> {
  await exportarRentabilidade(formato, params());
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
