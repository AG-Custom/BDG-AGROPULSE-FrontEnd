<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Ordens de serviço agrícola"
      subtitulo="Plantio, tratos, irrigação, aplicação e colheita."
    >
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Nova OS"
        descricao="Criar ordem de serviço"
        @click="abrirDialog()"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <agro-table-skeleton v-if="carregando && ordens.length === 0" :colunas="6" />
        <empty-state
          v-else-if="!carregando && ordens.length === 0"
          titulo="Nenhuma OS"
          descricao="Crie ordens de serviço agrícola."
          icon="assignment"
        />
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="ordens"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-tipo="props">
            <q-td :props="props">{{ rotuloTipo(props.row.tipo) }}</q-td>
          </template>
          <template #body-cell-status="props">
            <q-td :props="props">
              <agro-badge
                :label="rotuloStatus(props.row.status)"
                :variant="variantStatus(props.row.status)"
              />
            </q-td>
          </template>
          <template #body-cell-dataPlanejada="props">
            <q-td :props="props">
              {{ props.row.dataPlanejada ? formatarData(props.row.dataPlanejada) : '—' }}
            </q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props" class="acoes">
              <agro-acoes-menu
                :ativo="true"
                :mostrar-status="false"
                @editar="abrirDialog(props.row)"
               @visualizar="abrirDialogVisualizar(props.row)">
                <q-item v-if="props.row.status === StatusOrdemServicoAgricola.Aberta" v-close-popup clickable class="agro-acoes-menu__item" @click="iniciar(props.row.id)">
                  <q-item-section avatar><q-icon name="play_arrow" class="agro-acoes-menu__icon" /></q-item-section>
                  <q-item-section>Iniciar</q-item-section>
                </q-item>
                <q-item v-if="props.row.status === StatusOrdemServicoAgricola.EmAndamento" v-close-popup clickable class="agro-acoes-menu__item" @click="concluir(props.row.id)">
                  <q-item-section avatar><q-icon name="done_all" class="agro-acoes-menu__icon" /></q-item-section>
                  <q-item-section>Concluir</q-item-section>
                </q-item>
                <q-item v-if="podeCancelar(props.row.status)" v-close-popup clickable class="agro-acoes-menu__item" @click="cancelar(props.row.id)">
                  <q-item-section avatar><q-icon name="cancel" class="agro-acoes-menu__icon" /></q-item-section>
                  <q-item-section>Cancelar</q-item-section>
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
          <h4 class="titulo">{{ somenteLeitura ? 'Visualizar OS agrícola' : editandoId ? 'Editar OS' : 'Nova OS agrícola' }}</h4>
        </q-card-section>
        <q-card-section>
          <q-form greedy class="agro-formulario" :class="{ 'agro-formulario--bloqueado': somenteLeitura }" @submit.prevent="salvar">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-select
                  v-model="formulario.tipo"
                  outlined
                  label="Tipo"
                  class="field-required"
                  emit-value
                  map-options
                  :options="TipoOrdemServicoAgricolaOpcoes"
                  :rules="[obrigatorio]" :readonly="somenteLeitura" />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="formulario.dataPlanejada"
                  outlined
                  label="Data planejada"
                  type="date" :readonly="somenteLeitura" />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="formulario.safraId"
                  outlined
                  label="Safra"
                  clearable
                  emit-value
                  map-options
                  :options="safraOpcoes" :readonly="somenteLeitura" />
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
                <q-input v-model="formulario.responsavel" outlined label="Responsável" :readonly="somenteLeitura" />
              </div>
              <div class="col-12">
                <q-input
                  v-model="formulario.descricao"
                  outlined
                  label="Descrição"
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
  </q-page>
</template>

<script setup lang="ts">
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useOrdensServicoAgricola } from 'composables/useOrdensServicoAgricola';
import { useRastreabilidade } from 'composables/useRastreabilidade';
import { useSafras } from 'composables/useSafras';
import {
  StatusOrdemServicoAgricola,
  StatusOrdemServicoAgricolaOpcoes,
  TipoOrdemServicoAgricolaOpcoes,
} from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type {
  OrdemServicoAgricolaDto,
  OrdemServicoAgricolaFormModel,
} from 'types/dtos/safras.dto';
import { formatarData } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';


const {
  ordens,
  carregando,
  salvando,
  carregar,
  criar,
  editar,
  iniciar,
  concluir,
  cancelar,
} = useOrdensServicoAgricola();
const { safraOpcoes, carregar: carregarSafras } = useSafras();
const { talhoes, carregarTalhoes } = useRastreabilidade();

const dialog = ref(false);
const somenteLeitura = ref(false);
const editandoId = ref<string | null>(null);
const formulario = ref<OrdemServicoAgricolaFormModel>({
  safraId: '',
  talhaoId: '',
  tipo: '',
  dataPlanejada: '',
  descricao: '',
  responsavel: '',
});

const talhaoOpcoes = computed(() =>
  talhoes.value.filter((t) => t.ativo).map((t) => ({ label: t.nome, value: t.id })),
);

const mapaTipos = computed(() => {
  const m = new Map<string, string>();
  for (const o of TipoOrdemServicoAgricolaOpcoes) m.set(o.value, o.label);
  return m;
});
const mapaStatus = computed(() => {
  const m = new Map<string, string>();
  for (const o of StatusOrdemServicoAgricolaOpcoes) m.set(o.value, o.label);
  return m;
});

const colunas: QTableColumn<OrdemServicoAgricolaDto>[] = [
  { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'left', sortable: true },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'dataPlanejada', label: 'Planejada', field: 'dataPlanejada', align: 'left' },
  { name: 'responsavel', label: 'Responsável', field: 'responsavel', align: 'left' },
  { name: 'descricao', label: 'Descrição', field: 'descricao', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function rotuloTipo(tipo: string): string {
  return mapaTipos.value.get(tipo) ?? tipo;
}
function rotuloStatus(status: string): string {
  return mapaStatus.value.get(status) ?? status;
}
function variantStatus(status: string): 'success' | 'warning' | 'info' | 'default' {
  if (status === StatusOrdemServicoAgricola.Concluida) return 'success';
  if (status === StatusOrdemServicoAgricola.EmAndamento) return 'info';
  if (status === StatusOrdemServicoAgricola.Aberta) return 'warning';
  return 'default';
}
function podeCancelar(status: string): boolean {
  return (
    status === StatusOrdemServicoAgricola.Aberta ||
    status === StatusOrdemServicoAgricola.EmAndamento
  );
}

function abrirDialog(item?: OrdemServicoAgricolaDto): void {
  somenteLeitura.value = false;
  editandoId.value = item?.id ?? null;
  formulario.value = {
    safraId: item?.safraId ?? '',
    talhaoId: item?.talhaoId ?? '',
    tipo: item?.tipo ?? '',
    dataPlanejada: item?.dataPlanejada?.slice(0, 10) ?? '',
    descricao: item?.descricao ?? '',
    responsavel: item?.responsavel ?? '',
  };
  dialog.value = true;
}

async function salvar(): Promise<void> {
  const ok = editandoId.value
    ? await editar(editandoId.value, formulario.value)
    : await criar(formulario.value);
  if (ok) dialog.value = false;
}

function abrirDialogVisualizar(item: OrdemServicoAgricolaDto): void {
  abrirDialog(item);
  somenteLeitura.value = true;
}

onMounted(() => {
  void carregar();
  void carregarSafras();
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
