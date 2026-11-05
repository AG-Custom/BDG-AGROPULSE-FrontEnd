<template>
  <q-table
    flat
    bordered
    row-key="id"
    :rows="documentos"
    :columns="colunas"
    :loading="carregando"
    :pagination="{ rowsPerPage: 20 }"
    :rows-per-page-options="[10, 20, 50]"
    no-data-label="Nenhum documento escriturado"
  >
    <template #body-cell-direcao="props">
      <q-td :props="props">
        <agro-badge
          :label="props.row.direcao === 'Entrada' ? 'Entrada' : 'Saída'"
          :variant="props.row.direcao === 'Entrada' ? 'info' : 'accent'"
        />
      </q-td>
    </template>
    <template #body-cell-dataEmissao="props">
      <q-td :props="props">{{ formatarData(props.row.dataEmissao) }}</q-td>
    </template>
    <template #body-cell-participante="props">
      <q-td :props="props">
        <div class="participante">
          <span class="participante__nome">{{ props.row.participanteNome ?? '—' }}</span>
          <span class="participante__doc text-metric">{{ documento(props.row.participanteDocumento) }}</span>
        </div>
      </q-td>
    </template>
    <template v-for="campo in camposMoeda" :key="campo" #[`body-cell-${campo}`]="props">
      <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row[campo]) }}</q-td>
    </template>
    <template #body-cell-situacao="props">
      <q-td :props="props">
        <agro-badge
          :label="props.row.situacao === 'Cancelado' ? 'Cancelado' : 'Regular'"
          :variant="props.row.situacao === 'Cancelado' ? 'error' : 'success'"
        />
      </q-td>
    </template>
    <template #body-cell-pendencias="props">
      <q-td :props="props">
        <agro-badge v-if="props.row.pendenciasBloqueantes > 0" :label="`${props.row.pendenciasBloqueantes} bloqueante(s)`" variant="error" />
        <agro-badge v-else-if="props.row.pendenciasAlerta > 0" :label="`${props.row.pendenciasAlerta} alerta(s)`" variant="warning" />
        <span v-else>—</span>
      </q-td>
    </template>
    <template #body-cell-acoes="props">
      <q-td :props="props" auto-width>
        <agro-btn
          flat
          round
          dense
          icon="visibility"
          :aria-label="`Ver documento ${props.row.numero ?? ''}`"
          descricao="Ver itens e pendências"
          @click="emit('abrir', props.row.id)"
        />
      </q-td>
    </template>
    <template #no-data>
      <empty-state
        titulo="Nenhum documento escriturado"
        descricao="Reprocesse a competência para escriturar as notas fiscais do período."
        icon="menu_book"
      />
    </template>
  </q-table>
</template>

<script setup lang="ts">
import AgroBadge from 'components/ui/AgroBadge.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import type { QTableColumn } from 'quasar';
import type { DocumentoEscrituradoResumoDto } from 'types/dtos/escrituracao.dto';
import { formatarCnpj, formatarCpf, formatarData, formatarMoeda } from 'utils/formatters';

defineProps<{
  documentos: DocumentoEscrituradoResumoDto[];
  carregando: boolean;
}>();

const emit = defineEmits<{ abrir: [documentoId: string] }>();

const camposMoeda = ['valorTotal', 'valorIcms', 'valorIpi', 'valorPis', 'valorCofins'] as const;

const colunas: QTableColumn[] = [
  { name: 'direcao', label: 'Tipo', field: 'direcao', align: 'left' },
  { name: 'dataEmissao', label: 'Emissão', field: 'dataEmissao', align: 'left', sortable: true },
  { name: 'numero', label: 'Número', field: 'numero', align: 'left' },
  { name: 'participante', label: 'Participante', field: 'participanteNome', align: 'left' },
  { name: 'cfop', label: 'CFOP', field: 'cfop', align: 'left' },
  { name: 'valorTotal', label: 'Valor', field: 'valorTotal', align: 'right' },
  { name: 'valorIcms', label: 'ICMS', field: 'valorIcms', align: 'right' },
  { name: 'valorIpi', label: 'IPI', field: 'valorIpi', align: 'right' },
  { name: 'valorPis', label: 'PIS', field: 'valorPis', align: 'right' },
  { name: 'valorCofins', label: 'COFINS', field: 'valorCofins', align: 'right' },
  { name: 'situacao', label: 'Situação', field: 'situacao', align: 'left' },
  { name: 'pendencias', label: 'Pendências', field: 'pendenciasBloqueantes', align: 'left' },
  { name: 'acoes', label: '', field: 'id', align: 'right' },
];

function documento(valor: string | null): string {
  if (!valor) return '—';
  return valor.length <= 11 ? formatarCpf(valor) : formatarCnpj(valor);
}
</script>

<style scoped>
.participante {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
  min-width: 10rem;
}

.participante__nome {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
}

.participante__doc {
  color: var(--color-text-secondary);
  font-size: var(--font-size-xs);
}
</style>
