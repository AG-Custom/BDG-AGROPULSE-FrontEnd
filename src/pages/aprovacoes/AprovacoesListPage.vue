<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Fila de aprovações"
      subtitulo="Pedidos aguardando decisão, com travas de negócio recalculadas."
    />

    <section class="agro-section">
      <agro-card>
        <agro-table-skeleton v-if="carregando && fila.length === 0" :colunas="6" />

        <empty-state
          v-else-if="!carregando && fila.length === 0"
          titulo="Nenhum pedido aguardando"
          descricao="Quando um pedido for enviado para aprovação, ele aparecerá aqui."
          icon="rule"
        />

        <q-table
          v-else
          flat
          bordered
          row-key="pedidoId"
          class="aprovacoes-list__tabela"
          :rows="fila"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-createdAt="props">
            <q-td :props="props">
              {{ formatarDataHora(props.row.createdAt) }}
            </q-td>
          </template>

          <template #body-cell-clienteId="props">
            <q-td :props="props">
              {{ rotuloCliente(props.row.clienteId) }}
            </q-td>
          </template>

          <template #body-cell-vendedorUsuarioId="props">
            <q-td :props="props">
              {{ rotuloVendedor(props.row.vendedorUsuarioId) }}
            </q-td>
          </template>

          <template #body-cell-valorTotal="props">
            <q-td :props="props" class="text-metric">
              {{ formatarMoeda(props.row.valorTotal) }}
            </q-td>
          </template>

          <template #body-cell-dataExpiracao="props">
            <q-td :props="props">
              {{ formatarData(props.row.dataExpiracao) }}
            </q-td>
          </template>

          <template #body-cell-travas="props">
            <q-td :props="props">
              <div v-if="props.row.travas.length === 0" class="text-secondary">
                Sem travas
              </div>
              <div v-else class="aprovacoes-list__travas">
                <span
                  v-for="trava in props.row.travas"
                  :key="`${props.row.pedidoId}-${trava.tipo}`"
                >
                  <agro-badge
                    :label="rotuloTrava(trava.tipo)"
                    variant="warning"
                  />
                  <q-tooltip>{{ trava.motivo }}</q-tooltip>
                </span>
              </div>
            </q-td>
          </template>

          <template #body-cell-acoes="props">
            <q-td :props="props" class="aprovacoes-list__acoes">
              <agro-acoes-menu
                :mostrar-editar="false"
                :mostrar-status="false"
                :visualizar-to="{
                  name: 'pedido-venda-detalhe',
                  params: { id: props.row.pedidoId },
                }"
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
import { useAprovacoes } from 'composables/useAprovacoes';
import { useClientes } from 'composables/useClientes';
import { useUsuarios } from 'composables/useUsuarios';
import {
  TravaAprovacaoTipoOpcoes,
  type TravaAprovacaoTipoValor,
} from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { PedidoFilaAprovacaoDto } from 'types/dtos/aprovacao.dto';
import { formatarData, formatarDataHora, formatarMoeda } from 'utils/formatters';
import { computed, onMounted } from 'vue';

const { fila, carregando, carregar } = useAprovacoes();
const { clientes, carregar: carregarClientes } = useClientes();
const { usuarios, carregar: carregarUsuarios, nomeCompleto } = useUsuarios();

const colunas: QTableColumn<PedidoFilaAprovacaoDto>[] = [
  { name: 'createdAt', label: 'Criado em', field: 'createdAt', align: 'left', sortable: true },
  { name: 'clienteId', label: 'Cliente', field: 'clienteId', align: 'left', sortable: true },
  {
    name: 'vendedorUsuarioId',
    label: 'Vendedor',
    field: 'vendedorUsuarioId',
    align: 'left',
    sortable: true,
  },
  { name: 'valorTotal', label: 'Total', field: 'valorTotal', align: 'right', sortable: true },
  {
    name: 'dataExpiracao',
    label: 'Expiração',
    field: 'dataExpiracao',
    align: 'left',
    sortable: true,
  },
  { name: 'travas', label: 'Travas', field: 'pedidoId', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'pedidoId', align: 'right' },
];

const mapaClientes = computed(() => {
  const mapa = new Map<string, string>();
  for (const cliente of clientes.value) {
    mapa.set(cliente.id, cliente.nomeRazao);
  }
  return mapa;
});

const mapaVendedores = computed(() => {
  const mapa = new Map<string, string>();
  for (const usuario of usuarios.value) {
    mapa.set(usuario.id, nomeCompleto(usuario));
  }
  return mapa;
});

function rotuloCliente(clienteId: string): string {
  return mapaClientes.value.get(clienteId) ?? clienteId;
}

function rotuloVendedor(vendedorId: string): string {
  return mapaVendedores.value.get(vendedorId) ?? vendedorId;
}

function rotuloTrava(tipo: TravaAprovacaoTipoValor): string {
  return TravaAprovacaoTipoOpcoes.find((item) => item.value === tipo)?.label ?? tipo;
}

onMounted(() => {
  void carregarClientes();
  void carregarUsuarios();
  void carregar();
});
</script>

<style scoped>
.aprovacoes-list__travas {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-1);
}

.aprovacoes-list__acoes {
  white-space: nowrap;
}
</style>
