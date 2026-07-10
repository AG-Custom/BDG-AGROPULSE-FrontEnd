<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Alertas de estoque"
      subtitulo="Monitore produtos abaixo do mínimo e lotes próximos do vencimento."
    />

    <section class="agro-section estoque-alertas">
      <agro-card>
        <template #header>
          <h3 class="estoque-alertas__titulo">Estoque mínimo</h3>
        </template>

        <agro-table-skeleton v-if="carregandoMinimo && alertasMinimo.length === 0" :colunas="3" />

        <empty-state
          v-else-if="!carregandoMinimo && alertasMinimo.length === 0"
          titulo="Nenhum alerta de estoque mínimo"
          descricao="Todos os produtos estão acima do estoque mínimo configurado."
          icon="notifications_none"
        />

        <q-table
          v-else
          flat
          bordered
          row-key="produtoId"
          :rows="alertasMinimo"
          :columns="colunasMinimo"
          :loading="carregandoMinimo"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-produtoId="props">
            <q-td :props="props">
              {{ rotuloProduto(props.row.produtoId) }}
            </q-td>
          </template>

          <template #body-cell-saldo="props">
            <q-td :props="props">
              <span class="text-metric">{{ formatarDecimal(props.row.saldo) }}</span>
            </q-td>
          </template>

          <template #body-cell-estoqueMinimo="props">
            <q-td :props="props">
              <span class="text-metric">{{ formatarDecimal(props.row.estoqueMinimo) }}</span>
            </q-td>
          </template>
        </q-table>
      </agro-card>

      <agro-card>
        <template #header>
          <div class="estoque-alertas__header">
            <h3 class="estoque-alertas__titulo">Validade</h3>
            <q-input
              v-model.number="diasValidade"
              outlined
              dense
              type="number"
              min="1"
              label="Janela (dias)"
              class="estoque-alertas__dias"
            />
          </div>
        </template>

        <agro-table-skeleton
          v-if="carregandoValidade && alertasValidade.length === 0"
          :colunas="5"
        />

        <empty-state
          v-else-if="!carregandoValidade && alertasValidade.length === 0"
          titulo="Nenhum alerta de validade"
          descricao="Não há lotes vencidos ou próximos do vencimento na janela selecionada."
          icon="event_available"
        />

        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="alertasValidade"
          :columns="colunasValidade"
          :loading="carregandoValidade"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-produtoId="props">
            <q-td :props="props">
              {{ rotuloProduto(props.row.produtoId) }}
            </q-td>
          </template>

          <template #body-cell-quantidade="props">
            <q-td :props="props">
              <span class="text-metric">{{ formatarDecimal(props.row.quantidade) }}</span>
            </q-td>
          </template>

          <template #body-cell-dataValidade="props">
            <q-td :props="props">
              {{ formatarData(props.row.dataValidade) }}
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useEstoqueAlertas } from 'composables/useEstoqueAlertas';
import { useProdutoOpcoesEstoque } from 'composables/useProdutoOpcoesEstoque';
import type { QTableColumn } from 'quasar';
import type { AlertaEstoqueMinimoDto, LoteDto } from 'types/dtos/estoque.dto';
import { formatarData, formatarDecimal } from 'utils/formatters';
import { onMounted, ref, watch } from 'vue';

const {
  alertasMinimo,
  alertasValidade,
  carregandoMinimo,
  carregandoValidade,
  carregarMinimo,
  carregarValidade,
} = useEstoqueAlertas();
const { rotuloProduto } = useProdutoOpcoesEstoque();

const diasValidade = ref(30);

const colunasMinimo: QTableColumn<AlertaEstoqueMinimoDto>[] = [
  { name: 'produtoId', label: 'Produto', field: 'produtoId', align: 'left', sortable: true },
  { name: 'saldo', label: 'Saldo', field: 'saldo', align: 'right', sortable: true },
  {
    name: 'estoqueMinimo',
    label: 'Mínimo',
    field: 'estoqueMinimo',
    align: 'right',
    sortable: true,
  },
];

const colunasValidade: QTableColumn<LoteDto>[] = [
  { name: 'produtoId', label: 'Produto', field: 'produtoId', align: 'left', sortable: true },
  { name: 'numeroLote', label: 'Lote', field: 'numeroLote', align: 'left', sortable: true },
  { name: 'quantidade', label: 'Quantidade', field: 'quantidade', align: 'right', sortable: true },
  {
    name: 'dataValidade',
    label: 'Validade',
    field: 'dataValidade',
    align: 'left',
    sortable: true,
  },
];

let debounceValidade: ReturnType<typeof setTimeout> | undefined;

watch(diasValidade, (dias) => {
  if (debounceValidade) {
    clearTimeout(debounceValidade);
  }

  debounceValidade = setTimeout(() => {
    void carregarValidade({ dias: dias > 0 ? dias : 30 });
  }, 400);
});

onMounted(() => {
  void carregarMinimo();
  void carregarValidade({ dias: diasValidade.value });
});
</script>

<style scoped>
.estoque-alertas {
  display: grid;
  gap: var(--spacing-6);
}

.estoque-alertas__header {
  align-items: center;
  display: flex;
  gap: var(--spacing-4);
  justify-content: space-between;
}

.estoque-alertas__titulo {
  color: var(--color-text-primary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}

.estoque-alertas__dias {
  max-width: 140px;
}
</style>
