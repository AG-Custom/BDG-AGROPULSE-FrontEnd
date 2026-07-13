<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Aprovações de compra"
      subtitulo="Pedidos aguardando aprovação por alçada de valor."
    />

    <section class="agro-section">
      <agro-card>
        <agro-table-skeleton v-if="carregando && aprovacoes.length === 0" :colunas="5" />
        <empty-state
          v-else-if="!carregando && aprovacoes.length === 0"
          titulo="Nenhuma aprovação pendente"
          descricao="Não há pedidos aguardando aprovação no momento."
          icon="verified"
        />
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="aprovacoes"
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
            <q-td :props="props">
              <agro-badge :label="rotuloStatus(props.row.status)" variant="default" />
            </q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props">
              <div class="acoes-linha">
                <agro-btn
                  flat
                  round
                  dense
                  icon="visibility"
                  color="primary"
                  descricao="Ver pedido"
                  :to="{ name: 'pedido-compra-detalhe', params: { id: props.row.id } }"
                />
                <agro-btn
                  flat
                  round
                  dense
                  icon="check"
                  color="positive"
                  descricao="Aprovar"
                  :loading="salvando"
                  @click="aprovar(props.row.id)"
                />
                <agro-btn
                  flat
                  round
                  dense
                  icon="close"
                  color="negative"
                  descricao="Rejeitar"
                  :loading="salvando"
                  @click="rejeitar(props.row.id)"
                />
              </div>
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
import { useComprasAprovacoes } from 'composables/useComprasAprovacoes';
import { useFornecedores } from 'composables/useFornecedores';
import { PedidoCompraStatusOpcoes } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { PedidoCompraDto } from 'types/dtos/compras.dto';
import { formatarDataHora, formatarMoeda } from 'utils/formatters';
import { computed, onMounted } from 'vue';

const { aprovacoes, carregando, salvando, carregarAprovacoes, aprovar, rejeitar } =
  useComprasAprovacoes();
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
function rotuloStatus(status: string): string {
  return PedidoCompraStatusOpcoes.find((o) => o.value === status)?.label ?? status;
}

onMounted(() => {
  void carregarFornecedores();
  void carregarAprovacoes();
});
</script>

<style scoped>
.acoes-linha {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-1);
}
</style>
