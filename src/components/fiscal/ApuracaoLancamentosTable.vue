<template>
  <q-table
    flat
    bordered
    row-key="documentoEscrituradoId"
    :rows="lancamentos"
    :columns="colunas"
    :pagination="{ rowsPerPage: 10 }"
    :rows-per-page-options="[10, 20, 50]"
    no-data-label="Nenhum lançamento"
  >
    <template #body-cell-tipo="props">
      <q-td :props="props">
        <agro-badge
          :label="props.row.tipo === 'Debito' ? 'Débito' : 'Crédito'"
          :variant="props.row.tipo === 'Debito' ? 'accent' : 'info'"
        />
      </q-td>
    </template>
    <template #body-cell-origem="props">
      <q-td :props="props">{{ props.row.origem === 'Revisao' ? 'Revisão' : 'Automática' }}</q-td>
    </template>
    <template #body-cell-valor="props">
      <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.valor) }}</q-td>
    </template>
    <template #no-data>
      <empty-state
        titulo="Nenhum lançamento"
        descricao="Não há documentos com imposto a apurar nesta competência."
        icon="receipt_long"
      />
    </template>
  </q-table>
</template>

<script setup lang="ts">
import AgroBadge from 'components/ui/AgroBadge.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import type { QTableColumn } from 'quasar';
import type { LancamentoApuracaoDto } from 'types/dtos/apuracao-fiscal.dto';
import { formatarMoeda } from 'utils/formatters';

defineProps<{ lancamentos: LancamentoApuracaoDto[] }>();

const colunas: QTableColumn[] = [
  { name: 'documento', label: 'Documento', field: 'documento', align: 'left' },
  { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'left' },
  { name: 'origem', label: 'Origem', field: 'origem', align: 'left' },
  { name: 'valor', label: 'Valor', field: 'valor', align: 'right' },
];
</script>
