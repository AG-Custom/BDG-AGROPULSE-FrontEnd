<template>
  <div class="painel">
    <div class="agro-filter-bar">
      <agro-btn
        color="primary"
        unelevated
        icon="refresh"
        label="Atualizar"
        descricao="Atualizar painel"
        :loading="carregando"
        @click="carregarPainel"
      />
    </div>

    <agro-form-skeleton v-if="carregando && !carteira" :campos="4" />
    <template v-else-if="carteira">
      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-6 col-md-3">
          <metric-tile
            label="Limite total"
            :value="formatarMoeda(carteira.limiteTotal)"
            icon="account_balance_wallet"
          />
        </div>
        <div class="col-6 col-md-3">
          <metric-tile
            label="Utilizado"
            :value="formatarMoeda(carteira.utilizadoTotal)"
            icon="trending_down"
          />
        </div>
        <div class="col-6 col-md-3">
          <metric-tile
            label="Disponível"
            :value="formatarMoeda(carteira.disponivelTotal)"
            icon="check_circle"
            accent
          />
        </div>
        <div class="col-6 col-md-3">
          <metric-tile
            label="Inadimplência"
            :value="`${formatarDecimal(carteira.inadimplenciaPct)}%`"
            icon="warning"
          />
        </div>
      </div>

      <agro-card class="q-mb-md">
        <div class="utilizacao">
          <span class="text-secondary">Utilização do limite</span>
          <span class="text-metric">{{ utilizacaoPct.toFixed(1) }}%</span>
        </div>
        <q-linear-progress
          :value="utilizacaoPct / 100"
          size="10px"
          rounded
          color="primary"
          track-color="grey-3"
          class="q-mb-sm"
        />
        <div class="text-caption text-secondary">
          {{ carteira.clientes.length }} cliente(s) na carteira
        </div>
      </agro-card>

      <h3 class="secao-titulo">Carteira por cliente</h3>
      <agro-table-skeleton v-if="carregando && !carteira.clientes.length" :colunas="5" />
      <empty-state
        v-else-if="!carteira.clientes.length"
        titulo="Sem clientes na carteira"
        descricao="Não há limites de crédito cadastrados."
        icon="people"
      />
      <q-table
        v-else
        flat
        bordered
        row-key="clienteId"
        class="q-mb-md"
        :rows="carteira.clientes"
        :columns="colunasCarteira"
        :loading="carregando"
        :rows-per-page-options="[10, 25, 50]"
      >
        <template #body-cell-limiteCredito="props">
          <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.limiteCredito) }}</q-td>
        </template>
        <template #body-cell-utilizado="props">
          <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.utilizado) }}</q-td>
        </template>
        <template #body-cell-disponivel="props">
          <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.disponivel) }}</q-td>
        </template>
        <template #body-cell-maiorAtrasoDias="props">
          <q-td :props="props" class="text-metric">{{ props.row.maiorAtrasoDias }}</q-td>
        </template>
      </q-table>

      <template v-if="concentracao.length">
        <h3 class="secao-titulo">Concentração</h3>
        <q-table
          flat
          bordered
          row-key="clienteId"
          class="q-mb-md"
          :rows="concentracao"
          :columns="colunasConcentracao"
          hide-pagination
          :rows-per-page-options="[0]"
        >
          <template #body-cell-exposicao="props">
            <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.exposicao) }}</q-td>
          </template>
          <template #body-cell-percentualCarteira="props">
            <q-td :props="props">
              <agro-badge
                :label="`${formatarDecimal(props.row.percentualCarteira)}%`"
                :variant="props.row.acimaLimite ? 'warning' : 'default'"
              />
            </q-td>
          </template>
        </q-table>
      </template>

      <template v-if="agingRows.length">
        <h3 class="secao-titulo">Aging da carteira</h3>
        <q-table
          flat
          bordered
          row-key="faixa"
          class="q-mb-md"
          :rows="agingRows"
          :columns="colunasAging"
          hide-pagination
          :rows-per-page-options="[0]"
        >
          <template #body-cell-quantidade="props">
            <q-td :props="props" class="text-metric">{{ props.row.quantidade }}</q-td>
          </template>
          <template #body-cell-valor="props">
            <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.valor) }}</q-td>
          </template>
        </q-table>
      </template>

      <template v-if="pdd">
        <h3 class="secao-titulo">
          PDD
          <span class="text-metric text-negative">{{ formatarMoeda(pdd.totalProvisionado) }}</span>
        </h3>
        <q-table
          flat
          bordered
          row-key="faixa"
          :rows="pdd.faixas"
          :columns="colunasPdd"
          hide-pagination
          :rows-per-page-options="[0]"
        >
          <template #body-cell-valor="props">
            <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.valor) }}</q-td>
          </template>
          <template #body-cell-percentualProvisionamento="props">
            <q-td :props="props" class="text-metric">
              {{ props.row.percentualProvisionamento }}%
            </q-td>
          </template>
          <template #body-cell-valorProvisionado="props">
            <q-td :props="props" class="text-metric">
              {{ formatarMoeda(props.row.valorProvisionado) }}
            </q-td>
          </template>
        </q-table>
      </template>
    </template>
    <empty-state
      v-else-if="!carregando"
      titulo="Painel indisponível"
      descricao="Não foi possível carregar a carteira de crédito."
      icon="account_balance"
    />
  </div>
</template>

<script setup lang="ts">
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroFormSkeleton from 'components/ui/AgroFormSkeleton.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import MetricTile from 'components/ui/MetricTile.vue';
import { useCobrancaCredito } from 'composables/useCobrancaCredito';
import type { QTableColumn } from 'quasar';
import type {
  CarteiraClienteItemDto,
  ConcentracaoItemDto,
  PddFaixaDto,
} from 'types/dtos/cobranca-credito.dto';
import { formatarDecimal, formatarMoeda } from 'utils/formatters';
import { computed, onMounted } from 'vue';

interface AgingRow {
  faixa: string;
  label: string;
  quantidade: number;
  valor: number;
}

const { carteira, aging, concentracao, pdd, carregando, carregarPainel } = useCobrancaCredito();

const utilizacaoPct = computed(() => {
  const c = carteira.value;
  if (!c || c.limiteTotal <= 0) return 0;
  return (c.utilizadoTotal / c.limiteTotal) * 100;
});

const agingRows = computed((): AgingRow[] => {
  const a = aging.value;
  if (!a) return [];
  return [
    { faixa: 'aVencer', label: 'A vencer', quantidade: a.aVencer.quantidade, valor: a.aVencer.valor },
    { faixa: 'de1a15', label: '1–15 dias', quantidade: a.de1a15.quantidade, valor: a.de1a15.valor },
    { faixa: 'de16a30', label: '16–30 dias', quantidade: a.de16a30.quantidade, valor: a.de16a30.valor },
    { faixa: 'de31a60', label: '31–60 dias', quantidade: a.de31a60.quantidade, valor: a.de31a60.valor },
    { faixa: 'de61a90', label: '61–90 dias', quantidade: a.de61a90.quantidade, valor: a.de61a90.valor },
    {
      faixa: 'de91a180',
      label: '91–180 dias',
      quantidade: a.de91a180.quantidade,
      valor: a.de91a180.valor,
    },
    {
      faixa: 'acima180',
      label: 'Acima de 180 dias',
      quantidade: a.acima180.quantidade,
      valor: a.acima180.valor,
    },
  ];
});

const colunasCarteira: QTableColumn<CarteiraClienteItemDto>[] = [
  { name: 'clienteNome', label: 'Cliente', field: 'clienteNome', align: 'left' },
  { name: 'limiteCredito', label: 'Limite', field: 'limiteCredito', align: 'right' },
  { name: 'utilizado', label: 'Utilizado', field: 'utilizado', align: 'right' },
  { name: 'disponivel', label: 'Disponível', field: 'disponivel', align: 'right' },
  { name: 'maiorAtrasoDias', label: 'Maior atraso', field: 'maiorAtrasoDias', align: 'right' },
  { name: 'statusAdimplencia', label: 'Status', field: 'statusAdimplencia', align: 'left' },
];

const colunasConcentracao: QTableColumn<ConcentracaoItemDto>[] = [
  { name: 'clienteNome', label: 'Cliente', field: 'clienteNome', align: 'left' },
  { name: 'exposicao', label: 'Exposição', field: 'exposicao', align: 'right' },
  {
    name: 'percentualCarteira',
    label: '% carteira',
    field: 'percentualCarteira',
    align: 'right',
  },
];

const colunasAging: QTableColumn<AgingRow>[] = [
  { name: 'label', label: 'Faixa', field: 'label', align: 'left' },
  { name: 'quantidade', label: 'Títulos', field: 'quantidade', align: 'right' },
  { name: 'valor', label: 'Valor', field: 'valor', align: 'right' },
];

const colunasPdd: QTableColumn<PddFaixaDto>[] = [
  { name: 'faixa', label: 'Faixa', field: 'faixa', align: 'left' },
  { name: 'valor', label: 'Valor', field: 'valor', align: 'right' },
  {
    name: 'percentualProvisionamento',
    label: '% PDD',
    field: 'percentualProvisionamento',
    align: 'right',
  },
  { name: 'valorProvisionado', label: 'Provisão', field: 'valorProvisionado', align: 'right' },
];

onMounted(() => {
  void carregarPainel();
});
</script>

<style scoped>
.painel {
  padding: var(--spacing-4);
}

.utilizacao {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-2);
}

.secao-titulo {
  margin: var(--spacing-4) 0 var(--spacing-2);
}
</style>
