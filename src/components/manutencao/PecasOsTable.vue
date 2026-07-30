<template>
  <div>
    <q-table
      flat
      bordered
      row-key="id"
      hide-pagination
      :rows="pecas"
      :columns="colunas"
      :pagination="{ rowsPerPage: 0 }"
    >
      <template #body-cell-quantidade="props">
        <q-td :props="props" class="text-metric">{{ formatarDecimal(props.row.quantidade) }}</q-td>
      </template>
      <template #body-cell-valorUnitario="props">
        <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.valorUnitario) }}</q-td>
      </template>
      <template #body-cell-valorTotal="props">
        <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.valorTotal) }}</q-td>
      </template>
      <template #body-cell-baixaEstoqueRealizada="props">
        <q-td :props="props">{{ props.row.baixaEstoqueRealizada ? 'Sim' : 'Não' }}</q-td>
      </template>
      <template v-if="editavel" #body-cell-acoes="props">
        <q-td :props="props">
          <agro-acoes-menu
            :mostrar-visualizar="false"
            :mostrar-editar="false"
            :mostrar-status="false"
            mostrar-excluir
            :loading-excluir="salvando"
            :pode-excluir="!props.row.baixaEstoqueRealizada"
            excluir-label="Remover peça"
            @excluir="emit('remover', props.row.id)"
          />
        </q-td>
      </template>
      <template #no-data>
        <empty-state
          titulo="Nenhuma peça"
          descricao="Adicione peças do estoque ou descrição livre."
          icon="build"
        />
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import type { QTableColumn } from 'quasar';
import type { PecaOrdemServicoDto } from 'types/dtos/manutencao.dto';
import { formatarDecimal, formatarMoeda } from 'utils/formatters';
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    pecas: PecaOrdemServicoDto[];
    editavel?: boolean;
    salvando?: boolean;
  }>(),
  { editavel: false, salvando: false },
);

const emit = defineEmits<{
  remover: [pecaId: string];
}>();

const colunas = computed<QTableColumn<PecaOrdemServicoDto>[]>(() => {
  const base: QTableColumn<PecaOrdemServicoDto>[] = [
    { name: 'descricao', label: 'Descrição', field: 'descricao', align: 'left' },
    { name: 'quantidade', label: 'Qtd', field: 'quantidade', align: 'right' },
    { name: 'valorUnitario', label: 'Unitário', field: 'valorUnitario', align: 'right' },
    { name: 'valorTotal', label: 'Total', field: 'valorTotal', align: 'right' },
    {
      name: 'baixaEstoqueRealizada',
      label: 'Baixa estoque',
      field: 'baixaEstoqueRealizada',
      align: 'left',
    },
  ];
  if (props.editavel) {
    base.push({ name: 'acoes', label: 'Ações', field: 'id', align: 'right' });
  }
  return base;
});
</script>
