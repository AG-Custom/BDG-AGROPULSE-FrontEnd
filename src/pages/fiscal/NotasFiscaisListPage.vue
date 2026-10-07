<template>
  <q-page class="agro-page">
    <app-page-header titulo="Notas fiscais" subtitulo="Consulta de documentos fiscais." />
    <agro-btn class="q-mb-md" color="primary" label="Emitir nota do pedido" descricao="Selecionar pedido e dados fiscais para emissão" @click="dialogEmissao = true" />
    <emitir-nfe-dialog v-model="dialogEmissao" @emitida="aplicarFiltro" />
    <cancelar-nota-dialog v-model="dialogCancelar" :loading="salvando" @confirm="onCancelar" />

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

        <agro-table-skeleton v-if="carregando && notas.length === 0" :colunas="9" />
        <empty-state
          v-else-if="!carregando && notas.length === 0"
          titulo="Nenhuma nota fiscal"
          descricao="Nenhum documento fiscal encontrado com os filtros atuais."
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
              <nota-fiscal-status-badge :valor="String(props.row.status)" />
            </q-td>
          </template>
          <template #body-cell-tipo="props">
            <q-td :props="props">
              <agro-badge
                :label="props.row.tipo === TipoNotaFiscal.Entrada ? 'Entrada' : 'Saída'"
                :variant="props.row.tipo === TipoNotaFiscal.Entrada ? 'success' : 'info'"
              />
            </q-td>
          </template>
          <template #body-cell-emitidaEm="props">
            <q-td :props="props">
              {{ props.row.emitidaEm ? formatarData(props.row.emitidaEm) : '—' }}
            </q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props">
              <agro-acoes-menu :mostrar-editar="false" :mostrar-status="false" @visualizar="abrirDialogVisualizar(props.row)">
                <q-item v-if="props.row.homologacao != null" v-close-popup clickable @click="consultarFocus(props.row.id)"><q-item-section>Consultar na Focus</q-item-section></q-item>
                <q-item v-if="props.row.homologacao != null" v-close-popup clickable @click="abrirDanfe(props.row.id, String(props.row.modeloDocumento))"><q-item-section>{{ props.row.modeloDocumento === 'NFCe' ? 'DANFCe oficial (HTML)' : 'DANFE oficial (PDF)' }}</q-item-section></q-item>
                <q-item v-if="props.row.homologacao != null && props.row.status === 'Emitida'" v-close-popup clickable @click="notaSelecionada = props.row; dialogCancelar = true"><q-item-section>{{ props.row.modeloDocumento === 'NFCe' ? 'Cancelar NFC-e' : 'Cancelar NF-e' }}</q-item-section></q-item>
                <q-item v-close-popup clickable dense class="agro-acoes-menu__item" @click="baixarXml(props.row.id)">
                  <q-item-section avatar><span class="agro-acoes-menu__icon agro-acoes-menu__icon--edit"><q-icon name="code" size="16px" /></span></q-item-section>
                  <q-item-section>XML</q-item-section>
                </q-item>
                <q-item v-if="props.row.modeloDocumento === 'NFe' && props.row.homologacao != null && props.row.status === StatusNotaFiscal.Emitida" v-close-popup clickable dense class="agro-acoes-menu__item" @click="abrirCce(props.row)">
                  <q-item-section avatar><span class="agro-acoes-menu__icon agro-acoes-menu__icon--edit"><q-icon name="edit_note" size="16px" /></span></q-item-section>
                  <q-item-section>CC-e</q-item-section>
                </q-item>
              </agro-acoes-menu>
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>

    <cce-nota-dialog v-model="dialogCce" :loading="salvando" @confirm="onCce" />

    <nota-fiscal-visualizar-dialog v-model="dialogVisualizar" :nota="notaVisualizar" />
  </q-page>
</template>

<script setup lang="ts">
import EmitirNfeDialog from 'components/fiscal/EmitirNfeDialog.vue';
import CancelarNotaDialog from 'components/fiscal/CancelarNotaDialog.vue';
import NotaFiscalVisualizarDialog from 'components/fiscal/NotaFiscalVisualizarDialog.vue';
import { fiscalGestaoService } from 'services/fiscal-gestao.service';
import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import type { CancelarNotaFormModel } from 'types/dtos/fiscal-gestao.dto';
import CceNotaDialog from 'components/fiscal/CceNotaDialog.vue';
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroBadge from 'components/ui/AgroBadge.vue';
import NotaFiscalStatusBadge from 'components/fiscal/NotaFiscalStatusBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useNotasFiscais } from 'composables/useNotasFiscais';
import {
  ModeloDocumentoFiscalOpcoes,
  StatusNotaFiscal,
  StatusNotaFiscalOpcoes,
  TipoNotaFiscal,
} from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type {
  CceFormModel,
  NotaFiscalGestaoDto,
} from 'types/dtos/fiscal-gestao.dto';
import { formatarData, formatarMoeda } from 'utils/formatters';
import { onMounted, reactive, ref } from 'vue';

const {
  notas,
  carregando,
  salvando,
  carregar,
  registrarCce,
  baixarXml,
  abrirDanfe,
  cancelar,
} = useNotasFiscais();
const dialogEmissao = ref(false);
const dialogCancelar = ref(false);
const { erro } = useNotificacao();
const { mensagem } = useTratarErroFormulario();
async function consultarFocus(id: string): Promise<void> {
  try { notaVisualizar.value = await fiscalGestaoService.consultarFocus(id); dialogVisualizar.value = true; await aplicarFiltro(); }
  catch (e) { erro(mensagem(e)); }
}
async function onCancelar(form: CancelarNotaFormModel): Promise<void> {
  if (notaSelecionada.value && await cancelar(notaSelecionada.value.id, form)) dialogCancelar.value = false;
}

const filtro = reactive({
  status: null as string | null,
  modelo: null as string | null,
  dataInicio: '',
  dataFim: '',
});

const dialogCce = ref(false);
const dialogVisualizar = ref(false);
const notaSelecionada = ref<NotaFiscalGestaoDto | null>(null);
const notaVisualizar = ref<NotaFiscalGestaoDto | null>(null);

const colunas: QTableColumn<NotaFiscalGestaoDto>[] = [
  { name: 'modeloDocumento', label: 'Modelo', field: 'modeloDocumento', align: 'left' },
  { name: 'numero', label: 'Número', field: 'numero', align: 'left' },
  { name: 'serie', label: 'Série', field: 'serie', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'left' },
  { name: 'ambiente', label: 'Ambiente', field: row => row.homologacao == null ? 'Legado' : row.homologacao ? 'Homologação' : 'Produção', align: 'left' },
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

function abrirCce(nota: NotaFiscalGestaoDto): void {
  notaSelecionada.value = nota;
  dialogCce.value = true;
}

async function onCce(form: CceFormModel): Promise<void> {
  if (!notaSelecionada.value) return;
  const ok = await registrarCce(notaSelecionada.value.id, form);
  if (ok) dialogCce.value = false;
}

onMounted(() => {
  void aplicarFiltro();
});

function abrirDialogVisualizar(item: NotaFiscalGestaoDto): void {
  notaVisualizar.value = item;
  dialogVisualizar.value = true;
}
</script>
