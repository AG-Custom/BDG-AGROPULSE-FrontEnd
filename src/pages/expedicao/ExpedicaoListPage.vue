<template>
  <q-page class="agro-page">
    <app-page-header titulo="Expedição" subtitulo="Pedidos prontos para montagem de romaneio." />

    <section class="agro-section">
      <agro-card>
        <agro-table-skeleton v-if="carregando && pedidos.length === 0" :colunas="5" />
        <empty-state
          v-else-if="!carregando && pedidos.length === 0"
          titulo="Nenhum pedido para expedir"
          descricao="Não há pedidos aprovados aguardando romaneio."
          icon="local_shipping"
        />
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="pedidos"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-clienteId="props">
            <q-td :props="props">{{ rotuloCliente(props.row.clienteId) }}</q-td>
          </template>
          <template #body-cell-valorTotal="props">
            <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.valorTotal) }}</q-td>
          </template>
          <template #body-cell-status="props">
            <q-td :props="props"><agro-badge :label="props.row.status" variant="default" /></q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props">
              <agro-btn
                flat
                round
                dense
                icon="inventory"
                color="primary"
                descricao="Abrir romaneio"
                :to="{ name: 'expedicao-romaneio', params: { pedidoId: props.row.id } }"
              />
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useClientes } from 'composables/useClientes';
import { useExpedicao } from 'composables/useExpedicao';
import type { QTableColumn } from 'quasar';
import type { ExpedicaoPedidoDto } from 'types/dtos/expedicao.dto';
import { formatarMoeda } from 'utils/formatters';
import { computed, onMounted } from 'vue';

const { pedidos, carregando, carregar } = useExpedicao();
const { clientes, carregar: carregarClientes } = useClientes();

const mapa = computed(() => {
  const m = new Map<string, string>();
  for (const c of clientes.value) m.set(c.id, c.nomeRazao);
  return m;
});

const colunas: QTableColumn<ExpedicaoPedidoDto>[] = [
  { name: 'clienteId', label: 'Cliente', field: 'clienteId', align: 'left' },
  { name: 'valorTotal', label: 'Total', field: 'valorTotal', align: 'right' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function rotuloCliente(id: string): string {
  return mapa.value.get(id) ?? id;
}

onMounted(() => {
  void carregarClientes();
  void carregar();
});
</script>
