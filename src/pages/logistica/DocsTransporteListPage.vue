<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Documentos de transporte"
      subtitulo="CT-e e MDF-e (autorização stub SEFAZ)."
    >
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Novo doc"
        descricao="Criar documento"
        @click="abrirCriar"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <div class="agro-filter-bar">
          <q-select
            v-model="filtroTipo"
            outlined
            dense
            label="Tipo"
            emit-value
            map-options
            clearable
            :options="TipoDocTransporteLogisticaOpcoes"
            class="filtro"
          />
          <q-select
            v-model="filtroStatus"
            outlined
            dense
            label="Status"
            emit-value
            map-options
            clearable
            :options="StatusDocTransporteLogisticaOpcoes"
            class="filtro"
          />
          <agro-btn
            color="primary"
            unelevated
            label="Filtrar"
            descricao="Aplicar filtros"
            :loading="carregando"
            @click="aplicar"
          />
        </div>

        <agro-table-skeleton v-if="carregando && docsTransporte.length === 0" :colunas="6" />
        <empty-state
          v-else-if="!carregando && docsTransporte.length === 0"
          titulo="Nenhum documento"
          descricao="Crie o primeiro CT-e ou MDF-e."
          icon="description"
        >
          <agro-btn color="primary" unelevated label="Novo doc" descricao="Criar" @click="abrirCriar" />
        </empty-state>
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="docsTransporte"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-dataEmissao="props">
            <q-td :props="props">{{ formatarData(props.row.dataEmissao) }}</q-td>
          </template>
          <template #body-cell-valor="props">
            <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.valor) }}</q-td>
          </template>
          <template #body-cell-status="props">
            <q-td :props="props">
              <logistica-status-badge :valor="props.row.status" />
            </q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props">
              <agro-acoes-menu :mostrar-visualizar="false" :mostrar-editar="false" :mostrar-status="false">
                <q-item
                v-if="props.row.status === StatusDocTransporteLogistica.Rascunho"
                  v-close-popup
                  clickable
                dense
                  class="agro-acoes-menu__item"
                  :disable="salvando"
                @click="autorizarDocTransporte(props.row.id)"
                >
                  <q-item-section avatar><span class="agro-acoes-menu__icon agro-acoes-menu__icon--success"><q-icon name="check_circle" size="16px" /></span></q-item-section>
                  <q-item-section>Autorizar</q-item-section>
                  <q-item-section v-if="salvando" side><q-spinner size="16px" color="primary" /></q-item-section>
                </q-item>
                <q-item
                v-if="props.row.status !== StatusDocTransporteLogistica.Cancelado"
                  v-close-popup
                  clickable
                dense
                  class="agro-acoes-menu__item"
                  :disable="salvando"
                @click="cancelarDocTransporte(props.row.id)"
                >
                  <q-item-section avatar><span class="agro-acoes-menu__icon agro-acoes-menu__icon--danger"><q-icon name="cancel" size="16px" /></span></q-item-section>
                  <q-item-section>Cancelar</q-item-section>
                  <q-item-section v-if="salvando" side><q-spinner size="16px" color="primary" /></q-item-section>
                </q-item>
              </agro-acoes-menu>
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>

    <q-dialog v-model="dialogCriar" persistent>
      <q-card class="dialog-card">
        <q-card-section>
          <div class="text-h6">Novo documento</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-form greedy @submit.prevent="salvar">
            <div class="row q-col-gutter-md">
              <div class="col-6">
                <q-select
                  v-model="formulario.tipo"
                  outlined
                  label="Tipo"
                  emit-value
                  map-options
                  class="field-required"
                  :options="TipoDocTransporteLogisticaOpcoes"
                  :rules="[obrigatorio]"
                />
              </div>
              <div class="col-3">
                <q-input
                  v-model="formulario.numero"
                  outlined
                  label="Número"
                  class="field-required"
                  :rules="[obrigatorio]"
                />
              </div>
              <div class="col-3">
                <q-input
                  v-model="formulario.serie"
                  outlined
                  label="Série"
                  class="field-required"
                  :rules="[obrigatorio]"
                />
              </div>
              <div class="col-12">
                <q-input
                  v-model="formulario.tomador"
                  outlined
                  label="Tomador"
                  class="field-required"
                  :rules="[obrigatorio]"
                />
              </div>
              <div class="col-3">
                <q-input
                  v-model="formulario.ufIni"
                  outlined
                  label="UF ini"
                  maxlength="2"
                  class="field-required"
                  :rules="[obrigatorio]"
                />
              </div>
              <div class="col-3">
                <q-input
                  v-model="formulario.ufFim"
                  outlined
                  label="UF fim"
                  maxlength="2"
                  class="field-required"
                  :rules="[obrigatorio]"
                />
              </div>
              <div class="col-3">
                <AgroMoneyInput
                  v-model="formulario.valor"
                  label="Valor"
                  class="field-required"
                  :rules="[obrigatorio]"
                />
              </div>
              <div class="col-3">
                <q-input
                  v-model="formulario.dataEmissao"
                  outlined
                  label="Emissão"
                  type="date"
                  class="field-required"
                  :rules="[obrigatorio]"
                />
              </div>
              <div class="col-8">
                <q-input v-model="formulario.chave" outlined label="Chave" />
              </div>
              <div class="col-4">
                <q-input v-model="formulario.pesoKg" outlined label="Peso (kg)" type="number" />
              </div>
            </div>
            <div class="agro-form-actions">
              <agro-btn flat label="Cancelar" descricao="Fechar" @click="dialogCriar = false" />
              <agro-btn
                color="primary"
                unelevated
                label="Criar"
                descricao="Salvar documento"
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
import LogisticaStatusBadge from 'components/logistica/LogisticaStatusBadge.vue';
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroMoneyInput from 'components/ui/AgroMoneyInput.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { docTransporteVazio, useLogistica } from 'composables/useLogistica';
import {
  StatusDocTransporteLogistica,
  StatusDocTransporteLogisticaOpcoes,
  TipoDocTransporteLogisticaOpcoes,
} from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type {
  DocTransporteLogisticaDto,
  DocTransporteLogisticaFormModel,
} from 'types/dtos/logistica.dto';
import { formatarData, formatarMoeda } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { onMounted, ref } from 'vue';

const {
  docsTransporte,
  carregando,
  salvando,
  carregarDocsTransporte,
  criarDocTransporte,
  autorizarDocTransporte,
  cancelarDocTransporte,
} = useLogistica();

const filtroTipo = ref<string | null>(null);
const filtroStatus = ref<string | null>(null);
const dialogCriar = ref(false);
const formulario = ref<DocTransporteLogisticaFormModel>(docTransporteVazio());

const colunas: QTableColumn<DocTransporteLogisticaDto>[] = [
  { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'left' },
  { name: 'numero', label: 'Número', field: 'numero', align: 'left', sortable: true },
  { name: 'serie', label: 'Série', field: 'serie', align: 'left' },
  { name: 'tomador', label: 'Tomador', field: 'tomador', align: 'left' },
  {
    name: 'uf',
    label: 'UF',
    field: (r) => `${r.ufIni} → ${r.ufFim}`,
    align: 'left',
  },
  { name: 'dataEmissao', label: 'Emissão', field: 'dataEmissao', align: 'left' },
  { name: 'valor', label: 'Valor', field: 'valor', align: 'right' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function aplicar(): void {
  void carregarDocsTransporte({
    tipo: (filtroTipo.value as '' | undefined) || undefined,
    status: (filtroStatus.value as '' | undefined) || undefined,
  });
}

function abrirCriar(): void {
  formulario.value = docTransporteVazio();
  dialogCriar.value = true;
}

async function salvar(): Promise<void> {
  const criado = await criarDocTransporte(formulario.value);
  if (criado) {
    dialogCriar.value = false;
    aplicar();
  }
}

onMounted(aplicar);
</script>

<style scoped>
.filtro {
  min-width: 160px;
}
.dialog-card {
  min-width: min(560px, 94vw);
  background: var(--color-surface-default);
}
</style>
