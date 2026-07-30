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
              <agro-acoes-menu
                :mostrar-editar="false"
                :mostrar-status="false"
                :visualizar-to="{ name: 'pedido-compra-detalhe', params: { id: props.row.id } }"
                visualizar-label="Ver pedido"
              >
                <q-item
                  v-close-popup
                  clickable
                  dense
                  class="agro-acoes-menu__item"
                  :disable="salvando"
                  @click="aprovar(props.row.id)"
                >
                  <q-item-section avatar>
                    <span class="agro-acoes-menu__icon agro-acoes-menu__icon--success">
                      <q-icon name="check" size="16px" />
                    </span>
                  </q-item-section>
                  <q-item-section>Aprovar</q-item-section>
                </q-item>
                <q-item
                  v-close-popup
                  clickable
                  dense
                  class="agro-acoes-menu__item"
                  :disable="salvando"
                  @click="rejeitar(props.row.id)"
                >
                  <q-item-section avatar>
                    <span class="agro-acoes-menu__icon agro-acoes-menu__icon--danger">
                      <q-icon name="close" size="16px" />
                    </span>
                  </q-item-section>
                  <q-item-section>Rejeitar</q-item-section>
                </q-item>
              </agro-acoes-menu>
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
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
