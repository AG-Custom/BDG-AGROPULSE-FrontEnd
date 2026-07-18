<template>
  <agro-card>
    <div class="cabecalho">
      <div>
        <div class="text-subtitle1">Alertas de contratos</div>
        <div class="text-caption text-secondary">Vencimentos 30 / 15 / 5 dias e pré-colheita.</div>
      </div>
      <agro-btn
        flat
        icon="refresh"
        label="Atualizar"
        descricao="Atualizar alertas"
        :loading="loading"
        @click="$emit('atualizar')"
      />
    </div>

    <agro-table-skeleton v-if="loading && alertas.length === 0" :colunas="4" />
    <empty-state
      v-else-if="!loading && alertas.length === 0"
      titulo="Sem alertas"
      descricao="Nenhum alerta de vencimento ou entrega no momento."
      icon="notifications_none"
    />
    <q-table
      v-else
      flat
      bordered
      row-key="id"
      :rows="alertas"
      :columns="colunas"
      :loading="loading"
      :rows-per-page-options="[5, 10, 25]"
      hide-pagination
      :pagination="{ rowsPerPage: 0 }"
    >
      <template #body-cell-severidade="props">
        <q-td :props="props">
          <agro-badge :label="props.row.severidade" :variant="variantSeveridade(props.row.severidade)" />
        </q-td>
      </template>
      <template #body-cell-diasRestantes="props">
        <q-td :props="props">
          <span v-if="props.row.diasRestantes != null" class="text-metric">
            {{ props.row.diasRestantes }}d
          </span>
          <span v-else>—</span>
        </q-td>
      </template>
      <template #body-cell-acoes="props">
        <q-td :props="props">
          <agro-btn
            flat
            round
            dense
            icon="visibility"
            color="primary"
            descricao="Ver contrato"
            :to="{
              name: 'contrato-detalhe',
              params: { id: props.row.contratoId },
              query: { tipo: props.row.tipoContrato },
            }"
          />
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
import type { AlertaContratoDto } from 'types/dtos/contrato.dto';

defineProps<{
  alertas: AlertaContratoDto[];
  loading?: boolean;
}>();

defineEmits<{
  atualizar: [];
}>();

const colunas: QTableColumn<AlertaContratoDto>[] = [
  { name: 'severidade', label: 'Severidade', field: 'severidade', align: 'left' },
  { name: 'tipoContrato', label: 'Tipo', field: 'tipoContrato', align: 'left' },
  { name: 'titulo', label: 'Título', field: 'titulo', align: 'left' },
  { name: 'descricao', label: 'Descrição', field: 'descricao', align: 'left' },
  { name: 'diasRestantes', label: 'Dias', field: 'diasRestantes', align: 'right' },
  { name: 'acoes', label: '', field: 'id', align: 'right' },
];

function variantSeveridade(
  severidade: string,
): 'error' | 'warning' | 'info' | 'default' {
  const s = severidade.toLowerCase();
  if (s.includes('crit')) return 'error';
  if (s.includes('alerta')) return 'warning';
  if (s.includes('aviso')) return 'info';
  return 'default';
}
</script>

<style scoped>
.cabecalho {
  align-items: flex-start;
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-3);
  justify-content: space-between;
  margin-bottom: var(--spacing-4);
}
</style>
