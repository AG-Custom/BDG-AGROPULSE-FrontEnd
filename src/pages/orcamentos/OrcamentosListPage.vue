<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Orçamentos"
      subtitulo="Gerencie orçamentos e conversão em pedidos de venda."
    >
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Novo orçamento"
        descricao="Criar novo orçamento"
        :to="{ name: 'orcamento-novo' }"
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
            class="orcamentos-list__status"
            :options="OrcamentoStatusOpcoes"
          />
        </div>

        <agro-table-skeleton v-if="carregando && orcamentos.length === 0" :colunas="6" />

        <empty-state
          v-else-if="!carregando && orcamentos.length === 0"
          titulo="Nenhum orçamento encontrado"
          descricao="Crie o primeiro orçamento da unidade."
          icon="request_quote"
        >
          <agro-btn
            color="primary"
            unelevated
            label="Novo orçamento"
            descricao="Criar novo orçamento"
            :to="{ name: 'orcamento-novo' }"
          />
        </empty-state>

        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="orcamentos"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-createdAt="props">
            <q-td :props="props">{{ formatarDataHora(props.row.createdAt) }}</q-td>
          </template>
          <template #body-cell-clienteId="props">
            <q-td :props="props">{{ rotuloCliente(props.row.clienteId) }}</q-td>
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
            <q-td :props="props" class="orcamentos-list__acoes">
              <agro-acoes-menu
                :mostrar-editar="props.row.status === OrcamentoStatus.Aberto"
                :mostrar-status="false"
                :visualizar-to="{ name: 'orcamento-detalhe', params: { id: props.row.id } }"
                :editar-to="{ name: 'orcamento-editar', params: { id: props.row.id } }"
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
import { useClientes } from 'composables/useClientes';
import { useOrcamentos } from 'composables/useOrcamentos';
import {
  OrcamentoStatus,
  OrcamentoStatusOpcoes,
  type OrcamentoStatusValor,
} from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { OrcamentoResumoDto } from 'types/dtos/orcamento.dto';
import { formatarDataHora, formatarMoeda } from 'utils/formatters';
import { computed, onMounted, ref, watch } from 'vue';

const { orcamentos, carregando, carregar } = useOrcamentos();
const { clientes, carregar: carregarClientes } = useClientes();

const filtroStatus = ref<OrcamentoStatusValor | null>(null);

const mapaClientes = computed(() => {
  const mapa = new Map<string, string>();
  for (const c of clientes.value) mapa.set(c.id, c.nomeRazao);
  return mapa;
});

const colunas: QTableColumn<OrcamentoResumoDto>[] = [
  { name: 'createdAt', label: 'Criado em', field: 'createdAt', align: 'left', sortable: true },
  { name: 'clienteId', label: 'Cliente', field: 'clienteId', align: 'left' },
  { name: 'valorTotal', label: 'Total', field: 'valorTotal', align: 'right', sortable: true },
  { name: 'status', label: 'Status', field: 'status', align: 'left', sortable: true },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function rotuloCliente(id: string): string {
  return mapaClientes.value.get(id) ?? id;
}

watch(filtroStatus, () => {
  void carregar(filtroStatus.value ? { status: filtroStatus.value } : undefined);
});

onMounted(() => {
  void carregarClientes();
  void carregar();
});
</script>

<style scoped>
.orcamentos-list__status {
  min-width: 160px;
}
.orcamentos-list__acoes {
  white-space: nowrap;
}
</style>
