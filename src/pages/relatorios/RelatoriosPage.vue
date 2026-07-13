<template>
  <q-page class="agro-page">
    <app-page-header titulo="Relatórios" subtitulo="Curva ABC de lucratividade e comissões." />

    <section class="agro-section">
      <agro-card>
        <q-tabs v-model="aba" dense class="text-primary" active-color="primary" indicator-color="primary">
          <q-tab name="abc" label="Curva ABC" />
          <q-tab name="comissoes" label="Comissões" />
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

        <div v-else class="painel">
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
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useRelatorios } from 'composables/useRelatorios';
import type { QTableColumn } from 'quasar';
import type {
  ComissaoRepasseItemDto,
  CurvaAbcLucratividadeItemDto,
} from 'types/dtos/relatorio.dto';
import { formatarDecimal, formatarMoeda } from 'utils/formatters';
import { onMounted, ref, watch } from 'vue';

const { curvaAbc, comissoes, carregando, carregarCurvaAbc, carregarComissoes } = useRelatorios();

const aba = ref<'abc' | 'comissoes'>('abc');
const dias = ref('30');

const colunasAbc: QTableColumn<CurvaAbcLucratividadeItemDto>[] = [
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

const colunasCom: QTableColumn<ComissaoRepasseItemDto>[] = [
  { name: 'produtoCodigo', label: 'Código', field: 'produtoCodigo', align: 'left' },
  { name: 'produtoDescricao', label: 'Produto', field: 'produtoDescricao', align: 'left' },
  { name: 'vendedorUsuarioId', label: 'Vendedor', field: 'vendedorUsuarioId', align: 'left' },
  { name: 'valorVendido', label: 'Vendido', field: 'valorVendido', align: 'right' },
  { name: 'valorComissao', label: 'Comissão', field: 'valorComissao', align: 'right' },
];

async function carregarAbc(): Promise<void> {
  await carregarCurvaAbc({ dias: Number(dias.value) || undefined });
}

async function carregarCom(): Promise<void> {
  await carregarComissoes();
}

watch(aba, (nova) => {
  if (nova === 'abc') void carregarAbc();
  else void carregarCom();
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
  min-width: 120px;
}
</style>
