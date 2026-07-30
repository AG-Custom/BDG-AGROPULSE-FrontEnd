<template>
  <q-page class="agro-page">
    <app-page-header titulo="Talhões" subtitulo="Cadastro de áreas para rastreabilidade.">
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Novo talhão"
        descricao="Cadastrar talhão"
        @click="abrirDialog()"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <agro-table-skeleton v-if="carregando && talhoes.length === 0" :colunas="4" />
        <empty-state
          v-else-if="!carregando && talhoes.length === 0"
          titulo="Nenhum talhão"
          descricao="Cadastre o primeiro talhão."
          icon="grass"
        >
          <agro-btn
            color="primary"
            unelevated
            label="Novo talhão"
            descricao="Cadastrar"
            @click="abrirDialog()"
          />
        </empty-state>
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="talhoes"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-areaHectares="props">
            <q-td :props="props" class="text-metric">
              {{ props.row.areaHectares != null ? formatarDecimal(props.row.areaHectares) : '—' }}
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
            <q-td :props="props" class="acoes">
              <agro-acoes-menu
                :ativo="props.row.ativo"
                :mostrar-status="props.row.ativo"
                :pode-editar="props.row.ativo"
                :loading-status="salvando"
                @editar="abrirDialog(props.row)"
                @visualizar="abrirDialogVisualizar(props.row)"
                @desabilitar="onInativar(props.row.id)"
              />
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>

    <q-dialog v-model="dialogAberto" persistent>
      <q-card class="dialog">
        <q-card-section>
          <h4 class="titulo">{{ tituloDialog }}</h4>
        </q-card-section>
        <q-card-section>
          <q-form
            greedy
            class="agro-formulario"
            :class="{ 'agro-formulario--bloqueado': somenteLeitura }"
            @submit.prevent="salvar"
          >
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-input
                  v-model="formulario.nome"
                  outlined
                  label="Nome"
                  class="field-required"
                  :rules="[obrigatorio]"
                  :readonly="somenteLeitura"
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="formulario.areaHectares"
                  outlined
                  label="Área (hectares)"
                  type="number"
                  step="0.01"
                  :readonly="somenteLeitura"
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-select
                  v-model="formulario.glebaId"
                  outlined
                  label="Gleba"
                  clearable
                  emit-value
                  map-options
                  :options="glebaOpcoes"
                  :readonly="somenteLeitura"
                />
              </div>
              <div class="col-12">
                <q-input
                  v-model="formulario.culturaAtual"
                  outlined
                  label="Cultura atual"
                  :readonly="somenteLeitura"
                />
              </div>
              <div class="col-12">
                <q-input
                  v-model="formulario.coordenadas"
                  outlined
                  label="Coordenadas (WKT / GeoJSON)"
                  type="textarea"
                  autogrow
                  :readonly="somenteLeitura"
                />
              </div>
            </div>
            <div class="agro-form-actions">
              <template v-if="somenteLeitura">
                <agro-btn flat label="Fechar" descricao="Fechar" @click="fecharDialog" />
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
                  :label="editandoId ? 'Salvar' : 'Criar'"
                  type="submit"
                  :loading="salvando"
                />
              </template>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useGlebas } from 'composables/useGlebas';
import { useRastreabilidade } from 'composables/useRastreabilidade';
import type { QTableColumn } from 'quasar';
import type { TalhaoDto, TalhaoFormModel } from 'types/dtos/rastreabilidade.dto';
import { formatarDecimal } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';

const { talhoes, carregando, salvando, carregarTalhoes, criarTalhao, editarTalhao, inativarTalhao } =
  useRastreabilidade();
const { glebaOpcoes, carregar: carregarGlebas } = useGlebas();

const dialogAberto = ref(false);
const somenteLeitura = ref(false);
const editandoId = ref<string | null>(null);
const formulario = ref<TalhaoFormModel>(formVazio());

const tituloDialog = computed(() => {
  if (somenteLeitura.value) {
    return 'Visualizar talhão';
  }
  return editandoId.value ? 'Editar talhão' : 'Novo talhão';
});

const colunas: QTableColumn<TalhaoDto>[] = [
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left', sortable: true },
  { name: 'culturaAtual', label: 'Cultura', field: 'culturaAtual', align: 'left' },
  { name: 'areaHectares', label: 'Área (ha)', field: 'areaHectares', align: 'right' },
  { name: 'ativo', label: 'Status', field: 'ativo', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function formVazio(): TalhaoFormModel {
  return {
    nome: '',
    areaHectares: '',
    glebaId: '',
    coordenadas: '',
    culturaAtual: '',
  };
}

function dtoParaForm(item: TalhaoDto): TalhaoFormModel {
  return {
    nome: item.nome,
    areaHectares: item.areaHectares != null ? String(item.areaHectares) : '',
    glebaId: item.glebaId ?? '',
    coordenadas: item.coordenadas ?? '',
    culturaAtual: item.culturaAtual ?? '',
  };
}

function abrirDialog(item?: TalhaoDto): void {
  somenteLeitura.value = false;
  editandoId.value = item?.id ?? null;
  formulario.value = item ? dtoParaForm(item) : formVazio();
  dialogAberto.value = true;
}

function abrirDialogVisualizar(item: TalhaoDto): void {
  abrirDialog(item);
  somenteLeitura.value = true;
}

function fecharDialog(): void {
  dialogAberto.value = false;
}

async function salvar(): Promise<void> {
  if (somenteLeitura.value) {
    return;
  }

  const ok = editandoId.value
    ? await editarTalhao(editandoId.value, formulario.value)
    : await criarTalhao(formulario.value);

  if (ok) {
    fecharDialog();
    await carregarTalhoes();
  }
}

async function onInativar(id: string): Promise<void> {
  const ok = await inativarTalhao(id);
  if (ok) await carregarTalhoes();
}

onMounted(() => {
  void carregarTalhoes();
  void carregarGlebas();
});
</script>

<style scoped>
.acoes {
  white-space: nowrap;
}

.dialog {
  min-width: min(480px, 94vw);
  max-width: 560px;
}

.titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
</style>
