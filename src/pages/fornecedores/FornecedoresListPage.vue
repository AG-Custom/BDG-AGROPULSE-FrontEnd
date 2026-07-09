<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Fornecedores"
      subtitulo="Gerencie os fornecedores cadastrados na sua empresa."
    >
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Novo fornecedor"
        descricao="Cadastrar um novo fornecedor"
        :to="{ name: 'fornecedor-novo' }"
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
            hint="Razão social, nome fantasia ou documento"
            clearable
            class="fornecedores-list__busca"
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
            class="fornecedores-list__status"
            :options="opcoesStatus"
          />
        </div>

        <agro-table-skeleton v-if="carregando && fornecedores.length === 0" :colunas="6" />

        <empty-state
          v-else-if="!carregando && fornecedores.length === 0"
          titulo="Nenhum fornecedor encontrado"
          :descricao="descricaoVazia"
          icon="local_shipping"
        >
          <agro-btn
            v-if="!busca && filtroAtivo === 'todos'"
            color="primary"
            unelevated
            label="Cadastrar fornecedor"
            descricao="Ir para o cadastro de fornecedor"
            :to="{ name: 'fornecedor-novo' }"
          />
        </empty-state>

        <q-table
          v-else
          flat
          bordered
          row-key="id"
          class="fornecedores-list__tabela"
          :rows="fornecedores"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-documento="props">
            <q-td :props="props">
              {{ rotuloDocumento(props.row) }}
            </q-td>
          </template>

          <template #body-cell-tipoPessoa="props">
            <q-td :props="props">
              {{ rotuloTipoPessoa(props.row.tipoPessoa) }}
            </q-td>
          </template>

          <template #body-cell-nomeFantasia="props">
            <q-td :props="props">
              {{ props.row.nomeFantasia || '—' }}
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
            <q-td :props="props" class="fornecedores-list__acoes">
              <agro-btn
                flat
                round
                dense
                icon="visibility"
                color="primary"
                descricao="Visualizar fornecedor"
                :to="{ name: 'fornecedor-visualizar', params: { id: props.row.id } }"
              />
              <agro-btn
                flat
                round
                dense
                icon="edit"
                color="primary"
                descricao="Editar fornecedor"
                :to="{ name: 'fornecedor-editar', params: { id: props.row.id } }"
              />
              <agro-btn
                v-if="props.row.ativo"
                flat
                round
                dense
                icon="block"
                color="negative"
                descricao="Inativar fornecedor"
                :loading="inativando"
                @click="inativarFornecedor(props.row)"
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
import { TipoPessoaFornecedorOpcoes } from 'constants/enums';
import { useFornecedores } from 'composables/useFornecedores';
import type { FornecedorResumoDto, ListarFornecedoresParams } from 'types/dtos/fornecedor.dto';
import type { TipoPessoaFornecedorValor } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import { computed, onMounted, ref, watch } from 'vue';

const { fornecedores, carregando, inativando, carregar, solicitarInativacao, rotuloDocumento } =
  useFornecedores();

const busca = ref('');
const filtroAtivo = ref<'todos' | 'ativos' | 'inativos'>('ativos');

const opcoesStatus = [
  { label: 'Ativos', value: 'ativos' },
  { label: 'Inativos', value: 'inativos' },
  { label: 'Todos', value: 'todos' },
];

const colunas: QTableColumn<FornecedorResumoDto>[] = [
  { name: 'documento', label: 'Documento', field: 'documento', align: 'left', sortable: true },
  { name: 'razaoSocial', label: 'Razão social', field: 'razaoSocial', align: 'left', sortable: true },
  { name: 'nomeFantasia', label: 'Nome fantasia', field: 'nomeFantasia', align: 'left', sortable: true },
  { name: 'tipoPessoa', label: 'Tipo', field: 'tipoPessoa', align: 'left', sortable: true },
  { name: 'ativo', label: 'Status', field: 'ativo', align: 'left', sortable: true },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

const descricaoVazia = computed(() => {
  if (busca.value || filtroAtivo.value !== 'todos') {
    return 'Nenhum fornecedor corresponde aos filtros aplicados.';
  }

  return 'Cadastre fornecedores para gerenciar insumos e parceiros comerciais.';
});

function montarParams(): ListarFornecedoresParams {
  const params: ListarFornecedoresParams = {};

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

function rotuloTipoPessoa(tipo: TipoPessoaFornecedorValor): string {
  return TipoPessoaFornecedorOpcoes.find((opcao) => opcao.value === tipo)?.label ?? tipo;
}

async function recarregar(): Promise<void> {
  await carregar(montarParams());
}

async function inativarFornecedor(fornecedor: FornecedorResumoDto): Promise<void> {
  const sucesso = await solicitarInativacao(fornecedor);

  if (sucesso) {
    await recarregar();
  }
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
.fornecedores-list__busca {
  flex: 1;
  min-width: 240px;
}

.fornecedores-list__status {
  min-width: 160px;
}

.fornecedores-list__acoes {
  white-space: nowrap;
}
</style>
