<template>
  <q-page class="agro-page">
    <app-page-header titulo="Notas fiscais" subtitulo="Emissão, eventos e documentos fiscais.">
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Emitir"
        descricao="Emitir CT-e, MDF-e ou NFPR"
        @click="dialogEmitir = true"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <div class="agro-filter-bar q-mb-md row q-col-gutter-md items-end">
          <div class="col-12 col-md-3">
            <q-select
              v-model="filtro.status"
              outlined
              clearable
              emit-value
              map-options
              label="Status"
              :options="StatusNotaFiscalOpcoes"
              @update:model-value="aplicarFiltro"
            />
          </div>
          <div class="col-12 col-md-3">
            <q-select
              v-model="filtro.modelo"
              outlined
              clearable
              emit-value
              map-options
              label="Modelo"
              :options="ModeloDocumentoFiscalOpcoes"
              @update:model-value="aplicarFiltro"
            />
          </div>
          <div class="col-12 col-md-2">
            <q-input
              v-model="filtro.dataInicio"
              outlined
              type="date"
              label="Data início"
              @update:model-value="aplicarFiltro"
            />
          </div>
          <div class="col-12 col-md-2">
            <q-input
              v-model="filtro.dataFim"
              outlined
              type="date"
              label="Data fim"
              @update:model-value="aplicarFiltro"
            />
          </div>
        </div>

        <agro-table-skeleton v-if="carregando && notas.length === 0" :colunas="7" />
        <empty-state
          v-else-if="!carregando && notas.length === 0"
          titulo="Nenhuma nota fiscal"
          descricao="Emita NF-e, NFC-e, CT-e, MDF-e ou NFPR."
          icon="receipt_long"
        />
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="notas"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-valorTotal="props">
            <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.valorTotal) }}</q-td>
          </template>
          <template #body-cell-status="props">
            <q-td :props="props">
              <agro-badge :label="String(props.row.status)" variant="default" />
            </q-td>
          </template>
          <template #body-cell-emitidaEm="props">
            <q-td :props="props">
              {{ props.row.emitidaEm ? formatarData(props.row.emitidaEm) : '—' }}
            </q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props">
              <agro-acoes-menu :mostrar-visualizar="false" :mostrar-editar="false" :mostrar-status="false">
                <q-item v-close-popup clickable dense class="agro-acoes-menu__item" @click="abrirDanfe(props.row.id)">
                  <q-item-section avatar><span class="agro-acoes-menu__icon agro-acoes-menu__icon--edit"><q-icon name="description" size="16px" /></span></q-item-section>
                  <q-item-section>DANFE</q-item-section>
                </q-item>
                <q-item v-close-popup clickable dense class="agro-acoes-menu__item" @click="baixarXml(props.row.id)">
                  <q-item-section avatar><span class="agro-acoes-menu__icon agro-acoes-menu__icon--edit"><q-icon name="code" size="16px" /></span></q-item-section>
                  <q-item-section>XML</q-item-section>
                </q-item>
                <q-item v-close-popup clickable dense class="agro-acoes-menu__item" :disable="props.row.status !== StatusNotaFiscal.Emitida" @click="abrirCce(props.row)">
                  <q-item-section avatar><span class="agro-acoes-menu__icon agro-acoes-menu__icon--edit"><q-icon name="edit_note" size="16px" /></span></q-item-section>
                  <q-item-section>CC-e</q-item-section>
                </q-item>
                <q-item v-close-popup clickable dense class="agro-acoes-menu__item" :disable="props.row.status !== StatusNotaFiscal.Emitida" @click="abrirComplementar(props.row)">
                  <q-item-section avatar><span class="agro-acoes-menu__icon agro-acoes-menu__icon--edit"><q-icon name="add_circle" size="16px" /></span></q-item-section>
                  <q-item-section>Complementar</q-item-section>
                </q-item>
                <q-item v-close-popup clickable dense class="agro-acoes-menu__item" :disable="props.row.status !== StatusNotaFiscal.Emitida" @click="abrirCancelar(props.row)">
                  <q-item-section avatar><span class="agro-acoes-menu__icon agro-acoes-menu__icon--danger"><q-icon name="cancel" size="16px" /></span></q-item-section>
                  <q-item-section>Cancelar</q-item-section>
                </q-item>
              </agro-acoes-menu>
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>

    <cancelar-nota-dialog
      v-model="dialogCancelar"
      :loading="salvando"
      @confirm="onCancelar"
    />
    <cce-nota-dialog v-model="dialogCce" :loading="salvando" @confirm="onCce" />
    <complementar-nota-dialog
      v-model="dialogComplementar"
      :loading="salvando"
      @confirm="onComplementar"
    />
    <emitir-documentos-dialog
      v-model="dialogEmitir"
      :loading="salvando"
      @nfe="onEmitirNfe"
      @nfce="onEmitirNfce"
      @devolucao="onEmitirDevolucao"
      @cte="onEmitirCte"
      @mdfe="onEmitirMdfe"
      @nfpr="onEmitirNfpr"
    />
  </q-page>
</template>

<script setup lang="ts">
import CancelarNotaDialog from 'components/fiscal/CancelarNotaDialog.vue';
import CceNotaDialog from 'components/fiscal/CceNotaDialog.vue';
import ComplementarNotaDialog from 'components/fiscal/ComplementarNotaDialog.vue';
import EmitirDocumentosDialog from 'components/fiscal/EmitirDocumentosDialog.vue';
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useNotasFiscais } from 'composables/useNotasFiscais';
import {
  ModeloDocumentoFiscalOpcoes,
  StatusNotaFiscal,
  StatusNotaFiscalOpcoes,
} from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type {
  CancelarNotaFormModel,
  CceFormModel,
  ComplementarFormModel,
  EmitirCteFormModel,
  EmitirMdfeFormModel,
  EmitirNfprFormModel,
  NotaFiscalGestaoDto,
} from 'types/dtos/fiscal-gestao.dto';
import { formatarData, formatarMoeda } from 'utils/formatters';
import { onMounted, reactive, ref } from 'vue';

const {
  notas,
  carregando,
  salvando,
  carregar,
  emitirNfe,
  emitirNfce,
  emitirDevolucao,
  emitirCte,
  emitirMdfe,
  emitirNfpr,
  cancelar,
  registrarCce,
  complementar,
  abrirDanfe,
  baixarXml,
} = useNotasFiscais();

const filtro = reactive({
  status: null as string | null,
  modelo: null as string | null,
  dataInicio: '',
  dataFim: '',
});

const dialogCancelar = ref(false);
const dialogCce = ref(false);
const dialogComplementar = ref(false);
const dialogEmitir = ref(false);
const notaSelecionada = ref<NotaFiscalGestaoDto | null>(null);

const colunas: QTableColumn<NotaFiscalGestaoDto>[] = [
  { name: 'modeloDocumento', label: 'Modelo', field: 'modeloDocumento', align: 'left' },
  { name: 'numero', label: 'Número', field: 'numero', align: 'left' },
  { name: 'serie', label: 'Série', field: 'serie', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'valorTotal', label: 'Valor', field: 'valorTotal', align: 'right' },
  { name: 'emitidaEm', label: 'Emitida em', field: 'emitidaEm', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

async function aplicarFiltro(): Promise<void> {
  await carregar({
    status: filtro.status ?? undefined,
    modelo: filtro.modelo ?? undefined,
    dataInicio: filtro.dataInicio || undefined,
    dataFim: filtro.dataFim || undefined,
  });
}

function abrirCancelar(nota: NotaFiscalGestaoDto): void {
  notaSelecionada.value = nota;
  dialogCancelar.value = true;
}

function abrirCce(nota: NotaFiscalGestaoDto): void {
  notaSelecionada.value = nota;
  dialogCce.value = true;
}

function abrirComplementar(nota: NotaFiscalGestaoDto): void {
  notaSelecionada.value = nota;
  dialogComplementar.value = true;
}

async function onCancelar(form: CancelarNotaFormModel): Promise<void> {
  if (!notaSelecionada.value) return;
  const ok = await cancelar(notaSelecionada.value.id, form);
  if (ok) dialogCancelar.value = false;
}

async function onCce(form: CceFormModel): Promise<void> {
  if (!notaSelecionada.value) return;
  const ok = await registrarCce(notaSelecionada.value.id, form);
  if (ok) dialogCce.value = false;
}

async function onComplementar(form: ComplementarFormModel): Promise<void> {
  if (!notaSelecionada.value) return;
  const ok = await complementar(notaSelecionada.value.id, form);
  if (ok) dialogComplementar.value = false;
}

async function onEmitirNfe(pedidoId: string): Promise<void> {
  const ok = await emitirNfe(pedidoId);
  if (ok) dialogEmitir.value = false;
}

async function onEmitirNfce(pdvVendaId: string): Promise<void> {
  const ok = await emitirNfce(pdvVendaId);
  if (ok) dialogEmitir.value = false;
}

async function onEmitirDevolucao(devolucaoId: string): Promise<void> {
  const ok = await emitirDevolucao(devolucaoId);
  if (ok) dialogEmitir.value = false;
}

async function onEmitirCte(form: EmitirCteFormModel): Promise<void> {
  const ok = await emitirCte(form);
  if (ok) dialogEmitir.value = false;
}

async function onEmitirMdfe(form: EmitirMdfeFormModel): Promise<void> {
  const ok = await emitirMdfe(form);
  if (ok) dialogEmitir.value = false;
}

async function onEmitirNfpr(form: EmitirNfprFormModel): Promise<void> {
  const ok = await emitirNfpr(form);
  if (ok) dialogEmitir.value = false;
}

onMounted(() => {
  void aplicarFiltro();
});
</script>
