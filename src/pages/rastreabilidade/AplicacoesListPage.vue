<template>
  <q-page class="agro-page">
    <app-page-header titulo="Aplicações de insumos" subtitulo="Registro de aplicações por talhão.">
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Nova aplicação"
        descricao="Registrar aplicação"
        :to="{ name: 'aplicacao-nova' }"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <div class="agro-filter-bar">
          <q-select
            v-model="filtros.talhaoId"
            outlined
            dense
            clearable
            emit-value
            map-options
            label="Talhão"
            class="filtro"
            :options="talhaoOpcoes"
          />
          <q-select
            v-model="filtros.safraId"
            outlined
            dense
            clearable
            emit-value
            map-options
            label="Safra"
            class="filtro"
            :options="safraOpcoes"
          />
          <q-input
            v-model="filtros.dataInicio"
            outlined
            dense
            label="Data início"
            type="date"
            class="filtro"
          />
          <q-input
            v-model="filtros.dataFim"
            outlined
            dense
            label="Data fim"
            type="date"
            class="filtro"
          />
          <agro-btn
            color="primary"
            unelevated
            label="Filtrar"
            descricao="Aplicar filtros"
            :loading="carregando"
            @click="aplicarFiltros"
          />
        </div>

        <agro-table-skeleton v-if="carregando && aplicacoes.length === 0" :colunas="6" />
        <empty-state
          v-else-if="!carregando && aplicacoes.length === 0"
          titulo="Nenhuma aplicação"
          descricao="Registre a primeira aplicação de insumo."
          icon="science"
        >
          <agro-btn
            color="primary"
            unelevated
            label="Nova aplicação"
            descricao="Registrar"
            :to="{ name: 'aplicacao-nova' }"
          />
        </empty-state>
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="aplicacoes"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-talhaoId="props">
            <q-td :props="props">{{ rotuloTalhao(props.row.talhaoId) }}</q-td>
          </template>
          <template #body-cell-produtoId="props">
            <q-td :props="props">{{ rotuloProduto(props.row.produtoId) }}</q-td>
          </template>
          <template #body-cell-dataAplicacao="props">
            <q-td :props="props">{{ formatarData(props.row.dataAplicacao) }}</q-td>
          </template>
          <template #body-cell-quantidade="props">
            <q-td :props="props" class="text-metric">
              {{ formatarDecimal(props.row.quantidade) }} {{ props.row.unidadeMedida }}
            </q-td>
          </template>
          <template #body-cell-numeroLote="props">
            <q-td :props="props">{{ props.row.numeroLote ?? '—' }}</q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props" class="acoes">
              <agro-acoes-menu
                :ativo="true"
                :mostrar-status="false"
                :mostrar-excluir="true"
                excluir-label="Remover"
                :editar-to="{ name: 'aplicacao-editar', params: { id: props.row.id } }"
                :loading-excluir="salvando"
                @excluir="onRemover(props.row.id)"
               @visualizar="abrirDialogVisualizar(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>

    <agro-entity-details-dialog
      v-model="dialogVisualizar"
      :titulo="tituloDetalhe"
      :registro="registroSelecionado"
    />
  </q-page>
</template>

<script setup lang="ts">
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroEntityDetailsDialog from 'components/ui/AgroEntityDetailsDialog.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useProdutos } from 'composables/useProdutos';
import { useRastreabilidade } from 'composables/useRastreabilidade';
import { useSafras } from 'composables/useSafras';
import type { QTableColumn } from 'quasar';
import type { AplicacaoInsumoDto } from 'types/dtos/rastreabilidade.dto';
import { formatarData, formatarDecimal } from 'utils/formatters';
import { computed, onMounted, reactive, ref } from 'vue';


const dialogVisualizar = ref(false);
const registroSelecionado = ref<Record<string, unknown> | null>(null);
const tituloDetalhe = computed(() => 'Detalhes de Aplicações de insumos');

const {
  aplicacoes,
  talhoes,
  carregando,
  salvando,
  carregarAplicacoes,
  carregarTalhoes,
  removerAplicacao,
} = useRastreabilidade();
const { produtos, carregar: carregarProdutos } = useProdutos();
const { safraOpcoes, carregar: carregarSafras } = useSafras();

const filtros = reactive({
  talhaoId: '' as string | null,
  safraId: '' as string | null,
  dataInicio: '',
  dataFim: '',
});

const talhaoOpcoes = computed(() =>
  talhoes.value.map((t) => ({ label: t.nome, value: t.id })),
);

const mapaTalhoes = computed(() => {
  const m = new Map<string, string>();
  for (const t of talhoes.value) m.set(t.id, t.nome);
  return m;
});
const mapaProdutos = computed(() => {
  const m = new Map<string, string>();
  for (const p of produtos.value) m.set(p.id, `${p.descricao}`);
  return m;
});

const colunas: QTableColumn<AplicacaoInsumoDto>[] = [
  { name: 'dataAplicacao', label: 'Data', field: 'dataAplicacao', align: 'left', sortable: true },
  { name: 'talhaoId', label: 'Talhão', field: 'talhaoId', align: 'left' },
  { name: 'produtoId', label: 'Produto', field: 'produtoId', align: 'left' },
  { name: 'numeroLote', label: 'Lote', field: 'numeroLote', align: 'left' },
  { name: 'quantidade', label: 'Qtd', field: 'quantidade', align: 'right' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function rotuloTalhao(id: string): string {
  return mapaTalhoes.value.get(id) ?? id;
}
function rotuloProduto(id: string): string {
  return mapaProdutos.value.get(id) ?? id;
}

function aplicarFiltros(): void {
  void carregarAplicacoes({
    talhaoId: filtros.talhaoId || undefined,
    safraId: filtros.safraId || undefined,
    dataInicio: filtros.dataInicio || undefined,
    dataFim: filtros.dataFim || undefined,
  });
}

async function onRemover(id: string): Promise<void> {
  const ok = await removerAplicacao(id);
  if (ok) aplicarFiltros();
}

onMounted(() => {
  void carregarTalhoes();
  void carregarProdutos();
  void carregarSafras();
  void carregarAplicacoes();
});
function abrirDialogVisualizar(registro: Record<string, unknown> | object): void {
  registroSelecionado.value = registro as Record<string, unknown>;
  dialogVisualizar.value = true;
}

</script>

<style scoped>
.filtro {
  min-width: 140px;
  max-width: 200px;
}
.acoes {
  white-space: nowrap;
}
</style>
