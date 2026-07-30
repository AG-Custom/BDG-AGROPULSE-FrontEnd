<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Campanhas"
      subtitulo="Relacionamento e comunicação com produtores."
    >
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Nova campanha"
        descricao="Cadastrar campanha"
        @click="abrirDialog()"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <agro-table-skeleton v-if="carregando && campanhas.length === 0" :colunas="5" />
        <empty-state
          v-else-if="!carregando && campanhas.length === 0"
          titulo="Nenhuma campanha"
          descricao="Cadastre a primeira campanha de relacionamento."
          icon="campaign"
        >
          <agro-btn
            color="primary"
            unelevated
            label="Nova campanha"
            descricao="Cadastrar"
            @click="abrirDialog()"
          />
        </empty-state>
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="campanhas"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-tipoCanal="props">
            <q-td :props="props">{{ rotuloCanal(props.row.tipoCanal) }}</q-td>
          </template>
          <template #body-cell-status="props">
            <q-td :props="props">{{ rotuloStatus(props.row.status) }}</q-td>
          </template>
          <template #body-cell-envios="props">
            <q-td :props="props" class="text-metric">{{ props.row.envios }}</q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props" class="acoes">
              <agro-acoes-menu
                :ativo="true"
                :mostrar-status="false"
                :mostrar-excluir="true"
                excluir-label="Remover"
                :loading-excluir="salvando"
                @editar="abrirDialog(props.row)"
                @excluir="removerCampanha(props.row.id)"
               :visualizar-to="{ name: 'crm-campanha-detalhe', params: { id: props.row.id } }"
              />
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>

    <q-dialog v-model="dialog" persistent>
      <q-card class="dialog">
        <q-card-section>
          <h4 class="titulo">{{ editandoId ? 'Editar campanha' : 'Nova campanha' }}</h4>
        </q-card-section>
        <q-card-section>
          <q-form greedy class="agro-formulario" @submit.prevent="salvar">
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-input
                  v-model="formulario.nome"
                  outlined
                  label="Nome"
                  class="field-required"
                  :rules="[obrigatorio]"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="formulario.tipoCanal"
                  outlined
                  label="Canal"
                  emit-value
                  map-options
                  :options="TipoCanalCampanhaOpcoes"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="formulario.status"
                  outlined
                  label="Status"
                  emit-value
                  map-options
                  :options="StatusCampanhaOpcoes"
                />
              </div>
              <div class="col-12">
                <q-input v-model="formulario.segmento" outlined label="Segmento" />
              </div>
              <div class="col-6">
                <q-input
                  v-model="formulario.dataInicio"
                  outlined
                  label="Início"
                  type="date"
                />
              </div>
              <div class="col-6">
                <q-input v-model="formulario.dataFim" outlined label="Fim" type="date" />
              </div>
            </div>
            <div class="agro-form-actions">
              <agro-btn flat label="Cancelar" descricao="Fechar" @click="dialog = false" />
              <agro-btn
                color="primary"
                unelevated
                label="Salvar"
                type="submit"
                :loading="salvando"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import {
  campanhaDtoParaForm,
  campanhaVazia,
  useCrm,
} from 'composables/useCrm';
import { StatusCampanhaOpcoes, TipoCanalCampanhaOpcoes } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { CampanhaDto, CampanhaFormModel } from 'types/dtos/crm.dto';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';



const {
  campanhas,
  carregando,
  salvando,
  carregarCampanhas,
  criarCampanha,
  editarCampanha,
  removerCampanha,
} = useCrm();

const dialog = ref(false);
const editandoId = ref<string | null>(null);
const formulario = ref<CampanhaFormModel>(campanhaVazia());

const mapaCanal = computed(() => {
  const m = new Map<string, string>();
  for (const o of TipoCanalCampanhaOpcoes) m.set(o.value, o.label);
  return m;
});

const mapaStatus = computed(() => {
  const m = new Map<string, string>();
  for (const o of StatusCampanhaOpcoes) m.set(o.value, o.label);
  return m;
});

const colunas: QTableColumn<CampanhaDto>[] = [
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left', sortable: true },
  { name: 'tipoCanal', label: 'Canal', field: 'tipoCanal', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'envios', label: 'Envios', field: 'envios', align: 'right' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function rotuloCanal(canal: string): string {
  return mapaCanal.value.get(canal) ?? canal;
}

function rotuloStatus(status: string): string {
  return mapaStatus.value.get(status) ?? status;
}

function abrirDialog(item?: CampanhaDto): void {
  editandoId.value = item?.id ?? null;
  formulario.value = item ? campanhaDtoParaForm(item) : campanhaVazia();
  dialog.value = true;
}

async function salvar(): Promise<void> {
  const ok = editandoId.value
    ? await editarCampanha(editandoId.value, formulario.value)
    : await criarCampanha(formulario.value);
  if (ok) {
    dialog.value = false;
    await carregarCampanhas();
  }
}

onMounted(() => {
  void carregarCampanhas();
});

</script>

<style scoped>
.dialog {
  min-width: min(560px, 94vw);
}
.titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
.acoes {
  white-space: nowrap;
}
</style>
