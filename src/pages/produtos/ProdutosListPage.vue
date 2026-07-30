<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Produtos"
      subtitulo="Gerencie o catálogo de produtos da sua empresa."
    >
      <div class="produtos-list__acoes-header">
        <agro-btn
          flat
          icon="table_view"
          label="Excel"
          descricao="Exportar listagem para Excel"
          :loading="exportando"
          @click="exportarLista('excel')"
        />
        <agro-btn
          flat
          icon="picture_as_pdf"
          label="PDF"
          descricao="Exportar listagem para PDF"
          :loading="exportando"
          @click="exportarLista('pdf')"
        />
        <agro-btn
          color="primary"
          unelevated
          icon="add"
          label="Novo produto"
          descricao="Cadastrar um novo produto"
          :to="{ name: 'produto-novo' }"
        />
      </div>
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <div class="agro-filter-bar">
          <q-input
            v-model="busca"
            outlined
            dense
            label="Buscar"
            hint="Código ou descrição"
            clearable
            class="produtos-list__busca"
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>

          <q-select
            v-model="filtroCategoria"
            outlined
            dense
            label="Categoria"
            emit-value
            map-options
            clearable
            class="produtos-list__categoria"
            :options="categoriaOpcoes"
            :loading="carregandoCategorias"
          />

          <q-select
            v-model="filtroAtivo"
            outlined
            dense
            label="Status"
            emit-value
            map-options
            class="produtos-list__status"
            :options="opcoesStatus"
          />
        </div>

        <agro-table-skeleton v-if="carregando && produtos.length === 0" :colunas="5" />

        <empty-state
          v-else-if="!carregando && produtos.length === 0"
          titulo="Nenhum produto encontrado"
          :descricao="descricaoVazia"
          icon="inventory_2"
        >
          <agro-btn
            v-if="!busca && !filtroCategoria && filtroAtivo === 'ativos'"
            color="primary"
            unelevated
            label="Cadastrar produto"
            descricao="Ir para o cadastro de produto"
            :to="{ name: 'produto-novo' }"
          />
        </empty-state>

        <q-table
          v-else
          flat
          bordered
          row-key="id"
          class="produtos-list__tabela"
          :rows="produtos"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-tipoProduto="props">
            <q-td :props="props">
              {{ rotuloTipoProduto(props.row.tipoProduto) }}
            </q-td>
          </template>

          <template #body-cell-categoriaProdutoId="props">
            <q-td :props="props">
              {{ rotuloCategoriaPorId(props.row.categoriaProdutoId) }}
            </q-td>
          </template>

          <template #body-cell-precoVenda="props">
            <q-td :props="props" class="text-metric">
              {{ formatarMoeda(props.row.precoVenda) }}
            </q-td>
          </template>

          <template #body-cell-ativo="props">
            <q-td :props="props">
              <agro-badge
                :label="props.row.ativo ? 'Ativo' : 'Inativo'"
                :variant="props.row.ativo ? 'success' : 'default'"
              />
            </q-td>
          </template>

          <template #body-cell-acoes="props">
            <q-td :props="props" class="produtos-list__acoes">
              <agro-acoes-menu
                :ativo="props.row.ativo"
                :editar-to="{ name: 'produto-editar', params: { id: props.row.id } }"
                :loading-status="inativando || ativando"
                @visualizar="abrirDialogVisualizar(props.row)"
                @desabilitar="inativarProduto(props.row)"
                @ativar="ativarProduto(props.row)"
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
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useCategoriasProduto } from 'composables/useCategoriasProduto';
import { useProdutos } from 'composables/useProdutos';
import { TipoProdutoOpcoes } from 'constants/enums';
import type { ExportacaoFormatoValor, TipoProdutoValor } from 'constants/enums';
import type { ListarProdutosParams, ProdutoResumoDto } from 'types/dtos/produto.dto';
import { formatarMoeda } from 'utils/formatters';
import type { QTableColumn } from 'quasar';
import { computed, onMounted, ref, watch } from 'vue';


const dialogVisualizar = ref(false);
const registroSelecionado = ref<Record<string, unknown> | null>(null);
const tituloDetalhe = computed(() => 'Detalhar produto');

const {
  produtos,
  carregando,
  inativando,
  ativando,
  exportando,
  carregar,
  solicitarInativacao,
  solicitarAtivacao,
  exportar,
} = useProdutos();

const {
  categorias,
  carregando: carregandoCategorias,
  carregar: carregarCategorias,
  rotuloCategoria,
} = useCategoriasProduto();

const busca = ref('');
const filtroAtivo = ref<'ativos' | 'inativos' | 'todos'>('ativos');
const filtroCategoria = ref<string | null>(null);

const opcoesStatus = [
  { label: 'Ativos', value: 'ativos' },
  { label: 'Inativos', value: 'inativos' },
  { label: 'Todos', value: 'todos' },
];

const categoriaOpcoes = computed(() =>
  categorias.value.map((categoria) => ({
    label: rotuloCategoria(categoria),
    value: categoria.id,
  })),
);

const colunas: QTableColumn<ProdutoResumoDto>[] = [
  { name: 'descricao', label: 'Nome', field: 'descricao', align: 'left', sortable: true },
  { name: 'tipoProduto', label: 'Tipo', field: 'tipoProduto', align: 'left', sortable: true },
  { name: 'categoriaProdutoId', label: 'Categoria', field: 'categoriaProdutoId', align: 'left' },
  { name: 'precoVenda', label: 'Preço', field: 'precoVenda', align: 'right', sortable: true },
  { name: 'ativo', label: 'Status', field: 'ativo', align: 'left', sortable: true },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

const descricaoVazia = computed(() => {
  if (busca.value || filtroCategoria.value || filtroAtivo.value !== 'ativos') {
    return 'Nenhum produto corresponde aos filtros aplicados.';
  }

  return 'Cadastre produtos para gerenciar estoque, preços e vendas.';
});

function rotuloTipoProduto(tipo: TipoProdutoValor): string {
  return TipoProdutoOpcoes.find((opcao) => opcao.value === tipo)?.label ?? tipo;
}

function rotuloCategoriaPorId(categoriaId: string): string {
  const categoria = categorias.value.find((item) => item.id === categoriaId);
  return categoria ? rotuloCategoria(categoria) : '—';
}

function montarParams(): ListarProdutosParams {
  const params: ListarProdutosParams = {};

  if (filtroAtivo.value === 'ativos') {
    params.ativo = true;
  } else if (filtroAtivo.value === 'inativos') {
    params.ativo = false;
  }

  const termo = busca.value.trim();
  if (termo) {
    params.busca = termo;
  }

  if (filtroCategoria.value) {
    params.categoriaProdutoId = filtroCategoria.value;
  }

  return params;
}

async function recarregar(): Promise<void> {
  await carregar(montarParams());
}

async function inativarProduto(produto: ProdutoResumoDto): Promise<void> {
  await solicitarInativacao(produto);
}

async function ativarProduto(produto: ProdutoResumoDto): Promise<void> {
  await solicitarAtivacao(produto);
}

async function exportarLista(formato: ExportacaoFormatoValor): Promise<void> {
  await exportar(formato, montarParams());
}

let debounceTimer: ReturnType<typeof setTimeout> | undefined;

watch([busca, filtroAtivo, filtroCategoria], () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    void recarregar();
  }, 400);
});

onMounted(() => {
  void carregarCategorias({ ativo: true });
  void recarregar();
});
function abrirDialogVisualizar(registro: Record<string, unknown> | object): void {
  registroSelecionado.value = registro as Record<string, unknown>;
  dialogVisualizar.value = true;
}

</script>

<style scoped>
.produtos-list__acoes-header {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
}

.produtos-list__busca {
  flex: 1;
  min-width: 240px;
}

.produtos-list__categoria {
  min-width: 200px;
}

.produtos-list__status {
  min-width: 160px;
}

.produtos-list__acoes {
  white-space: nowrap;
}
</style>
