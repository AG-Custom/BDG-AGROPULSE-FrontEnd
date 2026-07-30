<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Visitas técnicas"
      subtitulo="Registro de visitas ao produtor (revenda)."
    >
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Nova visita"
        descricao="Registrar visita"
        @click="abrirDialog()"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <agro-table-skeleton v-if="carregando && visitas.length === 0" :colunas="6" />
        <empty-state
          v-else-if="!carregando && visitas.length === 0"
          titulo="Nenhuma visita"
          descricao="Registre a primeira visita técnica."
          icon="support_agent"
        />
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="visitas"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-dataVisita="props">
            <q-td :props="props">{{ formatarData(props.row.dataVisita) }}</q-td>
          </template>
          <template #body-cell-tipo="props">
            <q-td :props="props">{{ rotuloTipo(props.row.tipo) }}</q-td>
          </template>
          <template #body-cell-status="props">
            <q-td :props="props">{{ rotuloStatus(props.row.status) }}</q-td>
          </template>
          <template #body-cell-fazendaId="props">
            <q-td :props="props">{{ rotuloFazenda(props.row.fazendaId) }}</q-td>
          </template>
          <template #body-cell-checkinEm="props">
            <q-td :props="props">
              {{ props.row.checkinEm ? formatarDataHora(props.row.checkinEm) : '—' }}
            </q-td>
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
                @excluir="remover(props.row.id)"
               @visualizar="abrirDialogVisualizar(props.row)">
                <q-item v-close-popup clickable class="agro-acoes-menu__item" @click="abrirCheckIn(props.row)">
                  <q-item-section avatar><q-icon name="my_location" class="agro-acoes-menu__icon" /></q-item-section>
                  <q-item-section>Check-in</q-item-section>
                </q-item>
                <q-item v-close-popup clickable class="agro-acoes-menu__item" @click="abrirFoto(props.row)">
                  <q-item-section avatar><q-icon name="photo_camera" class="agro-acoes-menu__icon" /></q-item-section>
                  <q-item-section>Adicionar foto</q-item-section>
                </q-item>
              </agro-acoes-menu>
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>

    <q-dialog v-model="dialog" persistent>
      <q-card class="dialog">
        <q-card-section>
          <h4 class="titulo">{{ somenteLeitura ? 'Visualizar visita' : editandoId ? 'Editar visita' : 'Nova visita' }}</h4>
        </q-card-section>
        <q-card-section>
          <q-form greedy class="agro-formulario" :class="{ 'agro-formulario--bloqueado': somenteLeitura }" @submit.prevent="salvar">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="formulario.dataVisita"
                  outlined
                  label="Data"
                  type="date"
                  class="field-required"
                  :rules="[obrigatorio]" :readonly="somenteLeitura" />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="formulario.tipo"
                  outlined
                  label="Tipo"
                  class="field-required"
                  emit-value
                  map-options
                  :options="TipoVisitaTecnicaOpcoes"
                  :rules="[obrigatorio]" :readonly="somenteLeitura" />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="formulario.status"
                  outlined
                  label="Status"
                  emit-value
                  map-options
                  :options="StatusVisitaTecnicaOpcoes" :readonly="somenteLeitura" />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="formulario.duracaoMin"
                  outlined
                  label="Duração (min)"
                  type="number" :readonly="somenteLeitura" />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="formulario.fazendaId"
                  outlined
                  label="Fazenda"
                  clearable
                  emit-value
                  map-options
                  :options="fazendaOpcoes" :readonly="somenteLeitura" />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="formulario.talhaoId"
                  outlined
                  label="Talhão"
                  clearable
                  emit-value
                  map-options
                  :options="talhaoOpcoes" :readonly="somenteLeitura" />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="formulario.tecnicoNome" outlined label="Técnico" :readonly="somenteLeitura" />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="formulario.clienteId"
                  outlined
                  label="Cliente"
                  clearable
                  emit-value
                  map-options
                  :options="clienteOpcoes"
                  :loading="carregandoClientes" :readonly="somenteLeitura" />
              </div>
              <div class="col-12">
                <q-input
                  v-model="formulario.observacoes"
                  outlined
                  label="Observações"
                  type="textarea"
                  autogrow :readonly="somenteLeitura" />
              </div>
            </div>
            <div class="agro-form-actions">
              <template v-if="somenteLeitura">
                <agro-btn flat label="Fechar" descricao="Fechar" @click="dialog = false" />
              </template>
              <template v-else>
                <agro-btn flat label="Cancelar" descricao="Fechar" @click="dialog = false" />
                <agro-btn color="primary" unelevated label="Salvar" type="submit" :loading="salvando" />
              </template>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogCheckIn" persistent>
      <q-card class="dialog">
        <q-card-section>
          <h4 class="titulo">Check-in</h4>
        </q-card-section>
        <q-card-section>
          <q-form greedy @submit.prevent="salvarCheckIn">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="formCheckIn.latitude"
                  outlined
                  label="Latitude"
                  type="number"
                  step="any"
                  class="field-required"
                  :rules="[obrigatorio]"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="formCheckIn.longitude"
                  outlined
                  label="Longitude"
                  type="number"
                  step="any"
                  class="field-required"
                  :rules="[obrigatorio]"
                />
              </div>
            </div>
            <div class="agro-form-actions">
              <agro-btn
                flat
                label="Usar GPS"
                descricao="Obter localização"
                @click="usarGps"
              />
              <agro-btn flat label="Cancelar" descricao="Fechar" @click="dialogCheckIn = false" />
              <agro-btn
                color="primary"
                unelevated
                label="Confirmar"
                type="submit"
                :loading="salvando"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogFoto" persistent>
      <q-card class="dialog">
        <q-card-section>
          <h4 class="titulo">Adicionar foto</h4>
        </q-card-section>
        <q-card-section>
          <q-form greedy @submit.prevent="salvarFoto">
            <q-input
              v-model="formFoto.url"
              outlined
              label="URL da foto"
              class="field-required q-mb-md"
              :rules="[obrigatorio]"
            />
            <q-input v-model="formFoto.descricao" outlined label="Descrição" />
            <div class="agro-form-actions">
              <agro-btn flat label="Cancelar" descricao="Fechar" @click="dialogFoto = false" />
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
import { useClientes } from 'composables/useClientes';
import { useFazendas } from 'composables/useFazendas';
import { useNotificacao } from 'composables/useNotificacao';
import { useRastreabilidade } from 'composables/useRastreabilidade';
import { useVisitasTecnicas, visitaVazia } from 'composables/useVisitasTecnicas';
import { StatusVisitaTecnicaOpcoes, TipoVisitaTecnicaOpcoes } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type {
  AdicionarFotoVisitaFormModel,
  CheckInVisitaTecnicaFormModel,
  VisitaTecnicaDto,
  VisitaTecnicaFormModel,
} from 'types/dtos/safras.dto';
import { formatarData, formatarDataHora } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';


const {
  visitas,
  carregando,
  salvando,
  carregar,
  criar,
  editar,
  remover,
  checkIn,
  adicionarFoto,
} = useVisitasTecnicas();
const { fazendas, fazendaOpcoes, carregar: carregarFazendas } = useFazendas();
const {
  clientes,
  carregando: carregandoClientes,
  carregar: carregarClientes,
} = useClientes();
const { talhoes, carregarTalhoes } = useRastreabilidade();
const { erro: notificarErro } = useNotificacao();

const dialog = ref(false);
const somenteLeitura = ref(false);
const dialogCheckIn = ref(false);
const dialogFoto = ref(false);
const editandoId = ref<string | null>(null);
const visitaAcaoId = ref<string | null>(null);
const formulario = ref<VisitaTecnicaFormModel>(visitaVazia());
const formCheckIn = ref<CheckInVisitaTecnicaFormModel>({ latitude: '', longitude: '' });
const formFoto = ref<AdicionarFotoVisitaFormModel>({ url: '', descricao: '' });

const talhaoOpcoes = computed(() =>
  talhoes.value.filter((t) => t.ativo).map((t) => ({ label: t.nome, value: t.id })),
);

const clienteOpcoes = computed(() =>
  clientes.value.map((c) => ({
    label: c.nomeFantasia || c.nomeRazao,
    value: c.id,
  })),
);

const mapaFazendas = computed(() => {
  const m = new Map<string, string>();
  for (const f of fazendas.value) m.set(f.id, f.nome);
  return m;
});

const mapaTipos = computed(() => {
  const m = new Map<string, string>();
  for (const o of TipoVisitaTecnicaOpcoes) m.set(o.value, o.label);
  return m;
});

const mapaStatus = computed(() => {
  const m = new Map<string, string>();
  for (const o of StatusVisitaTecnicaOpcoes) m.set(o.value, o.label);
  return m;
});

const colunas: QTableColumn<VisitaTecnicaDto>[] = [
  { name: 'dataVisita', label: 'Data', field: 'dataVisita', align: 'left', sortable: true },
  { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'tecnicoNome', label: 'Técnico', field: 'tecnicoNome', align: 'left' },
  { name: 'fazendaId', label: 'Fazenda', field: 'fazendaId', align: 'left' },
  { name: 'checkinEm', label: 'Check-in', field: 'checkinEm', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function rotuloFazenda(id: string | null): string {
  if (!id) return '—';
  return mapaFazendas.value.get(id) ?? id;
}

function rotuloTipo(tipo: string): string {
  return mapaTipos.value.get(tipo) ?? tipo;
}

function rotuloStatus(status: string): string {
  return mapaStatus.value.get(status) ?? status;
}

function abrirDialog(item?: VisitaTecnicaDto): void {
  somenteLeitura.value = false;
  editandoId.value = item?.id ?? null;
  formulario.value = item
    ? {
        clienteId: item.clienteId ?? '',
        fazendaId: item.fazendaId ?? '',
        talhaoId: item.talhaoId ?? '',
        dataVisita: item.dataVisita?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
        tipo: item.tipo ?? '',
        status: item.status,
        tecnicoNome: item.tecnicoNome ?? '',
        observacoes: item.observacoes ?? '',
        duracaoMin: item.duracaoMin != null ? String(item.duracaoMin) : '',
      }
    : visitaVazia();
  dialog.value = true;
}

function abrirCheckIn(item: VisitaTecnicaDto): void {
  visitaAcaoId.value = item.id;
  formCheckIn.value = {
    latitude: item.checkinLat != null ? String(item.checkinLat) : '',
    longitude: item.checkinLng != null ? String(item.checkinLng) : '',
  };
  dialogCheckIn.value = true;
}

function abrirFoto(item: VisitaTecnicaDto): void {
  visitaAcaoId.value = item.id;
  formFoto.value = { url: '', descricao: '' };
  dialogFoto.value = true;
}

function usarGps(): void {
  if (!navigator.geolocation) {
    notificarErro('Geolocalização não disponível neste dispositivo.');
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      formCheckIn.value.latitude = String(pos.coords.latitude);
      formCheckIn.value.longitude = String(pos.coords.longitude);
    },
    () => {
      notificarErro('Não foi possível obter a localização. Informe manualmente.');
    },
  );
}

async function salvar(): Promise<void> {
  const ok = editandoId.value
    ? await editar(editandoId.value, formulario.value)
    : await criar(formulario.value);
  if (ok) dialog.value = false;
}

async function salvarCheckIn(): Promise<void> {
  if (!visitaAcaoId.value) return;
  const ok = await checkIn(visitaAcaoId.value, formCheckIn.value);
  if (ok) dialogCheckIn.value = false;
}

async function salvarFoto(): Promise<void> {
  if (!visitaAcaoId.value) return;
  const ok = await adicionarFoto(visitaAcaoId.value, formFoto.value);
  if (ok) dialogFoto.value = false;
}

function abrirDialogVisualizar(item: VisitaTecnicaDto): void {
  abrirDialog(item);
  somenteLeitura.value = true;
}

onMounted(() => {
  void carregar();
  void carregarFazendas();
  void carregarClientes();
  void carregarTalhoes();
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
