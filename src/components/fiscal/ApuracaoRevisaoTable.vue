<template>
  <q-table
    flat
    bordered
    row-key="documentoEscrituradoId"
    :rows="documentos"
    :columns="colunas"
    :pagination="{ rowsPerPage: 10 }"
    :rows-per-page-options="[10, 20, 50]"
    no-data-label="Nenhum documento em revisão"
  >
    <template #body-cell-direcao="props">
      <q-td :props="props">
        <agro-badge
          :label="props.row.direcao === 'Entrada' ? 'Entrada' : 'Saída'"
          :variant="props.row.direcao === 'Entrada' ? 'info' : 'accent'"
        />
      </q-td>
    </template>
    <template #body-cell-valorImposto="props">
      <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.valorImposto) }}</q-td>
    </template>
    <template #body-cell-decisaoAtual="props">
      <q-td :props="props">
        <agro-badge
          v-if="props.row.decisaoAtual"
          :label="rotuloDecisao(props.row.decisaoAtual)"
          variant="success"
        />
        <agro-badge v-else label="Pendente" variant="error" />
      </q-td>
    </template>
    <template #body-cell-acoes="props">
      <q-td :props="props" auto-width>
        <agro-btn
          v-if="!somenteLeitura"
          flat
          round
          dense
          icon="rule"
          :aria-label="`Decidir documento ${props.row.documento}`"
          descricao="Definir como débito, crédito ou neutra"
          @click="emit('decidir', props.row)"
        />
      </q-td>
    </template>
    <template #no-data>
      <empty-state
        titulo="Nenhum documento em revisão"
        descricao="Todas as operações da competência têm tratamento automático."
        icon="fact_check"
      />
    </template>
  </q-table>
</template>

<script setup lang="ts">
import AgroBadge from 'components/ui/AgroBadge.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { DecisaoApuracaoOpcoes } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { DocumentoRevisaoDto } from 'types/dtos/apuracao-fiscal.dto';
import { formatarMoeda } from 'utils/formatters';

defineProps<{
  documentos: DocumentoRevisaoDto[];
  somenteLeitura: boolean;
}>();

const emit = defineEmits<{ decidir: [documento: DocumentoRevisaoDto] }>();

const colunas: QTableColumn[] = [
  { name: 'direcao', label: 'Tipo', field: 'direcao', align: 'left' },
  { name: 'documento', label: 'Documento', field: 'documento', align: 'left' },
  { name: 'participanteNome', label: 'Participante', field: 'participanteNome', align: 'left' },
  { name: 'cfop', label: 'CFOP', field: 'cfop', align: 'left' },
  { name: 'natureza', label: 'Natureza', field: 'natureza', align: 'left' },
  { name: 'valorImposto', label: 'Imposto', field: 'valorImposto', align: 'right' },
  { name: 'decisaoAtual', label: 'Decisão', field: 'decisaoAtual', align: 'left' },
  { name: 'acoes', label: '', field: 'documentoEscrituradoId', align: 'right' },
];

function rotuloDecisao(valor: string): string {
  return DecisaoApuracaoOpcoes.find((o) => o.value === valor)?.label ?? valor;
}
</script>
