<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Saldos de estoque"
      subtitulo="Consulte o saldo consolidado por produto na unidade atual."
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
            class="estoque-saldos__produto"
            :options="produtoOpcoes"
            :loading="carregandoProdutos"
          />
        </div>

        <agro-table-skeleton v-if="carregando && saldos.length === 0" :colunas="colunas.length" />

        <empty-state
          v-else-if="!carregando && saldos.length === 0"
          titulo="Nenhum saldo encontrado"
          :descricao="descricaoVazia"
          icon="warehouse"
        />

        <q-table
          v-else
          flat
          bordered
          row-key="produtoId"
          class="estoque-saldos__tabela"
          :rows="saldos"
          :columns="colunas"
          :loading="carregando"
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

          <template #body-cell-custo="props">
            <q-td :props="props">
              <span class="text-metric">{{ formatarValor(props.row.custo) }}</span>
            </q-td>
          </template>

          <template #body-cell-totalCusto="props">
            <q-td :props="props">
              <span class="text-metric">{{ formatarValor(props.row.totalCusto) }}</span>
            </q-td>
          </template>

          <template #body-cell-precoVenda="props">
            <q-td :props="props">
              <span class="text-metric">{{ formatarValor(props.row.precoVenda) }}</span>
            </q-td>
          </template>

          <template #body-cell-totalVenda="props">
            <q-td :props="props">
              <span class="text-metric">{{ formatarValor(props.row.totalVenda) }}</span>
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
import { useEstoqueSaldos } from 'composables/useEstoqueSaldos';
import { useProdutoOpcoesEstoque } from 'composables/useProdutoOpcoesEstoque';
import { useVerCustos } from 'composables/useVerCustos';
import type { QTableColumn } from 'quasar';
import type { SaldoProdutoDto } from 'types/dtos/estoque.dto';
import { formatarDecimal, formatarMoeda } from 'utils/formatters';
import { computed, onMounted, ref, watch } from 'vue';

const { saldos, carregando, carregar } = useEstoqueSaldos();
const {
  produtoOpcoes,
  carregando: carregandoProdutos,
  rotuloProduto,
} = useProdutoOpcoesEstoque();

const { verCustos } = useVerCustos();

const filtroProduto = ref<string | null>(null);

const colunas = computed<QTableColumn<SaldoProdutoDto>[]>(() => {
  const base: QTableColumn<SaldoProdutoDto>[] = [
    { name: 'produtoId', label: 'Produto', field: 'produtoId', align: 'left', sortable: true },
    { name: 'saldo', label: 'Saldo', field: 'saldo', align: 'right', sortable: true },
  ];

  if (verCustos.value) {
    base.push(
      { name: 'custo', label: 'Custo', field: 'custo', align: 'right', sortable: true },
      { name: 'totalCusto', label: 'Total custo', field: 'totalCusto', align: 'right', sortable: true },
    );
  }

  base.push(
    { name: 'precoVenda', label: 'Preço venda', field: 'precoVenda', align: 'right', sortable: true },
    { name: 'totalVenda', label: 'Total venda', field: 'totalVenda', align: 'right', sortable: true },
  );

  return base;
});

function formatarValor(valor: number | null): string {
  return valor == null ? '—' : formatarMoeda(valor);
}

const descricaoVazia = computed(() =>
  filtroProduto.value
    ? 'Nenhum saldo corresponde ao filtro aplicado.'
    : 'Ainda não há saldos de estoque nesta unidade.',
);

async function recarregar(): Promise<void> {
  await carregar({
    produtoId: filtroProduto.value || undefined,
  });
}

watch(filtroProduto, () => {
  void recarregar();
});

onMounted(() => {
  void recarregar();
});
</script>

<style scoped>
.estoque-saldos__produto {
  min-width: min(320px, 100%);
}
</style>
