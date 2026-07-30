<template>
  <q-page class="agro-page">
    <app-page-header titulo="Vendas PDV" subtitulo="Histórico de vendas do ponto de venda.">
      <agro-btn
        color="primary"
        unelevated
        icon="point_of_sale"
        label="Nova venda"
        descricao="Abrir PDV"
        :to="{ name: 'pdv-vender' }"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <div class="agro-filter-bar">
          <q-select
            v-model="filtroStatus"
            outlined
            dense
            label="Status"
            emit-value
            map-options
            clearable
            class="pdv-vendas__status"
            :options="PdvVendaStatusOpcoes"
          />
        </div>

        <agro-table-skeleton v-if="carregando && vendas.length === 0" :colunas="5" />

        <empty-state
          v-else-if="!carregando && vendas.length === 0"
          titulo="Nenhuma venda PDV"
          descricao="Registre a primeira venda no ponto de venda."
          icon="point_of_sale"
        >
          <agro-btn
            color="primary"
            unelevated
            label="Nova venda"
            descricao="Abrir PDV"
            :to="{ name: 'pdv-vender' }"
          />
        </empty-state>

        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="vendas"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-createdAt="props">
            <q-td :props="props">{{ formatarDataHora(props.row.createdAt) }}</q-td>
          </template>
          <template #body-cell-clienteId="props">
            <q-td :props="props">
              {{ props.row.clienteId ? rotuloCliente(props.row.clienteId) : '—' }}
            </q-td>
          </template>
          <template #body-cell-valorTotal="props">
            <q-td :props="props" class="text-metric">
              {{ formatarMoeda(props.row.valorTotal) }}
            </q-td>
          </template>
          <template #body-cell-status="props">
            <q-td :props="props">
              <agro-badge :label="props.row.status" variant="default" />
            </q-td>
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

    <agro-entity-details-dialog
      v-model="dialogVisualizar"
      :titulo="tituloDetalhe"
      :registro="registroSelecionado"
    />
  </q-page>
</template>

<script setup lang="ts">
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroEntityDetailsDialog from 'components/ui/AgroEntityDetailsDialog.vue';
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useClientes } from 'composables/useClientes';
import { usePdv } from 'composables/usePdv';
import { PdvVendaStatusOpcoes, type PdvVendaStatusValor } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { PdvVendaResumoDto } from 'types/dtos/pdv.dto';
import { formatarDataHora, formatarMoeda } from 'utils/formatters';
import { computed, onMounted, ref, watch } from 'vue';


const dialogVisualizar = ref(false);
const registroSelecionado = ref<Record<string, unknown> | null>(null);
const tituloDetalhe = computed(() => 'Detalhes de Vendas PDV');

const { vendas, carregando, carregarVendas } = usePdv();
const { clientes, carregar: carregarClientes } = useClientes();
const filtroStatus = ref<PdvVendaStatusValor | null>(null);

const mapaClientes = computed(() => {
  const m = new Map<string, string>();
  for (const c of clientes.value) m.set(c.id, c.nomeRazao);
  return m;
});

const colunas: QTableColumn<PdvVendaResumoDto>[] = [
  { name: 'createdAt', label: 'Data', field: 'createdAt', align: 'left', sortable: true },
  { name: 'clienteId', label: 'Cliente', field: 'clienteId', align: 'left' },
  { name: 'valorTotal', label: 'Total', field: 'valorTotal', align: 'right', sortable: true },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function rotuloCliente(id: string): string {
  return mapaClientes.value.get(id) ?? id;
}

watch(filtroStatus, () => {
  void carregarVendas(filtroStatus.value ? { status: filtroStatus.value } : undefined);
});

onMounted(() => {
  void carregarClientes();
  void carregarVendas();
});
function abrirDialogVisualizar(registro: Record<string, unknown> | object): void {
  registroSelecionado.value = registro as Record<string, unknown>;
  dialogVisualizar.value = true;
}

</script>

<style scoped>
.pdv-vendas__status {
  min-width: 160px;
}
</style>
