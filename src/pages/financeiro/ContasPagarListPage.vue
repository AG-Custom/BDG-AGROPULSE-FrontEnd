<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Contas a pagar"
      subtitulo="Títulos a pagar com baixa, cancelamento e visão por escopo."
    />

    <section class="agro-section">
      <agro-card>
        <div class="agro-filter-bar q-mb-md row q-col-gutter-md">
          <div class="col-12 col-md-3">
            <filtro-escopo-select v-model="filtroEscopo" @update:model-value="aplicarFiltro" />
          </div>
          <div class="col-12 col-md-4">
            <q-select
              v-model="filtroFornecedorId"
              outlined
              dense
              clearable
              emit-value
              map-options
              label="Fornecedor"
              :options="fornecedorOpcoes"
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
              :options="ContaPagarStatusOpcoes"
              @update:model-value="aplicarFiltro"
            />
          </div>
        </div>

        <agro-table-skeleton v-if="carregando && contas.length === 0" :colunas="7" />
        <empty-state
          v-else-if="!carregando && contas.length === 0"
          titulo="Nenhuma conta a pagar"
          descricao="As contas são geradas ao confirmar recebimentos de compra."
          icon="payments"
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
          <template #body-cell-fornecedorId="props">
            <q-td :props="props">{{ rotuloFornecedor(props.row.fornecedorId) }}</q-td>
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

    <baixa-conta-pagar-dialog
      v-model="dialogBaixa"
      :valor-sugerido="contaSelecionada?.valor"
      :conta-opcoes="contaOpcoes"
      :loading="salvando"
      @confirmar="onBaixar"
    />
  </q-page>
</template>

<script setup lang="ts">
import BaixaContaPagarDialog from 'components/financeiro/BaixaContaPagarDialog.vue';
import FiltroEscopoSelect from 'components/financeiro/FiltroEscopoSelect.vue';
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useContasBancarias } from 'composables/useContasBancarias';
import { useContasPagar } from 'composables/useContasPagar';
import { useFornecedores } from 'composables/useFornecedores';
import {
  ContaPagarStatus,
  ContaPagarStatusOpcoes,
  EscopoFinanceiro,
  type ContaPagarStatusValor,
  type EscopoFinanceiroValor,
} from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { BaixarContaPagarPayload, ContaPagarDto } from 'types/dtos/financeiro.dto';
import { formatarData, formatarMoeda } from 'utils/formatters';
import { computed, onMounted, ref } from 'vue';

const { contas, carregando, salvando, carregar, baixar, cancelar } = useContasPagar();
const { fornecedores, carregar: carregarFornecedores } = useFornecedores();
const { contaOpcoes, carregar: carregarContasBancarias } = useContasBancarias();

const filtroFornecedorId = ref<string | null>(null);
const filtroStatus = ref<ContaPagarStatusValor | null>(null);
const filtroEscopo = ref<EscopoFinanceiroValor | null>(EscopoFinanceiro.Unidade);
const dialogBaixa = ref(false);
const contaSelecionada = ref<ContaPagarDto | null>(null);

const fornecedorOpcoes = computed(() =>
  fornecedores.value.map((f) => ({ label: f.razaoSocial, value: f.id })),
);
const mapa = computed(() => {
  const m = new Map<string, string>();
  for (const f of fornecedores.value) m.set(f.id, f.razaoSocial);
  return m;
});

const colunas: QTableColumn<ContaPagarDto>[] = [
  { name: 'fornecedorId', label: 'Fornecedor', field: 'fornecedorId', align: 'left' },
  { name: 'parcela', label: 'Parcela', field: 'parcela', align: 'right' },
  { name: 'vencimento', label: 'Vencimento', field: 'vencimento', align: 'left', sortable: true },
  { name: 'valor', label: 'Valor', field: 'valor', align: 'right' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'descricao', label: 'Descrição', field: 'descricao', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function rotuloFornecedor(id: string): string {
  return mapa.value.get(id) ?? id;
}

function rotuloStatus(status: ContaPagarStatusValor): string {
  return ContaPagarStatusOpcoes.find((o) => o.value === status)?.label ?? status;
}

function varianteStatus(status: ContaPagarStatusValor): 'success' | 'warning' | 'default' | 'error' {
  if (status === ContaPagarStatus.Paga) return 'success';
  if (status === ContaPagarStatus.ParcialmentePaga) return 'warning';
  if (status === ContaPagarStatus.Cancelada) return 'error';
  return 'default';
}

function podeBaixar(status: ContaPagarStatusValor): boolean {
  return status === ContaPagarStatus.Aberta || status === ContaPagarStatus.ParcialmentePaga;
}

function podeCancelar(status: ContaPagarStatusValor): boolean {
  return status === ContaPagarStatus.Aberta || status === ContaPagarStatus.ParcialmentePaga;
}

function paramsFiltro() {
  return {
    fornecedorId: filtroFornecedorId.value ?? undefined,
    status: filtroStatus.value ?? undefined,
    escopo: filtroEscopo.value ?? undefined,
  };
}

async function aplicarFiltro(): Promise<void> {
  await carregar(paramsFiltro());
}

function abrirBaixa(item: ContaPagarDto): void {
  contaSelecionada.value = item;
  dialogBaixa.value = true;
}

async function onBaixar(payload: BaixarContaPagarPayload): Promise<void> {
  if (!contaSelecionada.value) return;
  const ok = await baixar(contaSelecionada.value.id, payload, paramsFiltro());
  if (ok) {
    dialogBaixa.value = false;
    contaSelecionada.value = null;
  }
}

async function onCancelar(item: ContaPagarDto): Promise<void> {
  await cancelar(item, paramsFiltro());
}

onMounted(() => {
  void carregarFornecedores();
  void carregarContasBancarias();
  void carregar(paramsFiltro());
});
</script>
