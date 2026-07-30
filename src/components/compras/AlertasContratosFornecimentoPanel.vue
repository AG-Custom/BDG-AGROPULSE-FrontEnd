<template>
  <agro-card>
    <div class="cabecalho">
      <div>
        <div class="text-subtitle1">Alertas de vencimento</div>
        <div class="text-caption text-secondary">
          Contratos de fornecimento com vigência nos próximos {{ dias }} dias.
        </div>
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
      descricao="Nenhum contrato próximo do vencimento."
      icon="notifications_none"
    />
    <q-table
      v-else
      flat
      bordered
      row-key="contratoId"
      :rows="alertas"
      :columns="colunas"
      :loading="loading"
      hide-pagination
      :pagination="{ rowsPerPage: 0 }"
    >
      <template #body-cell-severidade="props">
        <q-td :props="props">
          <agro-badge :label="props.row.severidade" :variant="variantSeveridade(props.row.severidade)" />
        </q-td>
      </template>
      <template #body-cell-vigenciaFim="props">
        <q-td :props="props">{{ formatarData(props.row.vigenciaFim) }}</q-td>
      </template>
      <template #body-cell-diasParaVencimento="props">
        <q-td :props="props" class="text-metric">{{ props.row.diasParaVencimento }}d</q-td>
      </template>
      <template #body-cell-acoes="props">
        <q-td :props="props">
          <agro-acoes-menu
            :mostrar-visualizar="false"
            :mostrar-status="false"
            editar-label="Editar contrato"
            :editar-to="{
              name: 'contrato-fornecimento-editar',
              params: { id: props.row.contratoId },
            }"
          />
        </q-td>
      </template>
    </q-table>
  </agro-card>
</template>

<script setup lang="ts">
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import type { QTableColumn } from 'quasar';
import type { ContratoFornecimentoAlertaDto } from 'types/dtos/compras.dto';
import { formatarData } from 'utils/formatters';

withDefaults(
  defineProps<{
    alertas: ContratoFornecimentoAlertaDto[];
    loading?: boolean;
    dias?: number;
  }>(),
  { loading: false, dias: 30 },
);

defineEmits<{
  atualizar: [];
}>();

const colunas: QTableColumn<ContratoFornecimentoAlertaDto>[] = [
  { name: 'severidade', label: 'Severidade', field: 'severidade', align: 'left' },
  { name: 'numero', label: 'Número', field: 'numero', align: 'left' },
  { name: 'mensagem', label: 'Mensagem', field: 'mensagem', align: 'left' },
  { name: 'vigenciaFim', label: 'Vigência fim', field: 'vigenciaFim', align: 'left' },
  { name: 'diasParaVencimento', label: 'Dias', field: 'diasParaVencimento', align: 'right' },
  { name: 'acoes', label: '', field: 'contratoId', align: 'right' },
];

function variantSeveridade(
  severidade: string,
): 'error' | 'warning' | 'info' | 'default' {
  const s = severidade.toLowerCase();
  if (s.includes('crit')) return 'error';
  if (s.includes('alerta')) return 'warning';
  if (s.includes('info')) return 'info';
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
