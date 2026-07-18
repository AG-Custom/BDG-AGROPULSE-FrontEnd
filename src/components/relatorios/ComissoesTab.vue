<template>
  <div class="painel">
    <div class="agro-filter-bar">
      <agro-btn
        color="primary"
        unelevated
        label="Atualizar"
        descricao="Carregar comissões"
        :loading="carregando"
        @click="atualizar"
      />
      <relatorio-export-buttons :loading="exportando" @exportar="exportar" />
    </div>

    <agro-table-skeleton v-if="carregando && comissoes.length === 0" :colunas="5" />
    <empty-state
      v-else-if="!carregando && comissoes.length === 0"
      titulo="Sem comissões"
      descricao="Não há dados de comissão/repasse."
      icon="payments"
    />
    <q-table
      v-else
      flat
      bordered
      row-key="produtoId"
      :rows="comissoes"
      :columns="colunas"
      :loading="carregando"
      :rows-per-page-options="[10, 25, 50]"
    >
      <template #body-cell-valorVendido="props">
        <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.valorVendido) }}</q-td>
      </template>
      <template #body-cell-valorComissao="props">
        <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.valorComissao) }}</q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import RelatorioExportButtons from 'components/relatorios/RelatorioExportButtons.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useRelatorios } from 'composables/useRelatorios';
import { useVerCustos } from 'composables/useVerCustos';
import type { ExportacaoFormatoValor } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { ComissaoRepasseItemDto } from 'types/dtos/relatorio.dto';
import { formatarMoeda } from 'utils/formatters';
import { computed, onMounted } from 'vue';

const { comissoes, carregando, exportando, carregarComissoes, exportarComissoes } = useRelatorios();
const { verCustos } = useVerCustos();

const colunas = computed(() => {
  const base: QTableColumn<ComissaoRepasseItemDto>[] = [
    { name: 'produtoCodigo', label: 'Código', field: 'produtoCodigo', align: 'left' },
    { name: 'produtoDescricao', label: 'Produto', field: 'produtoDescricao', align: 'left' },
    { name: 'vendedorUsuarioId', label: 'Vendedor', field: 'vendedorUsuarioId', align: 'left' },
    { name: 'valorVendido', label: 'Vendido', field: 'valorVendido', align: 'right' },
    { name: 'valorComissao', label: 'Comissão', field: 'valorComissao', align: 'right' },
  ];
  return verCustos.value ? base : base.filter((c) => c.name !== 'valorComissao');
});

async function atualizar(): Promise<void> {
  await carregarComissoes();
}

async function exportar(formato: ExportacaoFormatoValor): Promise<void> {
  await exportarComissoes(formato);
}

onMounted(() => {
  void atualizar();
});
</script>

<style scoped>
.painel {
  padding-top: var(--spacing-4);
}
</style>
