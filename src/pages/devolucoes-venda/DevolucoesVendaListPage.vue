<template>
  <q-page class="agro-page">
    <app-page-header titulo="Devoluções de venda" subtitulo="Registre e processe devoluções.">
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Nova devolução"
        descricao="Registrar devolução"
        :to="{ name: 'devolucao-venda-nova' }"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <agro-table-skeleton v-if="carregando && devolucoes.length === 0" :colunas="4" />
        <empty-state
          v-else-if="!carregando && devolucoes.length === 0"
          titulo="Nenhuma devolução"
          descricao="Registre a primeira devolução de venda."
          icon="assignment_return"
        >
          <agro-btn
            color="primary"
            unelevated
            label="Nova devolução"
            descricao="Registrar devolução"
            :to="{ name: 'devolucao-venda-nova' }"
          />
        </empty-state>
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="devolucoes"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-createdAt="props">
            <q-td :props="props">{{ formatarDataHora(props.row.createdAt) }}</q-td>
          </template>
          <template #body-cell-status="props">
            <q-td :props="props"><agro-badge :label="props.row.status" variant="default" /></q-td>
          </template>
          <template #body-cell-itens="props">
            <q-td :props="props" class="text-metric">{{ props.row.itens.length }}</q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props">
              <agro-acoes-menu
                :mostrar-editar="false"
                :mostrar-status="false"
                :visualizar-to="{ name: 'devolucao-venda-detalhe', params: { id: props.row.id } }"
              />
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useDevolucoesVenda } from 'composables/useDevolucoesVenda';
import type { QTableColumn } from 'quasar';
import type { DevolucaoVendaDto } from 'types/dtos/devolucao-venda.dto';
import { formatarDataHora } from 'utils/formatters';
import { onMounted } from 'vue';

const { devolucoes, carregando, carregar } = useDevolucoesVenda();

const colunas: QTableColumn<DevolucaoVendaDto>[] = [
  { name: 'createdAt', label: 'Criada em', field: 'createdAt', align: 'left', sortable: true },
  { name: 'pedidoVendaId', label: 'Pedido', field: 'pedidoVendaId', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'itens', label: 'Itens', field: 'id', align: 'right' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

onMounted(() => {
  void carregar();
});
</script>
