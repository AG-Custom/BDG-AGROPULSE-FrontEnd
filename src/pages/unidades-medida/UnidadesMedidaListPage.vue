<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Unidades de medida"
      subtitulo="Cadastre as unidades de medida do catálogo de produtos."
    >
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Nova unidade"
        descricao="Cadastrar uma nova unidade de medida"
        :to="{ name: 'unidade-medida-novo' }"
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
            hint="Código ou descrição"
            clearable
            class="unidades-medida-list__busca"
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
            class="unidades-medida-list__status"
            :options="opcoesStatus"
          />
        </div>

        <agro-table-skeleton v-if="carregando && unidadesMedida.length === 0" :colunas="4" />

        <empty-state
          v-else-if="!carregando && unidadesMedida.length === 0"
          titulo="Nenhuma unidade encontrada"
          :descricao="descricaoVazia"
          icon="straighten"
        >
          <agro-btn
            v-if="!busca && filtroAtivo === 'ativos'"
            color="primary"
            unelevated
            label="Cadastrar unidade"
            descricao="Ir para o cadastro de unidade de medida"
            :to="{ name: 'unidade-medida-novo' }"
          />
        </empty-state>

        <q-table
          v-else
          flat
          bordered
          row-key="id"
          class="unidades-medida-list__tabela"
          :rows="unidadesMedida"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-ativo="props">
            <q-td :props="props">
              <agro-badge
                :label="props.row.ativo ? 'Ativo' : 'Inativo'"
                :variant="props.row.ativo ? 'success' : 'default'"
              />
            </q-td>
          </template>

          <template #body-cell-acoes="props">
            <q-td :props="props" class="unidades-medida-list__acoes">
              <agro-acoes-menu
                :ativo="props.row.ativo"
                :visualizar-to="{ name: 'unidade-medida-visualizar', params: { id: props.row.id } }"
                :editar-to="{ name: 'unidade-medida-editar', params: { id: props.row.id } }"
                :loading-status="inativando || ativando"
                @desabilitar="inativarUnidade(props.row)"
                @ativar="ativarUnidade(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useUnidadesMedida } from 'composables/useUnidadesMedida';
import type {
  ListarUnidadesMedidaParams,
  UnidadeMedidaResumoDto,
} from 'types/dtos/unidade-medida.dto';
import type { QTableColumn } from 'quasar';
import { computed, onMounted, ref, watch } from 'vue';

const {
  unidadesMedida,
  carregando,
  inativando,
  ativando,
  carregar,
  solicitarInativacao,
  solicitarAtivacao,
} = useUnidadesMedida();

const busca = ref('');
const filtroAtivo = ref<'ativos' | 'inativos' | 'todos'>('ativos');

const opcoesStatus = [
  { label: 'Ativos', value: 'ativos' },
  { label: 'Inativos', value: 'inativos' },
  { label: 'Todos', value: 'todos' },
];

const colunas: QTableColumn<UnidadeMedidaResumoDto>[] = [
  { name: 'codigo', label: 'Código', field: 'codigo', align: 'left', sortable: true },
  { name: 'descricao', label: 'Descrição', field: 'descricao', align: 'left', sortable: true },
  { name: 'ativo', label: 'Status', field: 'ativo', align: 'left', sortable: true },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

const descricaoVazia = computed(() => {
  if (busca.value || filtroAtivo.value !== 'ativos') {
    return 'Nenhuma unidade corresponde aos filtros aplicados.';
  }

  return 'Cadastre unidades de medida como KG, UN ou L para seus produtos.';
});

function montarParams(): ListarUnidadesMedidaParams {
  const params: ListarUnidadesMedidaParams = {};

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

async function inativarUnidade(unidade: UnidadeMedidaResumoDto): Promise<void> {
  await solicitarInativacao(unidade);
}

async function ativarUnidade(unidade: UnidadeMedidaResumoDto): Promise<void> {
  await solicitarAtivacao(unidade);
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
.unidades-medida-list__busca {
  flex: 1;
  min-width: 240px;
}

.unidades-medida-list__status {
  min-width: 160px;
}

.unidades-medida-list__acoes {
  white-space: nowrap;
}
</style>
