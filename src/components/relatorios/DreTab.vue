<template>
  <div class="painel">
    <div class="agro-filter-bar">
      <q-input v-model.number="mes" outlined dense label="Mês" type="number" min="1" max="12" class="filtro" />
      <q-input v-model.number="ano" outlined dense label="Ano" type="number" class="filtro" />
      <q-select
        v-model="visao"
        outlined
        dense
        label="Visão"
        emit-value
        map-options
        :options="DreVisaoOpcoes"
        class="filtro-visao"
      />
      <agro-btn
        color="primary"
        unelevated
        label="Atualizar"
        descricao="Carregar DRE"
        :loading="carregando"
        @click="atualizar"
      />
    </div>

    <agro-form-skeleton v-if="carregando && !dre" :campos="4" />
    <empty-state
      v-else-if="!carregando && !dre"
      titulo="Sem DRE"
      descricao="Não há dados para o período selecionado."
      icon="account_balance"
    />
    <template v-else-if="dre">
      <div class="row q-col-gutter-md q-mb-md">
        <div v-for="kpi in kpisResumo" :key="kpi.label" class="col-6 col-md-3">
          <metric-tile :label="kpi.label" :value="kpi.valor" :icon="kpi.icon" />
        </div>
      </div>

      <q-table
        flat
        bordered
        row-key="label"
        :rows="linhas"
        :columns="colunas"
        :loading="carregando"
        hide-pagination
        :rows-per-page-options="[0]"
      >
        <template #body-cell-valor="props">
          <q-td :props="props" class="text-metric">{{ props.row.valor }}</q-td>
        </template>
      </q-table>
    </template>
  </div>
</template>

<script setup lang="ts">
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import MetricTile from 'components/ui/MetricTile.vue';
import { useRelatorios } from 'composables/useRelatorios';
import { useVerCustos } from 'composables/useVerCustos';
import { DreVisao, DreVisaoOpcoes, type DreVisaoValor } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import { formatarDecimal, formatarMoeda } from 'utils/formatters';
import { computed, onMounted, ref } from 'vue';

const { dre, carregando, carregarDre } = useRelatorios();
const { verCustos } = useVerCustos();

const agora = new Date();
const mes = ref(agora.getMonth() + 1);
const ano = ref(agora.getFullYear());
const visao = ref<DreVisaoValor>(DreVisao.Unidade);

const kpisResumo = computed(() => {
  const d = dre.value;
  if (!d) return [];
  const itens = [
    { label: 'Receita bruta', valor: formatarMoeda(d.receitaBruta), icon: 'payments' },
    {
      label: 'Pedidos faturados',
      valor: String(d.totalPedidosFaturados),
      icon: 'receipt_long',
    },
    { label: 'Ticket médio', valor: formatarMoeda(d.ticketMedio), icon: 'sell' },
    {
      label: 'Comissões',
      valor: formatarMoeda(d.totalComissoes),
      icon: 'handshake',
    },
  ];
  if (verCustos.value && d.lucroLiquido != null) {
    itens.splice(1, 0, {
      label: 'Lucro líquido',
      valor: formatarMoeda(d.lucroLiquido),
      icon: 'trending_up',
    });
  }
  return itens;
});

const linhas = computed(() => {
  const d = dre.value;
  if (!d) return [];
  const rows: { label: string; valor: string }[] = [
    { label: 'Receita bruta', valor: formatarMoeda(d.receitaBruta) },
  ];
  if (verCustos.value) {
    rows.push(
      {
        label: 'CMV',
        valor: d.custoMercadoriaVendida != null ? formatarMoeda(d.custoMercadoriaVendida) : '—',
      },
      {
        label: 'Lucro bruto',
        valor: d.lucroBruto != null ? formatarMoeda(d.lucroBruto) : '—',
      },
      {
        label: 'Margem bruta %',
        valor:
          d.margemBrutaPercentual != null
            ? `${formatarDecimal(d.margemBrutaPercentual)}%`
            : '—',
      },
    );
  }
  rows.push(
    { label: 'Despesas variáveis', valor: formatarMoeda(d.despesasVariaveis) },
    { label: 'Comissões', valor: formatarMoeda(d.totalComissoes) },
  );
  if (verCustos.value) {
    rows.push(
      {
        label: 'Lucro líquido',
        valor: d.lucroLiquido != null ? formatarMoeda(d.lucroLiquido) : '—',
      },
      {
        label: 'Margem líquida %',
        valor:
          d.margemLiquidaPercentual != null
            ? `${formatarDecimal(d.margemLiquidaPercentual)}%`
            : '—',
      },
    );
  }
  return rows;
});

const colunas: QTableColumn[] = [
  { name: 'label', label: 'Conta', field: 'label', align: 'left' },
  { name: 'valor', label: 'Valor', field: 'valor', align: 'right' },
];

async function atualizar(): Promise<void> {
  await carregarDre({
    mes: mes.value || undefined,
    ano: ano.value || undefined,
    visao: visao.value,
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
  min-width: 100px;
  max-width: 120px;
}
.filtro-visao {
  min-width: 160px;
}
</style>
