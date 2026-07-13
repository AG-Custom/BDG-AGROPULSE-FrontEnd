<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Histórico de compras"
      subtitulo="Consultas por fornecedor, produto e evolução de preço."
    />

    <section class="agro-section detalhe">
      <agro-card>
        <div class="agro-filter-bar row q-col-gutter-md">
          <div class="col-12 col-md-3">
            <q-select
              v-model="filtros.fornecedorId"
              outlined
              dense
              clearable
              emit-value
              map-options
              label="Fornecedor"
              :options="fornecedorOpcoes"
            />
          </div>
          <div class="col-12 col-md-3">
            <q-select
              v-model="filtros.produtoId"
              outlined
              dense
              clearable
              emit-value
              map-options
              label="Produto"
              :options="produtoOpcoes"
            />
          </div>
          <div class="col-6 col-md-2">
            <q-input v-model="filtros.dataInicio" outlined dense label="Data início" type="date" />
          </div>
          <div class="col-6 col-md-2">
            <q-input v-model="filtros.dataFim" outlined dense label="Data fim" type="date" />
          </div>
          <div class="col-12 col-md-2 flex items-end">
            <agro-btn
              color="primary"
              unelevated
              label="Filtrar"
              descricao="Aplicar filtros"
              :loading="carregando"
              @click="aplicarFiltros"
            />
          </div>
        </div>
      </agro-card>

      <agro-card>
        <h3 class="titulo">Ocorrências</h3>
        <agro-table-skeleton v-if="carregando && historico.length === 0" :colunas="6" />
        <empty-state
          v-else-if="!carregando && historico.length === 0"
          titulo="Sem histórico"
          descricao="Ajuste os filtros ou confirme recebimentos para gerar histórico."
          icon="history"
        />
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="historico"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-dataOcorrencia="props">
            <q-td :props="props">{{ formatarData(props.row.dataOcorrencia) }}</q-td>
          </template>
          <template #body-cell-fornecedorId="props">
            <q-td :props="props">{{ rotuloFornecedor(props.row.fornecedorId) }}</q-td>
          </template>
          <template #body-cell-produtoId="props">
            <q-td :props="props">{{ rotuloProduto(props.row.produtoId) }}</q-td>
          </template>
          <template #body-cell-quantidade="props">
            <q-td :props="props" class="text-metric">{{ formatarDecimal(props.row.quantidade) }}</q-td>
          </template>
          <template #body-cell-precoUnitario="props">
            <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.precoUnitario) }}</q-td>
          </template>
        </q-table>
      </agro-card>

      <agro-card>
        <h3 class="titulo">Evolução de preço</h3>
        <div class="agro-filter-bar row q-col-gutter-md q-mb-md">
          <div class="col-12 col-md-4">
            <q-select
              v-model="produtoEvolucaoId"
              outlined
              dense
              emit-value
              map-options
              label="Produto"
              :options="produtoOpcoes"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-select
              v-model="fornecedorEvolucaoId"
              outlined
              dense
              clearable
              emit-value
              map-options
              label="Fornecedor (opcional)"
              :options="fornecedorOpcoes"
            />
          </div>
          <div class="col-12 col-md-2 flex items-end">
            <agro-btn
              unelevated
              color="primary"
              label="Carregar"
              descricao="Carregar evolução de preço"
              :loading="carregandoEvolucao"
              :disable="!produtoEvolucaoId"
              @click="carregarEvolucaoPreco"
            />
          </div>
        </div>

        <agro-table-skeleton v-if="carregandoEvolucao && evolucao.length === 0" :colunas="3" />
        <empty-state
          v-else-if="!carregandoEvolucao && evolucao.length === 0"
          titulo="Sem evolução"
          descricao="Selecione um produto para ver a evolução de preços."
          icon="show_chart"
        />
        <q-table
          v-else
          flat
          bordered
          row-key="chave"
          :rows="evolucaoComChave"
          :columns="colunasEvolucao"
          :loading="carregandoEvolucao"
          :rows-per-page-options="[10, 25]"
        >
          <template #body-cell-data="props">
            <q-td :props="props">{{ formatarData(props.row.data) }}</q-td>
          </template>
          <template #body-cell-fornecedorId="props">
            <q-td :props="props">{{ rotuloFornecedor(props.row.fornecedorId) }}</q-td>
          </template>
          <template #body-cell-precoUnitario="props">
            <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.precoUnitario) }}</q-td>
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
import { useFornecedores } from 'composables/useFornecedores';
import { useHistoricoCompras } from 'composables/useHistoricoCompras';
import { useProdutos } from 'composables/useProdutos';
import type { QTableColumn } from 'quasar';
import type { EvolucaoPrecoCompraDto, HistoricoCompraDto } from 'types/dtos/compras.dto';
import { formatarData, formatarDecimal, formatarMoeda } from 'utils/formatters';
import { computed, onMounted, reactive, ref } from 'vue';

type EvolucaoRow = EvolucaoPrecoCompraDto & { chave: string };

const { historico, evolucao, carregando, carregandoEvolucao, carregar, carregarEvolucao } =
  useHistoricoCompras();
const { fornecedores, carregar: carregarFornecedores } = useFornecedores();
const { produtos, carregar: carregarProdutos } = useProdutos();

const filtros = reactive({
  fornecedorId: null as string | null,
  produtoId: null as string | null,
  dataInicio: '',
  dataFim: '',
});
const produtoEvolucaoId = ref('');
const fornecedorEvolucaoId = ref<string | null>(null);

const fornecedorOpcoes = computed(() =>
  fornecedores.value.map((f) => ({ label: f.razaoSocial, value: f.id })),
);
const produtoOpcoes = computed(() =>
  produtos.value.map((p) => ({ label: `${p.codigo} — ${p.descricao}`, value: p.id })),
);
const mapaFornecedores = computed(() => {
  const m = new Map<string, string>();
  for (const f of fornecedores.value) m.set(f.id, f.razaoSocial);
  return m;
});
const mapaProdutos = computed(() => {
  const m = new Map<string, string>();
  for (const p of produtos.value) m.set(p.id, `${p.codigo} — ${p.descricao}`);
  return m;
});
const evolucaoComChave = computed<EvolucaoRow[]>(() =>
  evolucao.value.map((e, i) => ({ ...e, chave: `${e.data}-${e.fornecedorId}-${i}` })),
);

const colunas: QTableColumn<HistoricoCompraDto>[] = [
  { name: 'dataOcorrencia', label: 'Data', field: 'dataOcorrencia', align: 'left', sortable: true },
  { name: 'fornecedorId', label: 'Fornecedor', field: 'fornecedorId', align: 'left' },
  { name: 'produtoId', label: 'Produto', field: 'produtoId', align: 'left' },
  { name: 'quantidade', label: 'Qtd', field: 'quantidade', align: 'right' },
  { name: 'precoUnitario', label: 'Preço', field: 'precoUnitario', align: 'right' },
];
const colunasEvolucao: QTableColumn<EvolucaoRow>[] = [
  { name: 'data', label: 'Data', field: 'data', align: 'left', sortable: true },
  { name: 'fornecedorId', label: 'Fornecedor', field: 'fornecedorId', align: 'left' },
  { name: 'precoUnitario', label: 'Preço', field: 'precoUnitario', align: 'right' },
];

function rotuloFornecedor(id: string): string {
  return mapaFornecedores.value.get(id) ?? id;
}
function rotuloProduto(id: string): string {
  return mapaProdutos.value.get(id) ?? id;
}

async function aplicarFiltros(): Promise<void> {
  await carregar({
    fornecedorId: filtros.fornecedorId ?? undefined,
    produtoId: filtros.produtoId ?? undefined,
    dataInicio: filtros.dataInicio || undefined,
    dataFim: filtros.dataFim || undefined,
  });
}

async function carregarEvolucaoPreco(): Promise<void> {
  if (!produtoEvolucaoId.value) return;
  await carregarEvolucao({
    produtoId: produtoEvolucaoId.value,
    fornecedorId: fornecedorEvolucaoId.value ?? undefined,
  });
}

onMounted(() => {
  void carregarFornecedores();
  void carregarProdutos();
  void carregar();
});
</script>

<style scoped>
.detalhe {
  display: grid;
  gap: var(--spacing-6);
}
.titulo {
  margin: 0 0 var(--spacing-3);
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
</style>
