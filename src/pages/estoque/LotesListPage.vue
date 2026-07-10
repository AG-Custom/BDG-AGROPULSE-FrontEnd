<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Lotes"
      subtitulo="Consulte os lotes de estoque da unidade operacional atual."
    />

    <section class="agro-section">
      <agro-card>
        <div class="agro-filter-bar">
          <q-select
            v-model="filtroProduto"
            outlined
            dense
            label="Produto"
            emit-value
            map-options
            clearable
            class="estoque-lotes__produto"
            :options="produtoOpcoes"
            :loading="carregandoProdutos"
          />

          <q-toggle
            v-model="apenasComSaldo"
            label="Somente com saldo"
            dense
          />
        </div>

        <agro-table-skeleton v-if="carregando && lotes.length === 0" :colunas="6" />

        <empty-state
          v-else-if="!carregando && lotes.length === 0"
          titulo="Nenhum lote encontrado"
          :descricao="descricaoVazia"
          icon="qr_code_2"
        />

        <q-table
          v-else
          flat
          bordered
          row-key="id"
          class="estoque-lotes__tabela"
          :rows="lotes"
          :columns="colunas"
          :loading="carregando"
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

          <template #body-cell-custoUnitario="props">
            <q-td :props="props">
              <span class="text-metric">{{ formatarDecimal(props.row.custoUnitario) }}</span>
            </q-td>
          </template>

          <template #body-cell-dataValidade="props">
            <q-td :props="props">
              {{ formatarData(props.row.dataValidade) }}
            </q-td>
          </template>

          <template #body-cell-dataFabricacao="props">
            <q-td :props="props">
              {{ formatarData(props.row.dataFabricacao) }}
            </q-td>
          </template>

          <template #body-cell-ativo="props">
            <q-td :props="props">
              <agro-badge
                :label="props.row.ativo ? 'Ativo' : 'Inativo'"
                :variant="props.row.ativo ? 'success' : 'default'"
              />
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
import { useEstoqueLotes } from 'composables/useEstoqueLotes';
import { useProdutoOpcoesEstoque } from 'composables/useProdutoOpcoesEstoque';
import type { QTableColumn } from 'quasar';
import type { LoteDto } from 'types/dtos/estoque.dto';
import { formatarData, formatarDecimal } from 'utils/formatters';
import { computed, onMounted, ref, watch } from 'vue';

const { lotes, carregando, carregar } = useEstoqueLotes();
const {
  produtoOpcoes,
  carregando: carregandoProdutos,
  rotuloProduto,
} = useProdutoOpcoesEstoque();

const filtroProduto = ref<string | null>(null);
const apenasComSaldo = ref(true);

const colunas: QTableColumn<LoteDto>[] = [
  { name: 'produtoId', label: 'Produto', field: 'produtoId', align: 'left', sortable: true },
  { name: 'numeroLote', label: 'Lote', field: 'numeroLote', align: 'left', sortable: true },
  { name: 'quantidade', label: 'Quantidade', field: 'quantidade', align: 'right', sortable: true },
  {
    name: 'custoUnitario',
    label: 'Custo unitário',
    field: 'custoUnitario',
    align: 'right',
    sortable: true,
  },
  {
    name: 'dataValidade',
    label: 'Validade',
    field: 'dataValidade',
    align: 'left',
    sortable: true,
  },
  {
    name: 'dataFabricacao',
    label: 'Fabricação',
    field: 'dataFabricacao',
    align: 'left',
    sortable: true,
  },
  { name: 'ativo', label: 'Status', field: 'ativo', align: 'left', sortable: true },
];

const descricaoVazia = computed(() =>
  filtroProduto.value || apenasComSaldo.value
    ? 'Nenhum lote corresponde aos filtros aplicados.'
    : 'Ainda não há lotes cadastrados nesta unidade.',
);

async function recarregar(): Promise<void> {
  await carregar({
    produtoId: filtroProduto.value || undefined,
    apenasComSaldo: apenasComSaldo.value,
  });
}

watch([filtroProduto, apenasComSaldo], () => {
  void recarregar();
});

onMounted(() => {
  void recarregar();
});
</script>

<style scoped>
.estoque-lotes__produto {
  min-width: min(320px, 100%);
}
</style>
