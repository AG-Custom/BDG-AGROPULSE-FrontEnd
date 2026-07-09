<template>
  <q-page class="agro-page">
    <app-page-header titulo="Unidades" subtitulo="Gerencie as unidades da sua empresa.">
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Nova unidade"
        descricao="Cadastrar uma nova unidade operacional"
        :to="{ name: 'unidade-nova' }"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <div class="agro-filter-bar">
          <q-select
            v-model="filtroStatus"
            outlined
            dense
            label="Status"
            emit-value
            map-options
            class="unidades-list__status"
            :options="opcoesStatus"
          />
        </div>

        <agro-table-skeleton v-if="carregando && unidades.length === 0" :colunas="6" />

        <empty-state
          v-else-if="!carregando && unidades.length === 0"
          titulo="Nenhuma unidade encontrada"
          :descricao="descricaoVazia"
          icon="store"
        >
          <agro-btn
            v-if="filtroStatus === 'ativas'"
            color="primary"
            unelevated
            label="Cadastrar unidade"
            descricao="Ir para o cadastro de unidade"
            :to="{ name: 'unidade-nova' }"
          />
        </empty-state>

        <q-table
          v-else
          flat
          bordered
          row-key="id"
          class="unidades-table"
          :rows="unidades"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-tipo="props">
            <q-td :props="props">
              {{ rotuloTipo(props.row.tipo) }}
            </q-td>
          </template>

          <template #body-cell-status="props">
            <q-td :props="props">
              <agro-badge
                :label="props.row.status"
                :variant="props.row.status === UnidadeStatus.Ativa ? 'success' : 'default'"
              />
            </q-td>
          </template>

          <template #body-cell-matriz="props">
            <q-td :props="props">
              <q-icon
                v-if="props.row.matriz"
                name="check_circle"
                color="primary"
                size="20px"
                aria-label="Unidade matriz"
              >
                <q-tooltip>Unidade matriz</q-tooltip>
              </q-icon>
              <span v-else class="text-secondary">—</span>
            </q-td>
          </template>

          <template #body-cell-acoes="props">
            <q-td :props="props" class="unidades-table__acoes">
              <agro-btn
                flat
                round
                dense
                icon="visibility"
                color="primary"
                descricao="Visualizar unidade"
                :to="{ name: 'unidade-visualizar', params: { id: props.row.id } }"
              />
              <agro-btn
                flat
                round
                dense
                icon="edit"
                color="primary"
                descricao="Editar unidade"
                :to="{ name: 'unidade-editar', params: { id: props.row.id } }"
              />
              <agro-btn
                v-if="props.row.status === UnidadeStatus.Ativa"
                flat
                round
                dense
                icon="block"
                color="negative"
                descricao="Inativar unidade"
                :loading="inativando"
                @click="inativarUnidade(props.row)"
              />
              <agro-btn
                v-if="props.row.status === UnidadeStatus.Inativa"
                flat
                round
                dense
                icon="check_circle"
                color="positive"
                descricao="Reativar unidade"
                :loading="ativando"
                @click="ativarUnidade(props.row)"
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
import { TipoUnidadeOpcoes, UnidadeStatus } from 'constants/enums';
import { useUnidades } from 'composables/useUnidades';
import type { ListarUnidadesParams, UnidadeDto } from 'types/dtos/unidade.dto';
import type { QTableColumn } from 'quasar';
import { computed, onMounted, ref, watch } from 'vue';

const {
  unidades,
  carregando,
  inativando,
  ativando,
  carregar,
  solicitarInativacao,
  solicitarAtivacao,
} = useUnidades();

const filtroStatus = ref<'ativas' | 'inativas' | 'todas'>('ativas');

const opcoesStatus = [
  { label: 'Ativas', value: 'ativas' },
  { label: 'Inativas', value: 'inativas' },
  { label: 'Todas', value: 'todas' },
];

const colunas: QTableColumn<UnidadeDto>[] = [
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left', sortable: true },
  { name: 'codigo', label: 'Código', field: 'codigo', align: 'left', sortable: true },
  { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'left', sortable: true },
  { name: 'status', label: 'Status', field: 'status', align: 'left', sortable: true },
  { name: 'matriz', label: 'Matriz', field: 'matriz', align: 'center' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

const descricaoVazia = computed(() => {
  if (filtroStatus.value === 'inativas') {
    return 'Nenhuma unidade inativa encontrada.';
  }

  if (filtroStatus.value === 'todas') {
    return 'Nenhuma unidade cadastrada.';
  }

  return 'Cadastre unidades para organizar as operações da sua empresa.';
});

function montarParams(): ListarUnidadesParams | undefined {
  if (filtroStatus.value === 'ativas') {
    return { ativo: true };
  }

  if (filtroStatus.value === 'inativas') {
    return { ativo: false };
  }

  return undefined;
}

function rotuloTipo(tipo: string): string {
  return TipoUnidadeOpcoes.find((opcao) => opcao.value === tipo)?.label ?? tipo;
}

async function recarregar(): Promise<void> {
  await carregar(montarParams());
}

async function inativarUnidade(unidade: UnidadeDto): Promise<void> {
  await solicitarInativacao(unidade);
}

async function ativarUnidade(unidade: UnidadeDto): Promise<void> {
  await solicitarAtivacao(unidade);
}

watch(filtroStatus, () => {
  void recarregar();
});

onMounted(() => {
  void recarregar();
});
</script>

<style scoped>
.unidades-list__status {
  min-width: 160px;
}

.unidades-table__acoes {
  white-space: nowrap;
}
</style>
