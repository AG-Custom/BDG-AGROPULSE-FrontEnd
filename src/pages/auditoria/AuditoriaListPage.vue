<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Auditoria"
      subtitulo="Trilha de alterações de negócio da empresa — quem mudou o quê e quando."
    />

    <section class="agro-section">
      <agro-card>
        <div class="agro-filter-bar row q-col-gutter-md">
          <div class="col-6 col-md-2">
            <q-input
              v-model="filtroDe"
              outlined
              dense
              label="De"
              type="date"
            />
          </div>
          <div class="col-6 col-md-2">
            <q-input
              v-model="filtroAte"
              outlined
              dense
              label="Até"
              type="date"
            />
          </div>
          <div class="col-12 col-md-2">
            <q-select
              v-model="filtroAcao"
              outlined
              dense
              clearable
              emit-value
              map-options
              label="Ação"
              :options="OPCOES_ACAO_AUDITORIA"
            />
          </div>
          <div class="col-12 col-md-2">
            <q-input
              v-model="filtroModelo"
              outlined
              dense
              clearable
              label="Modelo"
              hint="Ex.: Produto"
            />
          </div>
          <div v-if="podeFiltrarUsuario" class="col-12 col-md-2">
            <q-select
              v-model="filtroUsuarioId"
              outlined
              dense
              clearable
              emit-value
              map-options
              label="Usuário"
              :options="opcoesUsuarios"
              :loading="carregandoUsuarios"
            />
          </div>
          <div class="col-12 col-md-2 flex items-end">
            <agro-btn
              color="primary"
              unelevated
              label="Filtrar"
              descricao="Aplicar filtros de auditoria"
              :loading="carregando"
              @click="aplicarFiltros"
            />
          </div>
        </div>
      </agro-card>

      <agro-card>
        <agro-table-skeleton v-if="carregando && logs.length === 0" :colunas="5" />

        <empty-state
          v-else-if="!carregando && logs.length === 0"
          titulo="Nenhum registro de auditoria"
          descricao="Quando houver alterações na empresa, elas aparecerão aqui."
          icon="history"
        />

        <q-table
          v-else
          flat
          bordered
          row-key="id"
          class="auditoria-list__tabela"
          :rows="logs"
          :columns="colunas"
          :loading="carregando"
          v-model:pagination="paginacaoTabela"
          :rows-number="total"
          binary-state-sort
          @row-click="abrirDetalhe"
          @request="onRequest"
        >
          <template #body-cell-createdAt="props">
            <q-td :props="props">
              {{ formatarDataHora(props.row.createdAt) }}
            </q-td>
          </template>

          <template #body-cell-acao="props">
            <q-td :props="props">
              {{ rotuloAcaoAuditoria(props.row.acao) }}
            </q-td>
          </template>

          <template #body-cell-modeloAfetado="props">
            <q-td :props="props">
              {{ rotuloModeloAuditoria(props.row.modeloAfetado) }}
              <span class="auditoria-list__id text-metric">
                #{{ encurtarId(props.row.registroId) }}
              </span>
            </q-td>
          </template>

          <template #body-cell-usuario="props">
            <q-td :props="props">
              {{
                props.row.usuarioNome ||
                (props.row.usuarioId ? 'Usuário' : 'Sistema')
              }}
            </q-td>
          </template>

          <template #body-cell-descricao="props">
            <q-td :props="props">
              {{ props.row.descricao || '—' }}
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>

    <auditoria-detalhe-dialog
      v-if="logSelecionado"
      v-model="detalheAberto"
      :log="logSelecionado"
    />
  </q-page>
</template>

<script setup lang="ts">
import AuditoriaDetalheDialog from 'components/auditoria/AuditoriaDetalheDialog.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useAuditoria } from 'composables/useAuditoria';
import { useAuth } from 'composables/useAuth';
import { useUsuarios } from 'composables/useUsuarios';
import { Permissoes } from 'constants/permissoes';
import type { LogAuditoriaDto } from 'types/dtos/auditoria.dto';
import {
  OPCOES_ACAO_AUDITORIA,
  encurtarId,
  rotuloAcaoAuditoria,
  rotuloModeloAuditoria,
} from 'utils/auditoria-labels';
import { formatarDataHora } from 'utils/formatters';
import type { QTableColumn, QTableProps } from 'quasar';
import { computed, onMounted, ref, watch } from 'vue';

const { logs, total, pagina, tamanhoPagina, carregando, carregar } =
  useAuditoria();
const { possuiPermissao } = useAuth();
const {
  usuarios,
  carregar: carregarUsuarios,
  nomeCompleto,
  carregando: carregandoUsuarios,
} = useUsuarios();

const filtroDe = ref('');
const filtroAte = ref('');
const filtroAcao = ref<string | null>(null);
const filtroModelo = ref('');
const filtroUsuarioId = ref<string | null>(null);
const detalheAberto = ref(false);
const logSelecionado = ref<LogAuditoriaDto | null>(null);

const podeFiltrarUsuario = computed(
  () =>
    possuiPermissao(Permissoes.Usuarios.Visualizar) ||
    possuiPermissao(Permissoes.Usuarios.Configurar),
);

const opcoesUsuarios = computed(() =>
  usuarios.value.map((usuario) => ({
    label: nomeCompleto(usuario),
    value: usuario.id,
  })),
);

const colunas: QTableColumn<LogAuditoriaDto>[] = [
  {
    name: 'createdAt',
    label: 'Quando',
    field: 'createdAt',
    align: 'left',
    sortable: false,
  },
  { name: 'acao', label: 'Ação', field: 'acao', align: 'left', sortable: false },
  {
    name: 'modeloAfetado',
    label: 'O quê',
    field: 'modeloAfetado',
    align: 'left',
    sortable: false,
  },
  {
    name: 'usuario',
    label: 'Quem',
    field: 'usuarioNome',
    align: 'left',
    sortable: false,
  },
  {
    name: 'descricao',
    label: 'Resumo',
    field: 'descricao',
    align: 'left',
    sortable: false,
  },
];

const paginacaoTabela = ref({
  page: 1,
  rowsPerPage: 25,
  rowsNumber: 0,
});

watch(total, (valor) => {
  paginacaoTabela.value.rowsNumber = valor;
});

function montarParams() {
  const deIso = filtroDe.value
    ? new Date(`${filtroDe.value}T00:00:00.000Z`).toISOString()
    : undefined;
  const ateIso = filtroAte.value
    ? new Date(`${filtroAte.value}T23:59:59.999Z`).toISOString()
    : undefined;

  return {
    modelo: filtroModelo.value.trim() || undefined,
    acao: filtroAcao.value || undefined,
    usuarioId: filtroUsuarioId.value || undefined,
    de: deIso,
    ate: ateIso,
    pagina: pagina.value,
    tamanhoPagina: tamanhoPagina.value,
  };
}

async function recarregar(): Promise<void> {
  await carregar(montarParams());
  paginacaoTabela.value.page = pagina.value;
  paginacaoTabela.value.rowsPerPage = tamanhoPagina.value;
  paginacaoTabela.value.rowsNumber = total.value;
}

async function aplicarFiltros(): Promise<void> {
  pagina.value = 1;
  paginacaoTabela.value.page = 1;
  await recarregar();
}

async function onRequest(requestProps: Parameters<NonNullable<QTableProps['onRequest']>>[0]) {
  const { page, rowsPerPage } = requestProps.pagination;
  pagina.value = page;
  tamanhoPagina.value = rowsPerPage || 25;
  paginacaoTabela.value.page = page;
  paginacaoTabela.value.rowsPerPage = tamanhoPagina.value;
  await recarregar();
}

function abrirDetalhe(_evt: Event, row: LogAuditoriaDto): void {
  logSelecionado.value = row;
  detalheAberto.value = true;
}

onMounted(() => {
  if (podeFiltrarUsuario.value) {
    void carregarUsuarios();
  }
  void recarregar();
});
</script>

<style scoped lang="scss">
.auditoria-list__tabela {
  width: 100%;
  cursor: pointer;
}

.auditoria-list__id {
  margin-left: var(--spacing-2);
  color: var(--color-text-secondary);
  font-size: var(--font-size-xs);
}
</style>
