<template>
  <div class="painel">
    <div class="agro-filter-bar">
      <agro-btn
        color="primary"
        unelevated
        label="Atualizar"
        descricao="Carregar inadimplência"
        :loading="carregando"
        @click="atualizar"
      />
    </div>

    <agro-form-skeleton v-if="carregando && !inadimplencia" :campos="3" />
    <empty-state
      v-else-if="!carregando && !inadimplencia"
      titulo="Sem inadimplência"
      descricao="Não foi possível carregar o relatório de inadimplência."
      icon="money_off"
    />
    <template v-else-if="inadimplencia">
      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-6 col-md-6">
          <metric-tile
            label="Total inadimplente"
            :value="formatarMoeda(inadimplencia.totalInadimplente)"
            icon="warning"
            accent
          />
        </div>
        <div class="col-6 col-md-6">
          <metric-tile
            label="Inadimplência"
            :value="`${formatarDecimal(inadimplencia.percentualInadimplencia)}%`"
            icon="percent"
          />
        </div>
      </div>

      <h3 class="secao-titulo">Aging</h3>
      <q-table
        flat
        bordered
        row-key="faixa"
        class="q-mb-md"
        :rows="aging"
        :columns="colunasAging"
        :loading="carregando"
        hide-pagination
        :rows-per-page-options="[0]"
      >
        <template #body-cell-total="props">
          <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.total) }}</q-td>
        </template>
        <template #body-cell-quantidade="props">
          <q-td :props="props" class="text-metric">{{ props.row.quantidade }}</q-td>
        </template>
      </q-table>

      <h3 class="secao-titulo">Por vendedor</h3>
      <agro-table-skeleton v-if="carregando && porVendedor.length === 0" :colunas="3" />
      <empty-state
        v-else-if="porVendedor.length === 0"
        titulo="Sem vendedores"
        descricao="Não há inadimplência agrupada por vendedor."
        icon="people"
      />
      <q-table
        v-else
        flat
        bordered
        row-key="vendedorUsuarioId"
        :rows="porVendedor"
        :columns="colunasVendedor"
        :loading="carregando"
        :rows-per-page-options="[10, 25, 50]"
      >
        <template #body-cell-total="props">
          <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.total) }}</q-td>
        </template>
        <template #body-cell-quantidade="props">
          <q-td :props="props" class="text-metric">{{ props.row.quantidade }}</q-td>
        </template>
      </q-table>
    </template>
  </div>
</template>

<script setup lang="ts">
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import MetricTile from 'components/ui/MetricTile.vue';
import { useRelatorios } from 'composables/useRelatorios';
import type { QTableColumn } from 'quasar';
import type { InadimplenciaPorVendedorDto } from 'types/dtos/relatorio.dto';
import { formatarDecimal, formatarMoeda } from 'utils/formatters';
import { computed, onMounted } from 'vue';

const { inadimplencia, carregando, carregarInadimplencia } = useRelatorios();

const aging = computed(() => {
  const d = inadimplencia.value;
  if (!d) return [];
  return [
    { faixa: '1 a 15 dias', quantidade: d.de1a15.quantidade, total: d.de1a15.total },
    { faixa: '16 a 30 dias', quantidade: d.de16a30.quantidade, total: d.de16a30.total },
    { faixa: '31 a 60 dias', quantidade: d.de31a60.quantidade, total: d.de31a60.total },
    { faixa: '61 a 90 dias', quantidade: d.de61a90.quantidade, total: d.de61a90.total },
    { faixa: 'Acima de 90 dias', quantidade: d.acima90.quantidade, total: d.acima90.total },
  ];
});

const porVendedor = computed(() => inadimplencia.value?.porVendedor ?? []);

const colunasAging: QTableColumn[] = [
  { name: 'faixa', label: 'Faixa', field: 'faixa', align: 'left' },
  { name: 'quantidade', label: 'Qtd.', field: 'quantidade', align: 'right' },
  { name: 'total', label: 'Valor', field: 'total', align: 'right' },
];

const colunasVendedor: QTableColumn<InadimplenciaPorVendedorDto>[] = [
  { name: 'vendedorUsuarioId', label: 'Vendedor', field: 'vendedorUsuarioId', align: 'left' },
  { name: 'quantidade', label: 'Qtd.', field: 'quantidade', align: 'right' },
  { name: 'total', label: 'Total', field: 'total', align: 'right' },
];

async function atualizar(): Promise<void> {
  await carregarInadimplencia();
}

onMounted(() => {
  void atualizar();
});
</script>

<style scoped>
.painel {
  padding-top: var(--spacing-4);
}
.secao-titulo {
  font-family: var(--font-family-display);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  margin: var(--spacing-4) 0 var(--spacing-3);
  color: var(--color-text-primary);
}
</style>
