<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Tabelas de preço"
      subtitulo="Gerencie tabelas de preço e vigências comerciais."
    >
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Nova tabela"
        descricao="Cadastrar uma nova tabela de preço"
        :to="{ name: 'tabela-preco-novo' }"
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
            class="tabelas-preco-list__busca"
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
            class="tabelas-preco-list__status"
            :options="opcoesStatus"
          />
        </div>

        <agro-table-skeleton v-if="carregando && tabelas.length === 0" :colunas="5" />

        <empty-state
          v-else-if="!carregando && tabelas.length === 0"
          titulo="Nenhuma tabela encontrada"
          :descricao="descricaoVazia"
          icon="sell"
        >
          <agro-btn
            v-if="!busca && filtroAtivo === 'ativos'"
            color="primary"
            unelevated
            label="Cadastrar tabela"
            descricao="Ir para o cadastro de tabela de preço"
            :to="{ name: 'tabela-preco-novo' }"
          />
        </empty-state>

        <q-table
          v-else
          flat
          bordered
          row-key="id"
          class="tabelas-preco-list__tabela"
          :rows="tabelas"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-vigencia="props">
            <q-td :props="props">
              {{ formatarVigencia(props.row) }}
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
            <q-td :props="props" class="tabelas-preco-list__acoes">
              <agro-btn
                flat
                round
                dense
                icon="visibility"
                color="primary"
                descricao="Visualizar tabela de preço"
                :to="{ name: 'tabela-preco-visualizar', params: { id: props.row.id } }"
              />
              <agro-btn
                flat
                round
                dense
                icon="edit"
                color="primary"
                descricao="Editar tabela de preço"
                :to="{ name: 'tabela-preco-editar', params: { id: props.row.id } }"
              />
              <agro-btn
                v-if="props.row.ativo"
                flat
                round
                dense
                icon="block"
                color="negative"
                descricao="Inativar tabela de preço"
                :loading="inativando"
                @click="inativarTabela(props.row)"
              />
              <agro-btn
                v-else
                flat
                round
                dense
                icon="check_circle"
                color="positive"
                descricao="Reativar tabela de preço"
                :loading="ativando"
                @click="ativarTabela(props.row)"
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
import { useTabelasPreco } from 'composables/useTabelasPreco';
import type { ListarTabelasPrecoParams, TabelaPrecoResumoDto } from 'types/dtos/tabela-preco.dto';
import type { QTableColumn } from 'quasar';
import { computed, onMounted, ref, watch } from 'vue';

const {
  tabelas,
  carregando,
  inativando,
  ativando,
  carregar,
  solicitarInativacao,
  solicitarAtivacao,
} = useTabelasPreco();

const busca = ref('');
const filtroAtivo = ref<'ativos' | 'inativos' | 'todos'>('ativos');

const opcoesStatus = [
  { label: 'Ativos', value: 'ativos' },
  { label: 'Inativos', value: 'inativos' },
  { label: 'Todos', value: 'todos' },
];

const colunas: QTableColumn<TabelaPrecoResumoDto>[] = [
  { name: 'codigo', label: 'Código', field: 'codigo', align: 'left', sortable: true },
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left', sortable: true },
  { name: 'vigencia', label: 'Vigência', field: 'vigenciaInicio', align: 'left' },
  { name: 'ativo', label: 'Status', field: 'ativo', align: 'left', sortable: true },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

const descricaoVazia = computed(() => {
  if (busca.value || filtroAtivo.value !== 'ativos') {
    return 'Nenhuma tabela corresponde aos filtros aplicados.';
  }

  return 'Cadastre tabelas de preço para definir valores comerciais.';
});

function formatarVigencia(tabela: TabelaPrecoResumoDto): string {
  if (tabela.vigenciaFim) {
    return `${tabela.vigenciaInicio} — ${tabela.vigenciaFim}`;
  }

  return `${tabela.vigenciaInicio} — em aberto`;
}

function montarParams(): ListarTabelasPrecoParams {
  const params: ListarTabelasPrecoParams = {};

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

async function inativarTabela(tabela: TabelaPrecoResumoDto): Promise<void> {
  await solicitarInativacao(tabela);
}

async function ativarTabela(tabela: TabelaPrecoResumoDto): Promise<void> {
  await solicitarAtivacao(tabela);
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
.tabelas-preco-list__busca {
  flex: 1;
  min-width: 240px;
}

.tabelas-preco-list__status {
  min-width: 160px;
}

.tabelas-preco-list__acoes {
  white-space: nowrap;
}
</style>
