<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Contas a pagar"
      subtitulo="Parcelas geradas na confirmação de recebimentos."
    />

    <section class="agro-section">
      <agro-card>
        <div class="agro-filter-bar q-mb-md row q-col-gutter-md">
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

        <agro-table-skeleton v-if="carregando && contas.length === 0" :colunas="6" />
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
              <agro-badge :label="props.row.status" variant="default" />
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
import { useContasPagar } from 'composables/useContasPagar';
import { useFornecedores } from 'composables/useFornecedores';
import {
  ContaPagarStatusOpcoes,
  type ContaPagarStatusValor,
} from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { ContaPagarDto } from 'types/dtos/financeiro.dto';
import { formatarData, formatarMoeda } from 'utils/formatters';
import { computed, onMounted, ref } from 'vue';

const { contas, carregando, carregar } = useContasPagar();
const { fornecedores, carregar: carregarFornecedores } = useFornecedores();

const filtroFornecedorId = ref<string | null>(null);
const filtroStatus = ref<ContaPagarStatusValor | null>(null);

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
];

function rotuloFornecedor(id: string): string {
  return mapa.value.get(id) ?? id;
}

async function aplicarFiltro(): Promise<void> {
  await carregar({
    fornecedorId: filtroFornecedorId.value ?? undefined,
    status: filtroStatus.value ?? undefined,
  });
}

onMounted(() => {
  void carregarFornecedores();
  void carregar();
});
</script>
