<template>
  <relatorio-page-shell
    titulo="Despesas por Centro de Custo"
    subtitulo="Rateio de gastos pagos no período por centro de custo."
  >
    <div class="painel">
      <div class="agro-filter-bar">
        <q-input v-model="de" outlined dense label="De" type="date" class="filtro" />
        <q-input v-model="ate" outlined dense label="Até" type="date" class="filtro" />
        <agro-btn
          color="primary"
          unelevated
          label="Atualizar"
          descricao="Carregar despesas por centro"
          :loading="carregando"
          @click="atualizar"
        />
      </div>

      <agro-table-skeleton
        v-if="carregando && despesasCentroCusto.length === 0"
        :colunas="4"
      />
      <empty-state
        v-else-if="!carregando && despesasCentroCusto.length === 0"
        titulo="Sem despesas"
        descricao="Não há contas a pagar baixadas no período com centro de custo."
        icon="account_tree"
      />
      <q-table
        v-else
        flat
        bordered
        row-key="rowKey"
        :rows="linhas"
        :columns="colunas"
        :loading="carregando"
        :rows-per-page-options="[10, 25, 50]"
      >
        <template #body-cell-valorPago="props">
          <q-td :props="props" class="text-metric">
            {{ formatarMoeda(props.row.valorPago) }}
          </q-td>
        </template>
      </q-table>
    </div>
  </relatorio-page-shell>
</template>

<script setup lang="ts">
import RelatorioPageShell from 'components/relatorios/RelatorioPageShell.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useRelatorios } from 'composables/useRelatorios';
import type { QTableColumn } from 'quasar';
import type { DespesaCentroCustoItemDto } from 'types/dtos/relatorio.dto';
import { formatarMoeda } from 'utils/formatters';
import { computed, onMounted, ref } from 'vue';

const { despesasCentroCusto, carregando, carregarDespesasCentroCusto } = useRelatorios();

const hoje = new Date();
const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
const de = ref(inicioMes.toISOString().slice(0, 10));
const ate = ref(hoje.toISOString().slice(0, 10));

const linhas = computed(() =>
  despesasCentroCusto.value.map((item, index) => ({
    ...item,
    rowKey: item.centroCustoId ?? `sem-centro-${index}`,
  })),
);

const colunas: QTableColumn<DespesaCentroCustoItemDto & { rowKey: string }>[] = [
  { name: 'codigo', label: 'Código', field: 'codigo', align: 'left' },
  { name: 'nome', label: 'Centro de custo', field: 'nome', align: 'left' },
  { name: 'quantidadeTitulos', label: 'Títulos', field: 'quantidadeTitulos', align: 'right' },
  { name: 'valorPago', label: 'Valor pago', field: 'valorPago', align: 'right' },
];

async function atualizar(): Promise<void> {
  await carregarDespesasCentroCusto({
    de: de.value ? new Date(`${de.value}T00:00:00.000Z`).toISOString() : undefined,
    ate: ate.value ? new Date(`${ate.value}T23:59:59.999Z`).toISOString() : undefined,
  });
}

onMounted(() => {
  void atualizar();
});
</script>

<style scoped>
.painel {
  padding-top: var(--spacing-4);
}
.filtro {
  min-width: 160px;
}
</style>
