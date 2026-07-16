<template>
  <agro-card class="cliente-historico">
    <template #header>
      <h3 class="cliente-historico__titulo">Histórico comercial</h3>
    </template>

    <agro-table-skeleton v-if="carregando && itens.length === 0" :colunas="5" />

    <empty-state
      v-else-if="indisponivel && itens.length === 0"
      titulo="Histórico indisponível"
      descricao="O endpoint de histórico comercial ainda não respondeu. Tente novamente mais tarde."
      icon="history"
    />

    <empty-state
      v-else-if="!carregando && itens.length === 0"
      titulo="Sem histórico"
      descricao="Ainda não há pedidos, orçamentos ou negociações para este cliente."
      icon="history"
    />

    <q-table
      v-else
      flat
      bordered
      row-key="id"
      :rows="itens"
      :columns="colunas"
      :loading="carregando"
      :rows-per-page-options="[10, 25, 50]"
    >
      <template #body-cell-data="props">
        <q-td :props="props">{{ formatarDataHora(props.row.data) }}</q-td>
      </template>
      <template #body-cell-valorTotal="props">
        <q-td :props="props" class="text-metric">
          {{ formatarMoeda(props.row.valorTotal) }}
        </q-td>
      </template>
    </q-table>
  </agro-card>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useHistoricoComercial } from 'composables/useHistoricoComercial';
import type { QTableColumn } from 'quasar';
import type { HistoricoComercialItemDto } from 'types/dtos/comercial-extras.dto';
import { formatarDataHora, formatarMoeda } from 'utils/formatters';
import { onMounted, watch } from 'vue';

const props = defineProps<{
  clienteId: string;
}>();

const { itens, carregando, indisponivel, carregar } = useHistoricoComercial();

const colunas: QTableColumn<HistoricoComercialItemDto>[] = [
  { name: 'data', label: 'Data', field: 'data', align: 'left' },
  { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'left' },
  { name: 'referencia', label: 'Referência', field: 'referencia', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'valorTotal', label: 'Valor', field: 'valorTotal', align: 'right' },
];

watch(
  () => props.clienteId,
  (id) => {
    if (id) void carregar(id);
  },
);

onMounted(() => {
  if (props.clienteId) void carregar(props.clienteId);
});
</script>

<style scoped>
.cliente-historico__titulo {
  color: var(--color-text-primary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}
</style>
