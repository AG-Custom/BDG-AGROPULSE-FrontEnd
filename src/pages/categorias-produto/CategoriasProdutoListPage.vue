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
        @click="abrirDialog()"
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
            descricao="Cadastrar uma nova categoria"
            @click="abrirDialog()"
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
              <agro-acoes-menu
                :ativo="props.row.ativo"
                :pode-editar="props.row.ativo"
                :loading-status="inativando || ativando"
                @editar="abrirDialog(props.row)"
                @visualizar="abrirDialogVisualizar(props.row)"
                @desabilitar="inativarCategoria(props.row)"
                @ativar="ativarCategoria(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>

    <q-dialog v-model="dialogAberto" persistent>
      <q-card class="categorias-produto-list__dialog">
        <q-card-section>
          <h4 class="categorias-produto-list__dialog-titulo">{{ tituloDialog }}</h4>
        </q-card-section>

        <q-card-section>
          <q-banner
            v-if="categoriaInativa"
            rounded
            class="categorias-produto-list__aviso"
          >
            Esta categoria está inativa e não pode ser editada.
          </q-banner>

          <categoria-produto-formulario
            ref="formularioRef"
            v-model:formulario="formulario"
            :somente-leitura="somenteLeitura || categoriaInativa"
          />
        </q-card-section>

        <q-card-actions align="right">
          <template v-if="somenteLeitura || categoriaInativa">
            <agro-btn flat label="Fechar" descricao="Fechar o formulário" @click="fecharDialog" />
          </template>
          <template v-else>
            <agro-btn
              flat
              label="Cancelar"
              descricao="Fechar sem salvar"
              :disable="salvando"
              @click="fecharDialog"
            />
            <agro-btn
              color="primary"
              unelevated
              :label="editandoId ? 'Salvar' : 'Cadastrar'"
              :descricao="editandoId ? 'Salvar alterações da categoria' : 'Cadastrar nova categoria'"
              :loading="salvando"
              @click="salvar"
            />
          </template>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import CategoriaProdutoFormulario from 'components/categorias-produto/CategoriaProdutoFormulario.vue';
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useCategoriasProduto } from 'composables/useCategoriasProduto';
import { useVerCustos } from 'composables/useVerCustos';
import type { QTableColumn } from 'quasar';
import type {
  CategoriaProdutoFormModel,
  CategoriaProdutoResumoDto,
  ListarCategoriasProdutoParams,
} from 'types/dtos/categoria-produto.dto';
import {
  categoriaProdutoDtoParaForm,
  criarCategoriaProdutoFormVazia,
} from 'utils/mappers/categoria-produto.mapper';
import { computed, onMounted, ref, watch } from 'vue';

const {
  categorias,
  carregando,
  salvando,
  inativando,
  ativando,
  carregar,
  criar,
  editar,
  solicitarInativacao,
  solicitarAtivacao,
} = useCategoriasProduto();

const { verCustos } = useVerCustos();

const busca = ref('');
const filtroAtivo = ref<'ativos' | 'inativos' | 'todos'>('ativos');
const dialogAberto = ref(false);
const somenteLeitura = ref(false);
const editandoId = ref<string | null>(null);
const categoriaAtiva = ref(true);
const formularioRef = ref<InstanceType<typeof CategoriaProdutoFormulario> | null>(null);
const formulario = ref<CategoriaProdutoFormModel>(criarCategoriaProdutoFormVazia());

const opcoesStatus = [
  { label: 'Ativos', value: 'ativos' },
  { label: 'Inativos', value: 'inativos' },
  { label: 'Todos', value: 'todos' },
];

const categoriaInativa = computed(() => !!editandoId.value && !categoriaAtiva.value && !somenteLeitura.value);

const tituloDialog = computed(() => {
  if (somenteLeitura.value) {
    return 'Visualizar categoria';
  }
  return editandoId.value ? 'Editar categoria' : 'Nova categoria';
});

const colunas = computed(() => {
  const base: QTableColumn<CategoriaProdutoResumoDto>[] = [
    { name: 'nome', label: 'Nome', field: 'nome', align: 'left', sortable: true },
    { name: 'margemMinimaPercentual', label: 'Margem mín.', field: 'margemMinimaPercentual', align: 'left' },
    { name: 'ativo', label: 'Status', field: 'ativo', align: 'left', sortable: true },
    { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
  ];

  return base.filter(
    (coluna) => coluna.name !== 'margemMinimaPercentual' || verCustos.value,
  );
});

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

function abrirDialog(item?: CategoriaProdutoResumoDto): void {
  somenteLeitura.value = false;
  editandoId.value = item?.id ?? null;
  categoriaAtiva.value = item?.ativo ?? true;
  formulario.value = item
    ? categoriaProdutoDtoParaForm(item)
    : criarCategoriaProdutoFormVazia();
  dialogAberto.value = true;
}

function abrirDialogVisualizar(item: CategoriaProdutoResumoDto): void {
  abrirDialog(item);
  somenteLeitura.value = true;
}

function fecharDialog(): void {
  dialogAberto.value = false;
}

async function salvar(): Promise<void> {
  const valido = (await formularioRef.value?.validar()) ?? false;
  if (!valido) {
    return;
  }

  const ok = editandoId.value
    ? await editar(editandoId.value, formulario.value)
    : await criar(formulario.value);

  if (ok) {
    fecharDialog();
    await recarregar();
  }
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

.categorias-produto-list__dialog {
  min-width: min(480px, 94vw);
  max-width: 560px;
}

.categorias-produto-list__dialog-titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}

.categorias-produto-list__aviso {
  background: var(--color-warning-50);
  color: var(--color-warning-700);
  margin-bottom: var(--spacing-4);
}
</style>
