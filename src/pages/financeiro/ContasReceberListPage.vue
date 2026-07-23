<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Contas a receber"
      subtitulo="Títulos a receber com baixa parcial, boleto e visão por escopo."
    />

    <section class="agro-section">
      <agro-card>
        <div class="agro-filter-bar q-mb-md row q-col-gutter-md">
          <div class="col-12 col-md-3">
            <filtro-escopo-select v-model="filtroEscopo" @update:model-value="aplicarFiltro" />
          </div>
          <div class="col-12 col-md-4">
            <q-select
              v-model="filtroClienteId"
              outlined
              dense
              clearable
              emit-value
              map-options
              label="Cliente"
              :options="clienteOpcoes"
              @update:model-value="aplicarFiltro"
            />
          </div>
          <div class="col-12 col-md-3">
            <q-select
              v-model="filtroStatus"
              outlined
              dense
              clearable
              emit-value
              map-options
              label="Status"
              :options="ContaReceberStatusOpcoes"
              @update:model-value="aplicarFiltro"
            />
          </div>
        </div>

        <agro-table-skeleton v-if="carregando && contas.length === 0" :colunas="7" />
        <empty-state
          v-else-if="!carregando && contas.length === 0"
          titulo="Nenhuma conta a receber"
          descricao="As contas são geradas no faturamento de pedidos de venda."
          icon="request_quote"
        />
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="contas"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-clienteId="props">
            <q-td :props="props">{{ rotuloCliente(props.row.clienteId) }}</q-td>
          </template>
          <template #body-cell-vencimento="props">
            <q-td :props="props">{{ formatarData(props.row.vencimento) }}</q-td>
          </template>
          <template #body-cell-valor="props">
            <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.valor) }}</q-td>
          </template>
          <template #body-cell-status="props">
            <q-td :props="props">
              <agro-badge
                :label="rotuloStatus(props.row.status)"
                :variant="varianteStatus(props.row.status)"
              />
            </q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props">
              <agro-acoes-menu :mostrar-visualizar="false" :mostrar-editar="false" :mostrar-status="false">
                <q-item
                  v-if="podeBaixar(props.row.status)"
                  v-close-popup
                  clickable
                  dense
                  class="agro-acoes-menu__item"
                  :disable="salvando"
                  @click="abrirBaixa(props.row)"
                >
                  <q-item-section avatar><span class="agro-acoes-menu__icon agro-acoes-menu__icon--success"><q-icon name="check_circle" size="16px" /></span></q-item-section>
                  <q-item-section>Baixar</q-item-section>
                  <q-item-section v-if="salvando" side><q-spinner size="16px" color="primary" /></q-item-section>
                </q-item>
                <q-item
                  v-if="podeBaixar(props.row.status)"
                  v-close-popup
                  clickable
                  dense
                  class="agro-acoes-menu__item"
                  :disable="emitindo"
                  @click="onEmitirBoleto(props.row)"
                >
                  <q-item-section avatar><span class="agro-acoes-menu__icon agro-acoes-menu__icon--edit"><q-icon name="receipt_long" size="16px" /></span></q-item-section>
                  <q-item-section>Emitir boleto</q-item-section>
                  <q-item-section v-if="emitindo" side><q-spinner size="16px" color="primary" /></q-item-section>
                </q-item>
                <q-item
                  v-if="podeCancelar(props.row.status)"
                  v-close-popup
                  clickable
                  dense
                  class="agro-acoes-menu__item"
                  :disable="salvando"
                  @click="onCancelar(props.row)"
                >
                  <q-item-section avatar><span class="agro-acoes-menu__icon agro-acoes-menu__icon--danger"><q-icon name="cancel" size="16px" /></span></q-item-section>
                  <q-item-section>Cancelar</q-item-section>
                  <q-item-section v-if="salvando" side><q-spinner size="16px" color="primary" /></q-item-section>
                </q-item>
              </agro-acoes-menu>
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>

    <baixa-conta-receber-dialog
      v-model="dialogBaixa"
      :valor-sugerido="contaSelecionada?.valor"
      :conta-opcoes="contaOpcoes"
      :loading="salvando"
      @confirmar="onBaixar"
    />
  </q-page>
</template>

<script setup lang="ts">
import BaixaContaReceberDialog from 'components/financeiro/BaixaContaReceberDialog.vue';
import FiltroEscopoSelect from 'components/financeiro/FiltroEscopoSelect.vue';
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useBoletos } from 'composables/useBoletos';
import { useClientes } from 'composables/useClientes';
import { useContasBancarias } from 'composables/useContasBancarias';
import { useContasReceber } from 'composables/useContasReceber';
import {
  ContaReceberStatus,
  ContaReceberStatusOpcoes,
  EscopoFinanceiro,
  type ContaReceberStatusValor,
  type EscopoFinanceiroValor,
} from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { BaixarContaReceberPayload, ContaReceberDto } from 'types/dtos/financeiro.dto';
import { formatarData, formatarMoeda } from 'utils/formatters';
import { computed, onMounted, ref } from 'vue';

const { contas, carregando, salvando, carregar, baixar, cancelar } = useContasReceber();
const { clientes, carregar: carregarClientes } = useClientes();
const { contaOpcoes, carregar: carregarContasBancarias } = useContasBancarias();
const { emitir, salvando: emitindo } = useBoletos();

const filtroClienteId = ref<string | null>(null);
const filtroStatus = ref<ContaReceberStatusValor | null>(null);
const filtroEscopo = ref<EscopoFinanceiroValor | null>(EscopoFinanceiro.Unidade);
const dialogBaixa = ref(false);
const contaSelecionada = ref<ContaReceberDto | null>(null);

const clienteOpcoes = computed(() =>
  clientes.value.map((c) => ({
    label: c.nomeFantasia || c.nomeRazao,
    value: c.id,
  })),
);
const mapa = computed(() => {
  const m = new Map<string, string>();
  for (const c of clientes.value) m.set(c.id, c.nomeFantasia || c.nomeRazao);
  return m;
});

const colunas: QTableColumn<ContaReceberDto>[] = [
  { name: 'clienteId', label: 'Cliente', field: 'clienteId', align: 'left' },
  { name: 'parcela', label: 'Parcela', field: 'parcela', align: 'right' },
  { name: 'vencimento', label: 'Vencimento', field: 'vencimento', align: 'left', sortable: true },
  { name: 'valor', label: 'Valor', field: 'valor', align: 'right' },
  { name: 'formaPagamento', label: 'Forma', field: 'formaPagamento', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function rotuloCliente(id: string): string {
  return mapa.value.get(id) ?? id;
}

function rotuloStatus(status: ContaReceberStatusValor): string {
  return ContaReceberStatusOpcoes.find((o) => o.value === status)?.label ?? status;
}

function varianteStatus(
  status: ContaReceberStatusValor,
): 'success' | 'warning' | 'default' | 'error' {
  if (status === ContaReceberStatus.Paga) return 'success';
  if (status === ContaReceberStatus.ParcialmentePaga) return 'warning';
  if (status === ContaReceberStatus.Cancelada) return 'error';
  return 'default';
}

function podeBaixar(status: ContaReceberStatusValor): boolean {
  return status === ContaReceberStatus.Aberta || status === ContaReceberStatus.ParcialmentePaga;
}

function podeCancelar(status: ContaReceberStatusValor): boolean {
  return status === ContaReceberStatus.Aberta || status === ContaReceberStatus.ParcialmentePaga;
}

function paramsFiltro() {
  return {
    clienteId: filtroClienteId.value ?? undefined,
    status: filtroStatus.value ?? undefined,
    escopo: filtroEscopo.value ?? undefined,
  };
}

async function aplicarFiltro(): Promise<void> {
  await carregar(paramsFiltro());
}

function abrirBaixa(item: ContaReceberDto): void {
  contaSelecionada.value = item;
  dialogBaixa.value = true;
}

async function onBaixar(payload: BaixarContaReceberPayload): Promise<void> {
  if (!contaSelecionada.value) return;
  const ok = await baixar(contaSelecionada.value.id, payload, paramsFiltro());
  if (ok) {
    dialogBaixa.value = false;
    contaSelecionada.value = null;
  }
}

async function onCancelar(item: ContaReceberDto): Promise<void> {
  await cancelar(item, paramsFiltro());
}

async function onEmitirBoleto(item: ContaReceberDto): Promise<void> {
  await emitir(item.id);
}

onMounted(() => {
  void carregarClientes();
  void carregarContasBancarias();
  void carregar(paramsFiltro());
});
</script>
