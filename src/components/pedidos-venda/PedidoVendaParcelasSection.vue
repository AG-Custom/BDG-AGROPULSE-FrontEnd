<template>
  <agro-card>
    <template #header>
      <h3 class="pedido-venda-parcelas__titulo">Contas a receber</h3>
    </template>

    <agro-table-skeleton v-if="carregando && contas.length === 0" :colunas="5" />

    <empty-state
      v-else-if="!carregando && contas.length === 0"
      titulo="Nenhuma parcela encontrada"
      descricao="As contas a receber deste pedido ainda não foram listadas."
      icon="payments"
    />

    <q-table
      v-else
      flat
      bordered
      row-key="id"
      hide-pagination
      :rows="contas"
      :columns="colunas"
      :loading="carregando"
      :pagination="{ rowsPerPage: 0 }"
    >
      <template #body-cell-valor="props">
        <q-td :props="props" class="text-metric">
          {{ formatarMoeda(props.row.valor) }}
        </q-td>
      </template>

      <template #body-cell-vencimento="props">
        <q-td :props="props">
          {{ formatarData(props.row.vencimento) }}
        </q-td>
      </template>

      <template #body-cell-status="props">
        <q-td :props="props">
          <agro-badge
            :label="rotuloContaReceberStatus(props.row.status)"
            :variant="varianteContaReceberStatus(props.row.status)"
          />
        </q-td>
      </template>

      <template #body-cell-formaPagamento="props">
        <q-td :props="props">
          {{ rotuloFormaPagamento(props.row.formaPagamento) }}
        </q-td>
      </template>
    </q-table>
  </agro-card>
</template>

<script setup lang="ts">
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import type { QTableColumn } from 'quasar';
import type { ContaReceberDto } from 'types/dtos/financeiro.dto';
import { formatarData, formatarMoeda } from 'utils/formatters';
import {
  rotuloContaReceberStatus,
  rotuloFormaPagamento,
  varianteContaReceberStatus,
} from 'utils/pedido-venda.helpers';

defineProps<{
  contas: ContaReceberDto[];
  carregando: boolean;
}>();

const colunas: QTableColumn<ContaReceberDto>[] = [
  { name: 'parcela', label: 'Parcela', field: 'parcela', align: 'left' },
  { name: 'valor', label: 'Valor', field: 'valor', align: 'right' },
  { name: 'vencimento', label: 'Vencimento', field: 'vencimento', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'formaPagamento', label: 'Forma', field: 'formaPagamento', align: 'left' },
];
</script>

<style scoped>
.pedido-venda-parcelas__titulo {
  color: var(--color-text-primary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}
</style>
