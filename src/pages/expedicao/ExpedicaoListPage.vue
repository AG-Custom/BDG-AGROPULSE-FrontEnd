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
              <agro-acoes-menu
                :mostrar-editar="false"
                :mostrar-status="false"
                @visualizar="abrirDialogVisualizar(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>

    <q-dialog v-model="dialogVisualizar">
      <q-card class="dialog-visualizar">
        <q-card-section>
          <h4 class="titulo">Visualizar pedido de expedição</h4>
        </q-card-section>
        <q-card-section>
          <q-form class="agro-formulario agro-formulario--bloqueado">
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-input
                  :model-value="pedidoVisualizar ? rotuloCliente(pedidoVisualizar.clienteId) : ''"
                  outlined
                  label="Cliente"
                  readonly
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  :model-value="pedidoVisualizar ? formatarMoeda(pedidoVisualizar.valorTotal) : ''"
                  outlined
                  label="Valor total"
                  readonly
                  input-class="text-metric"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  :model-value="pedidoVisualizar?.status ?? ''"
                  outlined
                  label="Status"
                  readonly
                />
              </div>
            </div>
            <div class="agro-form-actions">
              <agro-btn flat label="Fechar" descricao="Fechar" @click="dialogVisualizar = false" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useClientes } from 'composables/useClientes';
import { useExpedicao } from 'composables/useExpedicao';
import type { QTableColumn } from 'quasar';
import type { ExpedicaoPedidoDto } from 'types/dtos/expedicao.dto';
import { formatarMoeda } from 'utils/formatters';
import { computed, onMounted, ref } from 'vue';

const { pedidos, carregando, carregar } = useExpedicao();
const { clientes, carregar: carregarClientes } = useClientes();

const dialogVisualizar = ref(false);
const pedidoVisualizar = ref<ExpedicaoPedidoDto | null>(null);

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

function abrirDialogVisualizar(item: ExpedicaoPedidoDto): void {
  pedidoVisualizar.value = item;
  dialogVisualizar.value = true;
}

onMounted(() => {
  void carregarClientes();
  void carregar();
});
</script>

<style scoped>
.dialog-visualizar {
  min-width: min(480px, 94vw);
}
.titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
</style>
