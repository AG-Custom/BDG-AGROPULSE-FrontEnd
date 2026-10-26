<template>
  <q-table
    flat
    bordered
    row-key="id"
    :rows="ajustes"
    :columns="colunas"
    :pagination="{ rowsPerPage: 10 }"
    :rows-per-page-options="[10, 20]"
    no-data-label="Nenhum ajuste"
  >
    <template #body-cell-tipo="props">
      <q-td :props="props">{{ rotuloTipo(props.row.tipo) }}</q-td>
    </template>
    <template #body-cell-valor="props">
      <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.valor) }}</q-td>
    </template>
    <template #body-cell-acoes="props">
      <q-td :props="props" auto-width>
        <agro-btn
          v-if="!somenteLeitura"
          flat
          round
          dense
          icon="delete"
          :aria-label="`Remover ajuste ${props.row.descricao}`"
          descricao="Remover ajuste"
          @click="emit('remover', props.row.id)"
        />
      </q-td>
    </template>
    <template #no-data>
      <empty-state
        titulo="Nenhum ajuste"
        descricao="Ajustes, estornos e deduções da competência aparecerão aqui."
        icon="tune"
      />
    </template>
  </q-table>
</template>

<script setup lang="ts">
import EmptyState from 'components/ui/EmptyState.vue';
import { TipoAjusteApuracaoOpcoes } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { AjusteApuracaoDto } from 'types/dtos/apuracao-fiscal.dto';
import { formatarMoeda } from 'utils/formatters';

defineProps<{
  ajustes: AjusteApuracaoDto[];
  somenteLeitura: boolean;
}>();

const emit = defineEmits<{ remover: [ajusteId: string] }>();

const colunas: QTableColumn[] = [
  { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'left' },
  { name: 'descricao', label: 'Descrição', field: 'descricao', align: 'left' },
  { name: 'codigoAjuste', label: 'Código', field: 'codigoAjuste', align: 'left', format: (v) => v ?? '—' },
  { name: 'valor', label: 'Valor', field: 'valor', align: 'right' },
  { name: 'acoes', label: '', field: 'id', align: 'right' },
];

function rotuloTipo(valor: string): string {
  return TipoAjusteApuracaoOpcoes.find((o) => o.value === valor)?.label ?? valor;
}
</script>
