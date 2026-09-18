<template>
  <q-page class="agro-page">
    <app-page-header titulo="Notas fiscais" subtitulo="Consulta de documentos fiscais." />
    <agro-btn class="q-mb-md" color="primary" label="Emitir NF-e de pedido" descricao="Selecionar pedido e dados fiscais para emissão" @click="dialogEmissao = true" />
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

        <agro-table-skeleton v-if="carregando && notas.length === 0" :colunas="7" />
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
              <agro-acoes-menu :mostrar-editar="false" :mostrar-status="false" @visualizar="abrirDialogVisualizar(props.row)">
                <q-item v-if="props.row.homologacao != null" v-close-popup clickable @click="consultarFocus(props.row.id)"><q-item-section>Consultar na Focus</q-item-section></q-item>
                <q-item v-if="props.row.homologacao != null" v-close-popup clickable @click="abrirDanfe(props.row.id)"><q-item-section>DANFE oficial (PDF)</q-item-section></q-item>
                <q-item v-if="props.row.homologacao != null && props.row.status === 'Emitida'" v-close-popup clickable @click="notaSelecionada = props.row; dialogCancelar = true"><q-item-section>Cancelar NF-e</q-item-section></q-item>
                <q-item v-close-popup clickable dense class="agro-acoes-menu__item" @click="baixarXml(props.row.id)">
                  <q-item-section avatar><span class="agro-acoes-menu__icon agro-acoes-menu__icon--edit"><q-icon name="code" size="16px" /></span></q-item-section>
                  <q-item-section>XML</q-item-section>
                </q-item>
                <q-item v-if="props.row.modeloDocumento !== 'NFe'" v-close-popup clickable dense class="agro-acoes-menu__item" :disable="props.row.status !== StatusNotaFiscal.Emitida" @click="abrirCce(props.row)">
                  <q-item-section avatar><span class="agro-acoes-menu__icon agro-acoes-menu__icon--edit"><q-icon name="edit_note" size="16px" /></span></q-item-section>
                  <q-item-section>CC-e</q-item-section>
                </q-item>
                <q-item v-if="props.row.modeloDocumento !== 'NFe'" v-close-popup clickable dense class="agro-acoes-menu__item" :disable="props.row.status !== StatusNotaFiscal.Emitida" @click="abrirComplementar(props.row)">
                  <q-item-section avatar><span class="agro-acoes-menu__icon agro-acoes-menu__icon--edit"><q-icon name="add_circle" size="16px" /></span></q-item-section>
                  <q-item-section>Complementar</q-item-section>
                </q-item>
              </agro-acoes-menu>
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>

    <cce-nota-dialog v-model="dialogCce" :loading="salvando" @confirm="onCce" />
    <complementar-nota-dialog
      v-model="dialogComplementar"
      :loading="salvando"
      @confirm="onComplementar"
    />

    <q-dialog v-model="dialogVisualizar">
      <q-card class="dialog-visualizar">
        <q-card-section>
          <h4 class="titulo">Visualizar nota fiscal</h4>
        </q-card-section>
        <q-card-section>
          <q-form class="agro-formulario agro-formulario--bloqueado">
            <q-banner v-if="notaVisualizar?.mensagemErro" class="bg-orange-1 q-mb-md">{{ notaVisualizar.codigoSefaz }} {{ notaVisualizar.mensagemErro }}</q-banner>
            <p v-if="notaVisualizar?.homologacao != null">Ambiente: {{ notaVisualizar.homologacao ? 'Homologação' : 'Produção' }}. Protocolo: {{ notaVisualizar.protocoloAutorizacao ?? 'Aguardando autorização' }}</p>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-input
                  :model-value="notaVisualizar ? String(notaVisualizar.modeloDocumento) : ''"
                  outlined
                  label="Modelo"
                  readonly
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  :model-value="notaVisualizar?.numero ?? ''"
                  outlined
                  label="Número"
                  readonly
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  :model-value="notaVisualizar?.serie ?? ''"
                  outlined
                  label="Série"
                  readonly
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  :model-value="notaVisualizar ? String(notaVisualizar.status) : ''"
                  outlined
                  label="Status"
                  readonly
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  :model-value="notaVisualizar ? formatarMoeda(notaVisualizar.valorTotal) : ''"
                  outlined
                  label="Valor total"
                  readonly
                  input-class="text-metric"
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  :model-value="
                    notaVisualizar?.emitidaEm ? formatarData(notaVisualizar.emitidaEm) : '—'
                  "
                  outlined
                  label="Emitida em"
                  readonly
                />
              </div>
              <div class="col-12">
                <q-input
                  :model-value="notaVisualizar?.chaveAcesso ?? ''"
                  outlined
                  label="Chave de acesso"
                  readonly
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  :model-value="notaVisualizar?.naturezaOperacao ?? ''"
                  outlined
                  label="Natureza da operação"
                  readonly
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  :model-value="notaVisualizar?.cfop ?? ''"
                  outlined
                  label="CFOP"
                  readonly
                />
              </div>
            </div>
            <div class="agro-form-actions">
              <agro-btn flat label="Fechar" descricao="Fechar" @click="dialogVisualizar = false" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import EmitirNfeDialog from 'components/fiscal/EmitirNfeDialog.vue';
import CancelarNotaDialog from 'components/fiscal/CancelarNotaDialog.vue';
import { fiscalGestaoService } from 'services/fiscal-gestao.service';
import { useNotificacao } from 'composables/useNotificacao';
import { useTratarErroFormulario } from 'composables/useTratarErroFormulario';
import type { CancelarNotaFormModel } from 'types/dtos/fiscal-gestao.dto';
import CceNotaDialog from 'components/fiscal/CceNotaDialog.vue';
import ComplementarNotaDialog from 'components/fiscal/ComplementarNotaDialog.vue';
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
  CceFormModel,
  ComplementarFormModel,
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
  complementar,
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
const dialogComplementar = ref(false);
const dialogVisualizar = ref(false);
const notaSelecionada = ref<NotaFiscalGestaoDto | null>(null);
const notaVisualizar = ref<NotaFiscalGestaoDto | null>(null);

const colunas: QTableColumn<NotaFiscalGestaoDto>[] = [
  { name: 'modeloDocumento', label: 'Modelo', field: 'modeloDocumento', align: 'left' },
  { name: 'numero', label: 'Número', field: 'numero', align: 'left' },
  { name: 'serie', label: 'Série', field: 'serie', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
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

function abrirComplementar(nota: NotaFiscalGestaoDto): void {
  notaSelecionada.value = nota;
  dialogComplementar.value = true;
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

onMounted(() => {
  void aplicarFiltro();
});

function abrirDialogVisualizar(item: NotaFiscalGestaoDto): void {
  notaVisualizar.value = item;
  dialogVisualizar.value = true;
}
</script>

<style scoped>
.dialog-visualizar {
  min-width: min(560px, 94vw);
}
.titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
</style>
