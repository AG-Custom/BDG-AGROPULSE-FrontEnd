<template>
  <div class="painel">
    <div class="agro-filter-bar">
      <q-input v-model="dataInicio" outlined dense type="date" label="Data início" class="filtro" />
      <q-input v-model="dataFim" outlined dense type="date" label="Data fim" class="filtro" />
      <agro-btn
        color="primary"
        unelevated
        label="Atualizar"
        descricao="Carregar giro de estoque"
        :loading="carregando"
        @click="atualizar"
      />
      <relatorio-export-buttons :loading="exportando" @exportar="exportar" />
    </div>

    <agro-table-skeleton v-if="carregando && giroEstoque.length === 0" :colunas="5" />
    <empty-state
      v-else-if="!carregando && giroEstoque.length === 0"
      titulo="Sem giro no período"
      descricao="Não há saídas de estoque no intervalo informado."
      icon="sync_alt"
    />
    <q-table
      v-else
      flat
      bordered
      row-key="produtoId"
      :rows="giroEstoque"
      :columns="colunas"
      :loading="carregando"
      :rows-per-page-options="[10, 25, 50]"
    >
      <template #body-cell-produtoId="props">
        <q-td :props="props">{{ rotuloProduto(props.row.produtoId) }}</q-td>
      </template>
      <template #body-cell-quantidadeSaida="props">
        <q-td :props="props" class="text-metric">
          {{ formatarDecimal(props.row.quantidadeSaida) }}
        </q-td>
      </template>
      <template #body-cell-saldoAtual="props">
        <q-td :props="props" class="text-metric">
          {{ formatarDecimal(props.row.saldoAtual) }}
        </q-td>
      </template>
      <template #body-cell-estoqueMedio="props">
        <q-td :props="props" class="text-metric">
          {{ formatarDecimal(props.row.estoqueMedio) }}
        </q-td>
      </template>
      <template #body-cell-giro="props">
        <q-td :props="props" class="text-metric">
          {{ formatarDecimal(props.row.giro) }}
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import RelatorioExportButtons from 'components/relatorios/RelatorioExportButtons.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useProdutoOpcoesEstoque } from 'composables/useProdutoOpcoesEstoque';
import { useRelatorios } from 'composables/useRelatorios';
import type { ExportacaoFormatoValor } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { GiroEstoqueItemDto } from 'types/dtos/relatorio.dto';
import { formatarDecimal } from 'utils/formatters';
import { onMounted, ref } from 'vue';

const { giroEstoque, carregando, exportando, carregarGiroEstoque, exportarGiroEstoque } =
  useRelatorios();
const { rotuloProduto } = useProdutoOpcoesEstoque();

const dataInicio = ref(dataIsoOffset(-30));
const dataFim = ref(dataIsoOffset(0));

const colunas: QTableColumn<GiroEstoqueItemDto>[] = [
  { name: 'produtoId', label: 'Produto', field: 'produtoId', align: 'left' },
  { name: 'quantidadeSaida', label: 'Saídas', field: 'quantidadeSaida', align: 'right' },
  { name: 'saldoAtual', label: 'Saldo atual', field: 'saldoAtual', align: 'right' },
  { name: 'estoqueMedio', label: 'Estoque médio', field: 'estoqueMedio', align: 'right' },
  { name: 'giro', label: 'Giro', field: 'giro', align: 'right' },
];

function dataIsoOffset(diasOffset: number): string {
  const data = new Date();
  data.setDate(data.getDate() + diasOffset);
  return data.toISOString().slice(0, 10);
}

function params() {
  return {
    dataInicio: dataInicio.value || undefined,
    dataFim: dataFim.value || undefined,
  };
}

async function atualizar(): Promise<void> {
  await carregarGiroEstoque(params());
}

async function exportar(formato: ExportacaoFormatoValor): Promise<void> {
  await exportarGiroEstoque(formato, params());
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
