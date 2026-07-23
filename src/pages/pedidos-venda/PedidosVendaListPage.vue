<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Pedidos de venda"
      subtitulo="Gerencie orçamentos, aprovações e faturamento da unidade atual."
    >
      <div class="pedidos-venda-list__acoes-header">
        <agro-btn
          flat
          icon="table_view"
          label="Excel"
          descricao="Exportar listagem para Excel"
          :loading="exportando"
          @click="exportarLista('excel')"
        />
        <agro-btn
          flat
          icon="picture_as_pdf"
          label="PDF"
          descricao="Exportar listagem para PDF"
          :loading="exportando"
          @click="exportarLista('pdf')"
        />
        <agro-btn
          color="primary"
          unelevated
          icon="add"
          label="Novo pedido"
          descricao="Criar novo pedido de venda"
          :to="{ name: 'pedido-venda-novo' }"
        />
      </div>
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <div class="agro-filter-bar">
          <q-input
            v-model="filtroDe"
            outlined
            dense
            label="De"
            type="date"
            class="pedidos-venda-list__data"
            clearable
          />
          <q-input
            v-model="filtroAte"
            outlined
            dense
            label="Até"
            type="date"
            class="pedidos-venda-list__data"
            clearable
          />
          <q-select
            v-model="filtroCliente"
            outlined
            dense
            label="Cliente"
            emit-value
            map-options
            clearable
            class="pedidos-venda-list__cliente"
            :options="clienteOpcoes"
            :loading="carregandoClientes"
          />
          <q-select
            v-model="filtroStatus"
            outlined
            dense
            label="Status"
            emit-value
            map-options
            clearable
            class="pedidos-venda-list__status"
            :options="PedidoVendaStatusOpcoes"
          />
          <q-select
            v-model="filtroVendedor"
            outlined
            dense
            label="Vendedor"
            emit-value
            map-options
            clearable
            class="pedidos-venda-list__vendedor"
            :options="vendedorOpcoes"
            :loading="carregandoUsuarios"
          />
        </div>

        <agro-table-skeleton v-if="carregando && pedidos.length === 0" :colunas="7" />

        <empty-state
          v-else-if="!carregando && pedidos.length === 0"
          titulo="Nenhum pedido encontrado"
          :descricao="descricaoVazia"
          icon="shopping_cart"
        >
          <agro-btn
            v-if="semFiltros"
            color="primary"
            unelevated
            label="Criar pedido"
            descricao="Ir para o cadastro de pedido"
            :to="{ name: 'pedido-venda-novo' }"
          />
        </empty-state>

        <q-table
          v-else
          flat
          bordered
          row-key="id"
          class="pedidos-venda-list__tabela"
          :rows="pedidos"
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

          <template #body-cell-status="props">
            <q-td :props="props">
              <agro-badge
                :label="rotuloPedidoVendaStatus(props.row.status)"
                :variant="variantePedidoVendaStatus(props.row.status)"
              />
            </q-td>
          </template>

          <template #body-cell-dataExpiracao="props">
            <q-td :props="props">
              {{ formatarData(props.row.dataExpiracao) }}
            </q-td>
          </template>

          <template #body-cell-acoes="props">
            <q-td :props="props" class="pedidos-venda-list__acoes">
              <agro-acoes-menu
                :mostrar-editar="props.row.status === PedidoVendaStatus.Orcamento"
                :mostrar-status="false"
                :visualizar-to="{ name: 'pedido-venda-detalhe', params: { id: props.row.id } }"
                :editar-to="{ name: 'pedido-venda-editar', params: { id: props.row.id } }"
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
import { usePedidosVenda } from 'composables/usePedidosVenda';
import { useUsuarios } from 'composables/useUsuarios';
import {
  PedidoVendaStatus,
  PedidoVendaStatusOpcoes,
  PerfilUsuario,
  UsuarioStatus,
  type ExportacaoPedidoFormatoValor,
  type PedidoVendaStatusValor,
} from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { ListarPedidosVendaParams, PedidoVendaResumoDto } from 'types/dtos/pedido-venda.dto';
import { formatarData, formatarDataHora, formatarMoeda } from 'utils/formatters';
import {
  rotuloPedidoVendaStatus,
  variantePedidoVendaStatus,
} from 'utils/pedido-venda.helpers';
import { computed, onMounted, ref, watch } from 'vue';

const { pedidos, carregando, exportando, carregar, exportar } = usePedidosVenda();
const {
  clientes,
  carregando: carregandoClientes,
  carregar: carregarClientes,
} = useClientes();
const {
  usuarios,
  carregando: carregandoUsuarios,
  carregar: carregarUsuarios,
  nomeCompleto,
} = useUsuarios();

const filtroDe = ref('');
const filtroAte = ref('');
const filtroCliente = ref<string | null>(null);
const filtroStatus = ref<PedidoVendaStatusValor | null>(null);
const filtroVendedor = ref<string | null>(null);

const clienteOpcoes = computed(() =>
  clientes.value.map((cliente) => ({
    label: cliente.nomeRazao,
    value: cliente.id,
  })),
);

const vendedorOpcoes = computed(() =>
  usuarios.value
    .filter(
      (usuario) =>
        usuario.status === UsuarioStatus.Ativo &&
        (usuario.perfil === PerfilUsuario.Vendedor ||
          usuario.perfil === PerfilUsuario.Gerente ||
          usuario.perfil === PerfilUsuario.Diretor),
    )
    .map((usuario) => ({
      label: nomeCompleto(usuario),
      value: usuario.id,
    })),
);

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

const semFiltros = computed(
  () =>
    !filtroDe.value &&
    !filtroAte.value &&
    !filtroCliente.value &&
    !filtroStatus.value &&
    !filtroVendedor.value,
);

const descricaoVazia = computed(() =>
  semFiltros.value
    ? 'Crie o primeiro pedido de venda da unidade.'
    : 'Nenhum pedido corresponde aos filtros informados.',
);

const colunas: QTableColumn<PedidoVendaResumoDto>[] = [
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
  { name: 'status', label: 'Status', field: 'status', align: 'left', sortable: true },
  {
    name: 'dataExpiracao',
    label: 'Expiração',
    field: 'dataExpiracao',
    align: 'left',
    sortable: true,
  },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function rotuloCliente(clienteId: string): string {
  return mapaClientes.value.get(clienteId) ?? clienteId;
}

function rotuloVendedor(vendedorId: string): string {
  return mapaVendedores.value.get(vendedorId) ?? vendedorId;
}

function montarParams(): ListarPedidosVendaParams {
  const params: ListarPedidosVendaParams = {};

  if (filtroDe.value) {
    params.de = filtroDe.value;
  }

  if (filtroAte.value) {
    params.ate = filtroAte.value;
  }

  if (filtroCliente.value) {
    params.clienteId = filtroCliente.value;
  }

  if (filtroStatus.value) {
    params.status = filtroStatus.value;
  }

  if (filtroVendedor.value) {
    params.vendedorId = filtroVendedor.value;
  }

  return params;
}

async function recarregar(): Promise<void> {
  await carregar(montarParams());
}

async function exportarLista(formato: ExportacaoPedidoFormatoValor): Promise<void> {
  await exportar(formato, montarParams());
}

watch(
  [filtroDe, filtroAte, filtroCliente, filtroStatus, filtroVendedor],
  () => {
    void recarregar();
  },
);

onMounted(() => {
  void carregarClientes();
  void carregarUsuarios();
  void recarregar();
});
</script>

<style scoped>
.pedidos-venda-list__acoes-header {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
}

.pedidos-venda-list__data {
  min-width: 150px;
}

.pedidos-venda-list__cliente,
.pedidos-venda-list__vendedor {
  min-width: 200px;
}

.pedidos-venda-list__status {
  min-width: 160px;
}

.pedidos-venda-list__acoes {
  white-space: nowrap;
}
</style>
