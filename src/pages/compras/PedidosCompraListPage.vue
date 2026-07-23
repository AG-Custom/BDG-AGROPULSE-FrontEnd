<template>
  <q-page class="agro-page">
    <app-page-header titulo="Pedidos de compra" subtitulo="Acompanhe envio e recebimento.">
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Novo pedido"
        descricao="Criar pedido de compra"
        :to="{ name: 'pedido-compra-novo' }"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <agro-table-skeleton v-if="carregando && pedidos.length === 0" :colunas="5" />
        <empty-state
          v-else-if="!carregando && pedidos.length === 0"
          titulo="Nenhum pedido"
          descricao="Crie o primeiro pedido de compra."
          icon="local_mall"
        >
          <agro-btn
            color="primary"
            unelevated
            label="Novo pedido"
            descricao="Criar pedido"
            :to="{ name: 'pedido-compra-novo' }"
          />
        </empty-state>
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
          <template #body-cell-createdAt="props">
            <q-td :props="props">{{ formatarDataHora(props.row.createdAt) }}</q-td>
          </template>
          <template #body-cell-fornecedorId="props">
            <q-td :props="props">{{ rotuloFornecedor(props.row.fornecedorId) }}</q-td>
          </template>
          <template #body-cell-valorTotal="props">
            <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.valorTotal) }}</q-td>
          </template>
          <template #body-cell-status="props">
            <q-td :props="props"><agro-badge :label="props.row.status" variant="default" /></q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props">
              <agro-acoes-menu
                :mostrar-editar="false"
                :mostrar-status="false"
                :visualizar-to="{ name: 'pedido-compra-detalhe', params: { id: props.row.id } }"
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
import { useCompras } from 'composables/useCompras';
import { useFornecedores } from 'composables/useFornecedores';
import type { QTableColumn } from 'quasar';
import type { PedidoCompraDto } from 'types/dtos/compras.dto';
import { formatarDataHora, formatarMoeda } from 'utils/formatters';
import { computed, onMounted } from 'vue';

const { pedidos, carregando, carregarPedidos } = useCompras();
const { fornecedores, carregar: carregarFornecedores } = useFornecedores();

const mapa = computed(() => {
  const m = new Map<string, string>();
  for (const f of fornecedores.value) m.set(f.id, f.razaoSocial);
  return m;
});

const colunas: QTableColumn<PedidoCompraDto>[] = [
  { name: 'createdAt', label: 'Criado em', field: 'createdAt', align: 'left', sortable: true },
  { name: 'fornecedorId', label: 'Fornecedor', field: 'fornecedorId', align: 'left' },
  { name: 'valorTotal', label: 'Total', field: 'valorTotal', align: 'right' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function rotuloFornecedor(id: string): string {
  return mapa.value.get(id) ?? id;
}

onMounted(() => {
  void carregarFornecedores();
  void carregarPedidos();
});
</script>
