<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Categorias de produto"
      subtitulo="Organize o catálogo de produtos por categorias."
    >
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Nova categoria"
        descricao="Cadastrar uma nova categoria"
        :to="{ name: 'categoria-produto-novo' }"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <div class="agro-filter-bar">
          <q-input
            v-model="busca"
            outlined
            dense
            label="Buscar"
            hint="Código ou nome"
            clearable
            class="categorias-produto-list__busca"
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>

          <q-select
            v-model="filtroAtivo"
            outlined
            dense
            label="Status"
            emit-value
            map-options
            class="categorias-produto-list__status"
            :options="opcoesStatus"
          />
        </div>

        <agro-table-skeleton v-if="carregando && categorias.length === 0" :colunas="4" />

        <empty-state
          v-else-if="!carregando && categorias.length === 0"
          titulo="Nenhuma categoria encontrada"
          :descricao="descricaoVazia"
          icon="category"
        >
          <agro-btn
            v-if="!busca && filtroAtivo === 'ativos'"
            color="primary"
            unelevated
            label="Cadastrar categoria"
            descricao="Ir para o cadastro de categoria"
            :to="{ name: 'categoria-produto-novo' }"
          />
        </empty-state>

        <q-table
          v-else
          flat
          bordered
          row-key="id"
          class="categorias-produto-list__tabela"
          :rows="categorias"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-margemMinimaPercentual="props">
            <q-td :props="props">
              {{ props.row.margemMinimaPercentual !== null ? `${props.row.margemMinimaPercentual}%` : '—' }}
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
            <q-td :props="props" class="categorias-produto-list__acoes">
              <agro-btn
                flat
                round
                dense
                icon="visibility"
                color="primary"
                descricao="Visualizar categoria"
                :to="{ name: 'categoria-produto-visualizar', params: { id: props.row.id } }"
              />
              <agro-btn
                flat
                round
                dense
                icon="edit"
                color="primary"
                descricao="Editar categoria"
                :to="{ name: 'categoria-produto-editar', params: { id: props.row.id } }"
              />
              <agro-btn
                v-if="props.row.ativo"
                flat
                round
                dense
                icon="block"
                color="negative"
                descricao="Inativar categoria"
                :loading="inativando"
                @click="inativarCategoria(props.row)"
              />
              <agro-btn
                v-else
                flat
                round
                dense
                icon="check_circle"
                color="positive"
                descricao="Reativar categoria"
                :loading="ativando"
                @click="ativarCategoria(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useCategoriasProduto } from 'composables/useCategoriasProduto';
import type {
  CategoriaProdutoResumoDto,
  ListarCategoriasProdutoParams,
} from 'types/dtos/categoria-produto.dto';
import type { QTableColumn } from 'quasar';
import { computed, onMounted, ref, watch } from 'vue';

const {
  categorias,
  carregando,
  inativando,
  ativando,
  carregar,
  solicitarInativacao,
  solicitarAtivacao,
} = useCategoriasProduto();

const busca = ref('');
const filtroAtivo = ref<'ativos' | 'inativos' | 'todos'>('ativos');

const opcoesStatus = [
  { label: 'Ativos', value: 'ativos' },
  { label: 'Inativos', value: 'inativos' },
  { label: 'Todos', value: 'todos' },
];

const colunas: QTableColumn<CategoriaProdutoResumoDto>[] = [
  { name: 'codigo', label: 'Código', field: 'codigo', align: 'left', sortable: true },
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left', sortable: true },
  { name: 'margemMinimaPercentual', label: 'Margem mín.', field: 'margemMinimaPercentual', align: 'left' },
  { name: 'ativo', label: 'Status', field: 'ativo', align: 'left', sortable: true },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

const descricaoVazia = computed(() => {
  if (busca.value || filtroAtivo.value !== 'ativos') {
    return 'Nenhuma categoria corresponde aos filtros aplicados.';
  }

  return 'Cadastre categorias para classificar seus produtos.';
});

function montarParams(): ListarCategoriasProdutoParams {
  const params: ListarCategoriasProdutoParams = {};

  if (filtroAtivo.value === 'ativos') {
    params.ativo = true;
  } else if (filtroAtivo.value === 'inativos') {
    params.ativo = false;
  }

  const termo = busca.value.trim();
  if (termo) {
    params.busca = termo;
  }

  return params;
}

async function recarregar(): Promise<void> {
  await carregar(montarParams());
}

async function inativarCategoria(categoria: CategoriaProdutoResumoDto): Promise<void> {
  await solicitarInativacao(categoria);
}

async function ativarCategoria(categoria: CategoriaProdutoResumoDto): Promise<void> {
  await solicitarAtivacao(categoria);
}

let debounceTimer: ReturnType<typeof setTimeout> | undefined;

watch([busca, filtroAtivo], () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    void recarregar();
  }, 400);
});

onMounted(() => {
  void recarregar();
});
</script>

<style scoped>
.categorias-produto-list__busca {
  flex: 1;
  min-width: 240px;
}

.categorias-produto-list__status {
  min-width: 160px;
}

.categorias-produto-list__acoes {
  white-space: nowrap;
}
</style>
