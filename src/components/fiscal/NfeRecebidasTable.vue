<template>
  <q-table
    v-model:selected="selecionados"
    flat
    bordered
    row-key="id"
    selection="multiple"
    :rows="notas"
    :columns="colunas"
    :loading="carregando"
    :pagination="{ rowsPerPage: 20 }"
    :rows-per-page-options="[10, 20, 50]"
    no-data-label="Nenhuma NF-e recebida"
  >
    <template #body-selection="scope">
      <q-checkbox
        v-model="scope.selected"
        dense
        color="primary"
        :disable="manifestacaoFinal(scope.row.manifestacaoDestinatario) || manifestando"
        :aria-label="`Selecionar NF-e de ${scope.row.nomeEmitente}`"
      />
    </template>
    <template #body-cell-emitente="props">
      <q-td :props="props">
        <div class="emitente">
          <span class="emitente__nome">{{ props.row.nomeEmitente }}</span>
          <span class="emitente__doc text-metric">{{ documentoEmitente(props.row.documentoEmitente) }}</span>
        </div>
      </q-td>
    </template>
    <template #body-cell-chaveNfe="props">
      <q-td :props="props">
        <span class="chave text-metric" :title="props.row.chaveNfe">{{ props.row.chaveNfe }}</span>
      </q-td>
    </template>
    <template #body-cell-valorTotal="props">
      <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.valorTotal) }}</q-td>
    </template>
    <template #body-cell-dataEmissao="props">
      <q-td :props="props">{{ props.row.dataEmissao ? formatarData(props.row.dataEmissao) : '—' }}</q-td>
    </template>
    <template #body-cell-situacao="props">
      <q-td :props="props">
        <nfe-recebida-status-pill tipo="situacao" :codigo="props.row.situacao" />
      </q-td>
    </template>
    <template #body-cell-manifestacaoDestinatario="props">
      <q-td :props="props">
        <nfe-recebida-status-pill tipo="manifestacao" :codigo="props.row.manifestacaoDestinatario" />
      </q-td>
    </template>
    <template #body-cell-nfeCompleta="props">
      <q-td :props="props">
        <agro-badge
          :label="props.row.nfeCompleta ? 'Completo' : 'Resumo'"
          :variant="props.row.nfeCompleta ? 'success' : 'warning'"
        />
      </q-td>
    </template>
    <template #body-cell-cartaCorrecao="props">
      <q-td :props="props" :title="props.row.cartaCorrecao || undefined">{{ rotuloCarta(props.row) }}</q-td>
    </template>
    <template #body-cell-dataCancelamento="props">
      <q-td :props="props" :title="props.row.justificativaCancelamento || undefined">
        {{ props.row.dataCancelamento ? formatarData(props.row.dataCancelamento) : '—' }}
      </q-td>
    </template>
    <template #no-data>
      <empty-state
        titulo="Nenhuma NF-e recebida"
        descricao="Atualize da Focus para trazer as notas destinadas aos CNPJs da empresa."
        icon="receipt_long"
      />
    </template>
  </q-table>
</template>

<script setup lang="ts">
import NfeRecebidaStatusPill from 'components/fiscal/NfeRecebidaStatusPill.vue';
import AgroBadge from 'components/ui/AgroBadge.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { manifestacaoFinal } from 'composables/useNfesRecebidas';
import type { QTableColumn } from 'quasar';
import type { NfeRecebidaDto } from 'types/dtos/fiscal-gestao.dto';
import { formatarCnpj, formatarCpf, formatarData, formatarMoeda } from 'utils/formatters';
import { watch } from 'vue';

defineProps<{
  notas: NfeRecebidaDto[];
  manifestando: boolean;
  carregando: boolean;
}>();

const selecionados = defineModel<NfeRecebidaDto[]>('selecionados', { required: true });

watch(selecionados, (lista) => {
  const elegiveis = lista.filter((nota) => !manifestacaoFinal(nota.manifestacaoDestinatario));
  if (elegiveis.length !== lista.length) selecionados.value = elegiveis;
});

const colunas: QTableColumn[] = [
  { name: 'emitente', label: 'Emitente', field: 'nomeEmitente', align: 'left' },
  { name: 'chaveNfe', label: 'Chave', field: 'chaveNfe', align: 'left' },
  { name: 'valorTotal', label: 'Valor', field: 'valorTotal', align: 'right' },
  { name: 'dataEmissao', label: 'Emissão', field: 'dataEmissao', align: 'left' },
  { name: 'situacao', label: 'Situação', field: 'situacao', align: 'left' },
  { name: 'manifestacaoDestinatario', label: 'Manifestação', field: 'manifestacaoDestinatario', align: 'left' },
  { name: 'nfeCompleta', label: 'XML', field: 'nfeCompleta', align: 'left' },
  { name: 'cartaCorrecao', label: 'Carta de correção', field: 'cartaCorrecao', align: 'left' },
  { name: 'dataCancelamento', label: 'Cancelamento', field: 'dataCancelamento', align: 'left' },
];

function rotuloCarta(nota: NfeRecebidaDto): string {
  if (nota.numeroCartaCorrecao) return `Nº ${nota.numeroCartaCorrecao}`;
  if (nota.cartaCorrecao) return 'Sim';
  return '—';
}

function documentoEmitente(valor: string): string {
  const digitos = valor.replace(/\D/g, '');
  if (!digitos) return '—';
  if (digitos.length <= 11) return formatarCpf(digitos);
  return formatarCnpj(digitos);
}
</script>

<style scoped>
.emitente {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
  min-width: 10rem;
}

.emitente__nome {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
}

.emitente__doc {
  color: var(--color-text-secondary);
  font-size: var(--font-size-xs);
}

.chave {
  display: inline-block;
  max-width: 14rem;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: bottom;
  white-space: nowrap;
}

:deep(.q-table tbody tr.selected) {
  background: var(--color-primary-50);
}
</style>
