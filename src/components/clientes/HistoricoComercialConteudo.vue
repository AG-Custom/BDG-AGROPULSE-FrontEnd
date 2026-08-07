<template>
  <div>
    <agro-table-skeleton v-if="carregando && !itens.length" :colunas="5" />

    <empty-state
      v-else-if="indisponivel && !itens.length"
      titulo="Histórico indisponível"
      descricao="O endpoint de histórico comercial ainda não respondeu. Tente novamente mais tarde."
      icon="history"
    />

    <empty-state
      v-else-if="!carregando && !itens.length"
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
      <template #body-cell-valor="props">
        <q-td :props="props" class="text-metric">
          {{ formatarMoeda(props.row.valor) }}
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import type { QTableColumn } from 'quasar';
import type { HistoricoComercialItemDto } from 'types/dtos/comercial-extras.dto';
import { formatarDataHora, formatarMoeda } from 'utils/formatters';

defineProps<{
  itens: HistoricoComercialItemDto[];
  carregando: boolean;
  indisponivel: boolean;
  colunas: QTableColumn<HistoricoComercialItemDto>[];
}>();
</script>
