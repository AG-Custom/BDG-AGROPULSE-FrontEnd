<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Galpões"
      subtitulo="Cadastre os galpões usados de forma opcional no produto."
    >
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Novo galpão"
        descricao="Cadastrar um novo galpão"
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
            class="galpoes-list__busca"
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
            :options="opcoesStatus"
            class="galpoes-list__status"
          />
        </div>

        <agro-table-skeleton v-if="carregando && galpoes.length === 0" :colunas="3" />

        <empty-state
          v-else-if="!carregando && galpoes.length === 0"
          titulo="Nenhum galpão encontrado"
          :descricao="descricaoVazia"
          icon="warehouse"
        >
          <agro-btn
            v-if="!busca && filtroAtivo === 'ativos'"
            color="primary"
            unelevated
            label="Cadastrar galpão"
            descricao="Cadastrar um novo galpão"
            @click="abrirDialog()"
          />
        </empty-state>

        <q-table
          v-else
          flat
          bordered
          row-key="id"
          class="galpoes-list__tabela"
          :rows="galpoes"
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
            <q-td :props="props" class="galpoes-list__acoes">
              <agro-acoes-menu
                :ativo="props.row.ativo"
                :pode-editar="props.row.ativo"
                :loading-status="inativando || ativando"
                @editar="abrirDialog(props.row)"
                @visualizar="abrirDialogVisualizar(props.row)"
                @desabilitar="inativarGalpao(props.row)"
                @ativar="ativarGalpao(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>

    <q-dialog v-model="dialogAberto" persistent>
      <q-card class="galpoes-list__dialog">
        <q-card-section>
          <h4 class="galpoes-list__dialog-titulo">{{ tituloDialog }}</h4>
        </q-card-section>

        <q-card-section>
          <q-banner v-if="galpaoInativo" rounded class="galpoes-list__aviso">
            Este galpão está inativo e não pode ser editado.
          </q-banner>

          <galpao-formulario
            ref="formularioRef"
            v-model:formulario="formulario"
            :somente-leitura="somenteLeitura || galpaoInativo"
          />
        </q-card-section>

        <q-card-actions align="right">
          <template v-if="somenteLeitura || galpaoInativo">
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
              :descricao="editandoId ? 'Salvar alterações do galpão' : 'Cadastrar novo galpão'"
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
import GalpaoFormulario from 'components/galpoes/GalpaoFormulario.vue';
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useGalpoes } from 'composables/useGalpoes';
import type { QTableColumn } from 'quasar';
import type { GalpaoFormModel, GalpaoResumoDto, ListarGalpoesParams } from 'types/dtos/galpao.dto';
import { criarGalpaoFormVazio, galpaoDtoParaForm } from 'utils/mappers/galpao.mapper';
import { computed, onMounted, ref, watch } from 'vue';

const {
  galpoes,
  carregando,
  salvando,
  inativando,
  ativando,
  carregar,
  criar,
  editar,
  solicitarInativacao,
  solicitarAtivacao,
} = useGalpoes();

const busca = ref('');
const filtroAtivo = ref<'ativos' | 'inativos' | 'todos'>('ativos');
const dialogAberto = ref(false);
const somenteLeitura = ref(false);
const editandoId = ref<string | null>(null);
const galpaoAtivo = ref(true);
const formularioRef = ref<InstanceType<typeof GalpaoFormulario> | null>(null);
const formulario = ref<GalpaoFormModel>(criarGalpaoFormVazio());

const opcoesStatus = [
  { label: 'Ativos', value: 'ativos' },
  { label: 'Inativos', value: 'inativos' },
  { label: 'Todos', value: 'todos' },
];

const galpaoInativo = computed(() => !!editandoId.value && !galpaoAtivo.value && !somenteLeitura.value);

const tituloDialog = computed(() => {
  if (somenteLeitura.value) {
    return 'Visualizar galpão';
  }

  return editandoId.value ? 'Editar galpão' : 'Novo galpão';
});

const colunas: QTableColumn<GalpaoResumoDto>[] = [
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left', sortable: true },
  { name: 'ativo', label: 'Status', field: 'ativo', align: 'left', sortable: true },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

const descricaoVazia = computed(() => {
  if (busca.value || filtroAtivo.value !== 'ativos') {
    return 'Nenhum galpão corresponde aos filtros aplicados.';
  }

  return 'Cadastre galpões para vinculá-los opcionalmente aos produtos.';
});

function montarParams(): ListarGalpoesParams {
  const params: ListarGalpoesParams = {};

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

function abrirDialog(item?: GalpaoResumoDto): void {
  somenteLeitura.value = false;
  editandoId.value = item?.id ?? null;
  galpaoAtivo.value = item?.ativo ?? true;
  formulario.value = item ? galpaoDtoParaForm(item) : criarGalpaoFormVazio();
  dialogAberto.value = true;
}

function abrirDialogVisualizar(item: GalpaoResumoDto): void {
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

async function inativarGalpao(galpao: GalpaoResumoDto): Promise<void> {
  await solicitarInativacao(galpao);
}

async function ativarGalpao(galpao: GalpaoResumoDto): Promise<void> {
  await solicitarAtivacao(galpao);
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
.galpoes-list__busca {
  flex: 1;
  min-width: 240px;
}

.galpoes-list__status {
  min-width: 160px;
}

.galpoes-list__acoes {
  white-space: nowrap;
}

.galpoes-list__dialog {
  min-width: min(480px, 94vw);
  max-width: 560px;
}

.galpoes-list__dialog-titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}

.galpoes-list__aviso {
  background: var(--color-warning-50);
  color: var(--color-warning-700);
  margin-bottom: var(--spacing-4);
}
</style>
