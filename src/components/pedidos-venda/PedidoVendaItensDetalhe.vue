<template>
  <agro-card>
    <template #header>
      <h3 class="pedido-venda-itens-detalhe__titulo">Itens</h3>
    </template>

    <empty-state
      v-if="itens.length === 0"
      titulo="Nenhum item"
      descricao="Este pedido não possui itens."
      icon="shopping_cart"
    />

    <q-table
      v-else
      flat
      bordered
      row-key="id"
      hide-pagination
      :rows="itens"
      :columns="colunas"
      :pagination="{ rowsPerPage: 0 }"
    >
      <template #body-cell-produtoId="props">
        <q-td :props="props">
          {{ rotuloProduto(props.row.produtoId) }}
        </q-td>
      </template>

      <template #body-cell-quantidade="props">
        <q-td :props="props" class="text-metric">
          {{ formatarDecimal(props.row.quantidade) }}
        </q-td>
      </template>

      <template #body-cell-precoUnitario="props">
        <q-td :props="props" class="text-metric">
          {{ formatarMoeda(props.row.precoUnitario) }}
        </q-td>
      </template>

      <template #body-cell-descontoPercentual="props">
        <q-td :props="props" class="text-metric">
          {{ formatarDecimal(props.row.descontoPercentual) }}%
        </q-td>
      </template>

      <template #body-cell-comissaoPercentual="props">
        <q-td :props="props" class="text-metric">
          {{ formatarDecimal(props.row.comissaoPercentual) }}%
        </q-td>
      </template>

      <template #body-cell-valorComissao="props">
        <q-td :props="props" class="text-metric">
          {{ formatarMoeda(props.row.valorComissao) }}
        </q-td>
      </template>

      <template #body-cell-subtotal="props">
        <q-td :props="props" class="text-metric">
          {{ formatarMoeda(props.row.subtotal) }}
        </q-td>
      </template>
    </q-table>
  </agro-card>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useVerCustos } from 'composables/useVerCustos';
import type { QTableColumn } from 'quasar';
import type { PedidoVendaItemDto } from 'types/dtos/pedido-venda.dto';
import { formatarDecimal, formatarMoeda } from 'utils/formatters';
import { computed } from 'vue';

defineProps<{
  itens: PedidoVendaItemDto[];
  rotuloProduto: (produtoId: string) => string;
}>();

const { verCustos } = useVerCustos();

const colunas = computed(() => {
  const base: QTableColumn<PedidoVendaItemDto>[] = [
    { name: 'produtoId', label: 'Produto', field: 'produtoId', align: 'left' },
    { name: 'quantidade', label: 'Qtd.', field: 'quantidade', align: 'right' },
    { name: 'precoUnitario', label: 'Preço unit.', field: 'precoUnitario', align: 'right' },
    {
      name: 'descontoPercentual',
      label: 'Desc. %',
      field: 'descontoPercentual',
      align: 'right',
    },
    {
      name: 'comissaoPercentual',
      label: 'Comissão %',
      field: 'comissaoPercentual',
      align: 'right',
    },
    { name: 'valorComissao', label: 'Comissão R$', field: 'valorComissao', align: 'right' },
    { name: 'subtotal', label: 'Subtotal', field: 'subtotal', align: 'right' },
  ];

  if (verCustos.value) {
    return base;
  }

  return base.filter(
    (coluna) =>
      coluna.name !== 'comissaoPercentual' && coluna.name !== 'valorComissao',
  );
});
</script>

<style scoped>
.pedido-venda-itens-detalhe__titulo {
  color: var(--color-text-primary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}
</style>
