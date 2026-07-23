<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Colaboradores"
      subtitulo="Cadastre pessoas da empresa no RH, com vínculo opcional a usuários do sistema."
    >
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Novo colaborador"
        descricao="Cadastrar um novo colaborador"
        :to="{ name: 'colaborador-novo' }"
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
            hint="Nome, CPF ou e-mail"
            clearable
            class="colaboradores-list__busca"
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
            class="colaboradores-list__status"
            :options="opcoesStatus"
          />
        </div>

        <agro-table-skeleton v-if="carregando && colaboradores.length === 0" :colunas="6" />

        <empty-state
          v-else-if="!carregando && colaboradores.length === 0"
          titulo="Nenhum colaborador encontrado"
          :descricao="descricaoVazia"
          icon="badge"
        >
          <agro-btn
            v-if="!busca && filtroAtivo === 'ativos'"
            color="primary"
            unelevated
            label="Cadastrar colaborador"
            descricao="Ir para o cadastro de colaborador"
            :to="{ name: 'colaborador-novo' }"
          />
        </empty-state>

        <q-table
          v-else
          flat
          bordered
          row-key="id"
          class="colaboradores-list__tabela"
          :rows="colaboradores"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-cpf="props">
            <q-td :props="props">
              {{ rotuloCpf(props.row.cpf) }}
            </q-td>
          </template>

          <template #body-cell-cargo="props">
            <q-td :props="props">
              {{ rotuloCargo(props.row) }}
            </q-td>
          </template>

          <template #body-cell-status="props">
            <q-td :props="props">
              <agro-badge
                :label="rotuloStatus(props.row.status)"
                :variant="variantStatus(props.row.status)"
              />
            </q-td>
          </template>

          <template #body-cell-usuario="props">
            <q-td :props="props">
              {{ rotuloUsuarioVinculado(props.row) }}
            </q-td>
          </template>

          <template #body-cell-acoes="props">
            <q-td :props="props" class="colaboradores-list__acoes">
              <agro-acoes-menu
                :ativo="props.row.status === ColaboradorStatus.Ativo"
                :visualizar-to="{ name: 'colaborador-visualizar', params: { id: props.row.id } }"
                :editar-to="{ name: 'colaborador-editar', params: { id: props.row.id } }"
                :loading-status="inativando || ativando"
                @desabilitar="inativarColaborador(props.row)"
                @ativar="ativarColaborador(props.row)"
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
import { useColaboradores } from 'composables/useColaboradores';
import { useUsuarios } from 'composables/useUsuarios';
import { ColaboradorStatus } from 'constants/enums';
import type { ColaboradorResumoDto, ListarColaboradoresParams } from 'types/dtos/colaborador.dto';
import type { QTableColumn } from 'quasar';
import { computed, onMounted, ref, watch } from 'vue';

const {
  colaboradores,
  carregando,
  inativando,
  ativando,
  carregar,
  solicitarInativacao,
  solicitarAtivacao,
  rotuloCargo,
  rotuloCpf,
  rotuloStatus,
  variantStatus,
} = useColaboradores();

const { usuarios, carregar: carregarUsuarios, nomeCompleto: nomeCompletoUsuario } = useUsuarios();

const busca = ref('');
const filtroAtivo = ref<'ativos' | 'inativos' | 'todos'>('ativos');

const opcoesStatus = [
  { label: 'Ativos', value: 'ativos' },
  { label: 'Inativos', value: 'inativos' },
  { label: 'Todos', value: 'todos' },
];

const colunas: QTableColumn<ColaboradorResumoDto>[] = [
  { name: 'nomeCompleto', label: 'Nome', field: 'nomeCompleto', align: 'left', sortable: true },
  { name: 'cpf', label: 'CPF', field: 'cpf', align: 'left', sortable: true },
  { name: 'cargo', label: 'Cargo', field: 'cargo', align: 'left', sortable: true },
  { name: 'status', label: 'Status', field: 'status', align: 'left', sortable: true },
  { name: 'usuario', label: 'Usuário vinculado', field: 'usuarioId', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

const descricaoVazia = computed(() => {
  if (busca.value || filtroAtivo.value !== 'ativos') {
    return 'Nenhum colaborador corresponde aos filtros aplicados.';
  }

  return 'Cadastre colaboradores para o controle de RH da sua empresa.';
});

function montarParams(): ListarColaboradoresParams {
  const params: ListarColaboradoresParams = {};

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

function rotuloUsuarioVinculado(colaborador: ColaboradorResumoDto): string {
  if (!colaborador.usuarioId) {
    return '—';
  }

  const usuario = usuarios.value.find((item) => item.id === colaborador.usuarioId);
  return usuario ? `${nomeCompletoUsuario(usuario)} (${usuario.email})` : '—';
}

async function recarregar(): Promise<void> {
  await Promise.all([carregar(montarParams()), carregarUsuarios()]);
}

async function inativarColaborador(colaborador: ColaboradorResumoDto): Promise<void> {
  await solicitarInativacao(colaborador);
}

async function ativarColaborador(colaborador: ColaboradorResumoDto): Promise<void> {
  await solicitarAtivacao(colaborador);
}

let debounceTimer: ReturnType<typeof setTimeout> | undefined;

watch([busca, filtroAtivo], () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    void carregar(montarParams());
  }, 400);
});

onMounted(() => {
  void recarregar();
});
</script>

<style scoped>
.colaboradores-list__busca {
  flex: 1;
  min-width: 240px;
}

.colaboradores-list__status {
  min-width: 160px;
}

.colaboradores-list__acoes {
  white-space: nowrap;
}
</style>
