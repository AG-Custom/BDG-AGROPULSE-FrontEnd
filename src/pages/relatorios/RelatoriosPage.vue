<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Relatórios"
      subtitulo="Curva ABC, comissões e giro de estoque."
    />

    <section class="agro-section">
      <agro-card>
        <q-tabs
          v-model="aba"
          dense
          class="text-primary"
          active-color="primary"
          indicator-color="primary"
        >
          <q-tab name="abc" label="Curva ABC" />
          <q-tab name="comissoes" label="Comissões" />
          <q-tab name="giro" label="Giro de estoque" />
        </q-tabs>
        <q-separator />

        <div v-if="aba === 'abc'" class="painel">
          <div class="agro-filter-bar">
            <q-input v-model="dias" outlined dense label="Dias" type="number" class="filtro" />
            <agro-btn
              color="primary"
              unelevated
              label="Atualizar"
              descricao="Carregar curva ABC"
              :loading="carregando"
              @click="carregarAbc"
            />
          </div>

          <agro-table-skeleton v-if="carregando && curvaAbc.length === 0" :colunas="6" />
          <empty-state
            v-else-if="!carregando && curvaAbc.length === 0"
            titulo="Sem dados"
            descricao="Não há vendas no período informado."
            icon="analytics"
          />
          <q-table
            v-else
            flat
            bordered
            row-key="produtoId"
            :rows="curvaAbc"
            :columns="colunasAbc"
            :loading="carregando"
            :rows-per-page-options="[10, 25, 50]"
          >
            <template #body-cell-receita="props">
              <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.receita) }}</q-td>
            </template>
            <template #body-cell-lucro="props">
              <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.lucro) }}</q-td>
            </template>
            <template #body-cell-participacaoReceitaPercentual="props">
              <q-td :props="props" class="text-metric">
                {{ formatarDecimal(props.row.participacaoReceitaPercentual) }}%
              </q-td>
            </template>
          </q-table>
        </div>

        <div v-else-if="aba === 'comissoes'" class="painel">
          <div class="agro-filter-bar">
            <agro-btn
              color="primary"
              unelevated
              label="Atualizar"
              descricao="Carregar comissões"
              :loading="carregando"
              @click="carregarCom"
            />
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
            :columns="colunasCom"
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

        <div v-else class="painel">
          <div class="agro-filter-bar">
            <q-input v-model="dataInicio" outlined dense type="date" label="Data início" class="filtro" />
            <q-input v-model="dataFim" outlined dense type="date" label="Data fim" class="filtro" />
            <agro-btn
              color="primary"
              unelevated
              label="Atualizar"
              descricao="Carregar giro de estoque"
              :loading="carregando"
              @click="carregarGiro"
            />
          </div>

          <agro-table-skeleton v-if="carregando && giroEstoque.length === 0" :colunas="5" />
          <empty-state
            v-else-if="!carregando && giroEstoque.length === 0"
            titulo="Sem giro no período"
            descricao="Não há saídas de estoque no intervalo informado."
            icon="sync_alt"
          />
          <q-table
            v-else
            flat
            bordered
            row-key="produtoId"
            :rows="giroEstoque"
            :columns="colunasGiro"
            :loading="carregando"
            :rows-per-page-options="[10, 25, 50]"
          >
            <template #body-cell-produtoId="props">
              <q-td :props="props">{{ rotuloProduto(props.row.produtoId) }}</q-td>
            </template>
            <template #body-cell-quantidadeSaida="props">
              <q-td :props="props" class="text-metric">
                {{ formatarDecimal(props.row.quantidadeSaida) }}
              </q-td>
            </template>
            <template #body-cell-saldoAtual="props">
              <q-td :props="props" class="text-metric">
                {{ formatarDecimal(props.row.saldoAtual) }}
              </q-td>
            </template>
            <template #body-cell-estoqueMedio="props">
              <q-td :props="props" class="text-metric">
                {{ formatarDecimal(props.row.estoqueMedio) }}
              </q-td>
            </template>
            <template #body-cell-giro="props">
              <q-td :props="props" class="text-metric">
                {{ formatarDecimal(props.row.giro) }}
              </q-td>
            </template>
          </q-table>
        </div>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useProdutoOpcoesEstoque } from 'composables/useProdutoOpcoesEstoque';
import { useRelatorios } from 'composables/useRelatorios';
import { useVerCustos } from 'composables/useVerCustos';
import type { QTableColumn } from 'quasar';
import type {
  ComissaoRepasseItemDto,
  CurvaAbcLucratividadeItemDto,
  GiroEstoqueItemDto,
} from 'types/dtos/relatorio.dto';
import { formatarDecimal, formatarMoeda } from 'utils/formatters';
import { computed, onMounted, ref, watch } from 'vue';

const {
  curvaAbc,
  comissoes,
  giroEstoque,
  carregando,
  carregarCurvaAbc,
  carregarComissoes,
  carregarGiroEstoque,
} = useRelatorios();
const { rotuloProduto } = useProdutoOpcoesEstoque();
const { verCustos } = useVerCustos();

const aba = ref<'abc' | 'comissoes' | 'giro'>('abc');
const dias = ref('30');
const dataInicio = ref(dataIsoOffset(-30));
const dataFim = ref(dataIsoOffset(0));

const colunasAbc = computed(() => {
  const base: QTableColumn<CurvaAbcLucratividadeItemDto>[] = [
    { name: 'produtoCodigo', label: 'Código', field: 'produtoCodigo', align: 'left' },
    { name: 'produtoDescricao', label: 'Produto', field: 'produtoDescricao', align: 'left' },
    { name: 'classeAbc', label: 'Classe', field: 'classeAbc', align: 'left' },
    { name: 'receita', label: 'Receita', field: 'receita', align: 'right' },
    { name: 'lucro', label: 'Lucro', field: 'lucro', align: 'right' },
    {
      name: 'participacaoReceitaPercentual',
      label: 'Part. %',
      field: 'participacaoReceitaPercentual',
      align: 'right',
    },
  ];

  if (verCustos.value) {
    return base;
  }

  return base.filter((coluna) => coluna.name !== 'lucro');
});

const colunasCom = computed(() => {
  const base: QTableColumn<ComissaoRepasseItemDto>[] = [
    { name: 'produtoCodigo', label: 'Código', field: 'produtoCodigo', align: 'left' },
    { name: 'produtoDescricao', label: 'Produto', field: 'produtoDescricao', align: 'left' },
    { name: 'vendedorUsuarioId', label: 'Vendedor', field: 'vendedorUsuarioId', align: 'left' },
    { name: 'valorVendido', label: 'Vendido', field: 'valorVendido', align: 'right' },
    { name: 'valorComissao', label: 'Comissão', field: 'valorComissao', align: 'right' },
  ];

  if (verCustos.value) {
    return base;
  }

  return base.filter((coluna) => coluna.name !== 'valorComissao');
});

const colunasGiro: QTableColumn<GiroEstoqueItemDto>[] = [
  { name: 'produtoId', label: 'Produto', field: 'produtoId', align: 'left' },
  { name: 'quantidadeSaida', label: 'Saídas', field: 'quantidadeSaida', align: 'right' },
  { name: 'saldoAtual', label: 'Saldo atual', field: 'saldoAtual', align: 'right' },
  { name: 'estoqueMedio', label: 'Estoque médio', field: 'estoqueMedio', align: 'right' },
  { name: 'giro', label: 'Giro', field: 'giro', align: 'right' },
];

function dataIsoOffset(diasOffset: number): string {
  const data = new Date();
  data.setDate(data.getDate() + diasOffset);
  return data.toISOString().slice(0, 10);
}

async function carregarAbc(): Promise<void> {
  await carregarCurvaAbc({ dias: Number(dias.value) || undefined });
}

async function carregarCom(): Promise<void> {
  await carregarComissoes();
}

async function carregarGiro(): Promise<void> {
  await carregarGiroEstoque({
    dataInicio: dataInicio.value || undefined,
    dataFim: dataFim.value || undefined,
  });
}

watch(aba, (nova) => {
  if (nova === 'abc') void carregarAbc();
  else if (nova === 'comissoes') void carregarCom();
  else void carregarGiro();
});

onMounted(() => {
  void carregarAbc();
});
</script>

<style scoped>
.painel {
  padding-top: var(--spacing-4);
}

.filtro {
  min-width: 140px;
}
</style>
