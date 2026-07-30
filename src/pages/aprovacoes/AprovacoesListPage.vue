<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Aprovações"
      subtitulo="Fila de decisão e histórico de pedidos aprovados ou recusados."
    />

    <section class="agro-section">
      <agro-card>
        <q-tabs
          v-model="aba"
          dense
          class="text-primary"
          active-color="primary"
          indicator-color="primary"
        >
          <q-tab name="fila" label="Fila" />
          <q-tab name="historico" label="Histórico" />
        </q-tabs>
        <q-separator />

        <q-tab-panels v-model="aba" animated>
          <q-tab-panel name="fila" class="aprovacoes-list__panel">
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
              :columns="colunasFila"
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
                    visualizar-label="Ver pedido"
                  >
                    <template v-if="podeDecidirAprovacao">
                      <q-item
                        v-close-popup
                        clickable
                        dense
                        class="agro-acoes-menu__item"
                        :disable="salvando"
                        @click="aprovarPedido(props.row.pedidoId)"
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
                        @click="abrirRecusa(props.row.pedidoId)"
                      >
                        <q-item-section avatar>
                          <span class="agro-acoes-menu__icon agro-acoes-menu__icon--danger">
                            <q-icon name="close" size="16px" />
                          </span>
                        </q-item-section>
                        <q-item-section>Recusar</q-item-section>
                      </q-item>
                    </template>
                  </agro-acoes-menu>
                </q-td>
              </template>
            </q-table>
          </q-tab-panel>

          <q-tab-panel name="historico" class="aprovacoes-list__panel">
            <div class="agro-filter-bar">
              <q-select
                v-model="filtroStatusHistorico"
                outlined
                dense
                clearable
                emit-value
                map-options
                label="Status"
                class="aprovacoes-list__filtro-status"
                :options="opcoesStatusHistorico"
              />
            </div>

            <agro-table-skeleton
              v-if="carregandoHistorico && historico.length === 0"
              :colunas="6"
            />

            <empty-state
              v-else-if="!carregandoHistorico && historico.length === 0"
              titulo="Nenhum histórico"
              descricao="Pedidos aprovados, recusados, expirados ou faturados aparecerão aqui."
              icon="history"
            />

            <q-table
              v-else
              flat
              bordered
              row-key="id"
              class="aprovacoes-list__tabela"
              :rows="historico"
              :columns="colunasHistorico"
              :loading="carregandoHistorico"
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

              <template #body-cell-acoes="props">
                <q-td :props="props" class="aprovacoes-list__acoes">
                  <agro-acoes-menu
                    :mostrar-editar="false"
                    :mostrar-status="false"
                    :visualizar-to="{
                      name: 'pedido-venda-detalhe',
                      params: { id: props.row.id },
                    }"
                    visualizar-label="Ver pedido"
                  />
                </q-td>
              </template>
            </q-table>
          </q-tab-panel>
        </q-tab-panels>
      </agro-card>
    </section>

    <pedido-venda-recusar-dialog
      v-model="dialogRecusa"
      :loading="salvando"
      @confirmar="confirmarRecusa"
    />
  </q-page>
</template>

<script setup lang="ts">
import PedidoVendaRecusarDialog from 'components/pedidos-venda/PedidoVendaRecusarDialog.vue';
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useAprovacoes } from 'composables/useAprovacoes';
import { useAuth } from 'composables/useAuth';
import { useClientes } from 'composables/useClientes';
import { useUsuarios } from 'composables/useUsuarios';
import {
  PedidoVendaStatusOpcoes,
  TravaAprovacaoTipoOpcoes,
  type PedidoVendaStatusValor,
  type TravaAprovacaoTipoValor,
} from 'constants/enums';
import { Permissoes } from 'constants/permissoes';
import type { QTableColumn } from 'quasar';
import type { PedidoFilaAprovacaoDto } from 'types/dtos/aprovacao.dto';
import type { PedidoVendaResumoDto } from 'types/dtos/pedido-venda.dto';
import { formatarData, formatarDataHora, formatarMoeda } from 'utils/formatters';
import {
  rotuloPedidoVendaStatus,
  variantePedidoVendaStatus,
} from 'utils/pedido-venda.helpers';
import { computed, onMounted, ref, watch } from 'vue';

type AbaAprovacoes = 'fila' | 'historico';

const aba = ref<AbaAprovacoes>('fila');
const dialogRecusa = ref(false);
const pedidoRecusaId = ref<string | null>(null);
const filtroStatusHistorico = ref<PedidoVendaStatusValor | null>(null);
const historicoCarregado = ref(false);

const { possuiPermissao } = useAuth();
const podeDecidirAprovacao = computed(() =>
  possuiPermissao(Permissoes.Aprovacoes.Aprovar),
);

const {
  fila,
  historico,
  carregando,
  carregandoHistorico,
  salvando,
  carregar,
  carregarHistorico,
  aprovar,
  solicitarRecusa,
  statusHistoricoOpcoes,
} = useAprovacoes();
const { clientes, carregar: carregarClientes } = useClientes();
const { usuarios, carregar: carregarUsuarios, nomeCompleto } = useUsuarios();

const opcoesStatusHistorico = computed(() =>
  PedidoVendaStatusOpcoes.filter((opcao) =>
    statusHistoricoOpcoes.includes(opcao.value),
  ),
);

const colunasFila: QTableColumn<PedidoFilaAprovacaoDto>[] = [
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

const colunasHistorico: QTableColumn<PedidoVendaResumoDto>[] = [
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
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
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

async function aprovarPedido(pedidoId: string): Promise<void> {
  const ok = await aprovar(pedidoId);
  if (ok && historicoCarregado.value) {
    void carregarHistorico(filtroStatusHistorico.value);
  }
}

function abrirRecusa(pedidoId: string): void {
  pedidoRecusaId.value = pedidoId;
  dialogRecusa.value = true;
}

async function confirmarRecusa(motivo: string): Promise<void> {
  if (!pedidoRecusaId.value) {
    return;
  }

  const ok = await solicitarRecusa(pedidoRecusaId.value, motivo);
  if (ok) {
    dialogRecusa.value = false;
    pedidoRecusaId.value = null;
    if (historicoCarregado.value) {
      void carregarHistorico(filtroStatusHistorico.value);
    }
  }
}

watch(aba, (valor) => {
  if (valor === 'historico' && !historicoCarregado.value) {
    historicoCarregado.value = true;
    void carregarHistorico(filtroStatusHistorico.value);
  }
});

watch(filtroStatusHistorico, () => {
  if (aba.value === 'historico') {
    void carregarHistorico(filtroStatusHistorico.value);
  }
});

onMounted(() => {
  void carregarClientes();
  void carregarUsuarios();
  void carregar();
});
</script>

<style scoped>
.aprovacoes-list__panel {
  padding: var(--spacing-4) 0 0;
}

.aprovacoes-list__travas {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-1);
}

.aprovacoes-list__acoes {
  white-space: nowrap;
}

.aprovacoes-list__filtro-status {
  min-width: 200px;
}
</style>
