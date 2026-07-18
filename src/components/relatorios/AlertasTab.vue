<template>
  <div class="painel">
    <div class="agro-filter-bar">
      <agro-btn
        color="primary"
        unelevated
        label="Atualizar"
        descricao="Carregar alertas gerenciais"
        :loading="carregando"
        @click="atualizar"
      />
    </div>

    <agro-table-skeleton v-if="carregando && alertas.length === 0" :colunas="4" />
    <empty-state
      v-else-if="!carregando && alertas.length === 0"
      titulo="Sem alertas"
      descricao="Não há alertas gerenciais no momento."
      icon="notifications_none"
    />
    <q-table
      v-else
      flat
      bordered
      :row-key="rowKey"
      :rows="alertas"
      :columns="colunas"
      :loading="carregando"
      :rows-per-page-options="[10, 25, 50]"
    >
      <template #body-cell-severidade="props">
        <q-td :props="props">
          <agro-badge
            :label="props.row.severidade"
            :variant="variantSeveridade(props.row.severidade)"
          />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useRelatorios } from 'composables/useRelatorios';
import type { QTableColumn } from 'quasar';
import type { AlertaGerencialDto } from 'types/dtos/relatorio.dto';
import { onMounted } from 'vue';

const { alertas, carregando, carregarAlertas } = useRelatorios();

const colunas: QTableColumn<AlertaGerencialDto>[] = [
  { name: 'severidade', label: 'Severidade', field: 'severidade', align: 'left' },
  { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'left' },
  { name: 'titulo', label: 'Título', field: 'titulo', align: 'left' },
  { name: 'descricao', label: 'Descrição', field: 'descricao', align: 'left' },
];

function rowKey(row: AlertaGerencialDto): string {
  return `${row.tipo}-${row.titulo}-${row.referenciaId ?? ''}`;
}

function variantSeveridade(severidade: string): 'error' | 'warning' | 'default' | 'success' {
  const s = severidade.toLowerCase();
  if (s.includes('crit')) return 'error';
  if (s.includes('alerta')) return 'warning';
  return 'default';
}

async function atualizar(): Promise<void> {
  await carregarAlertas();
}

onMounted(() => {
  void atualizar();
});
</script>

<style scoped>
.painel {
  padding-top: var(--spacing-4);
}
</style>
