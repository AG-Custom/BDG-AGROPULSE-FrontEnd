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
        <agro-table-skeleton v-if="carregando && visitas.length === 0" :colunas="5" />
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
          <template #body-cell-fazendaId="props">
            <q-td :props="props">{{ rotuloFazenda(props.row.fazendaId) }}</q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props" class="acoes">
              <agro-btn
                flat
                round
                dense
                icon="edit"
                color="primary"
                descricao="Editar"
                @click="abrirDialog(props.row)"
              />
              <agro-btn
                flat
                round
                dense
                icon="delete"
                color="negative"
                descricao="Remover"
                :loading="salvando"
                @click="remover(props.row.id)"
              />
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>

    <q-dialog v-model="dialog" persistent>
      <q-card class="dialog">
        <q-card-section>
          <h4 class="titulo">{{ editandoId ? 'Editar visita' : 'Nova visita' }}</h4>
        </q-card-section>
        <q-card-section>
          <q-form greedy class="agro-formulario" @submit.prevent="salvar">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="formulario.dataVisita"
                  outlined
                  label="Data"
                  type="date"
                  class="field-required"
                  :rules="[obrigatorio]"
                />
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
                  :rules="[obrigatorio]"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="formulario.fazendaId"
                  outlined
                  label="Fazenda"
                  clearable
                  emit-value
                  map-options
                  :options="fazendaOpcoes"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="formulario.talhaoId"
                  outlined
                  label="Talhão"
                  clearable
                  emit-value
                  map-options
                  :options="talhaoOpcoes"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="formulario.tecnicoNome" outlined label="Técnico" />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="formulario.clienteId" outlined label="Cliente ID" />
              </div>
              <div class="col-12">
                <q-input
                  v-model="formulario.observacoes"
                  outlined
                  label="Observações"
                  type="textarea"
                  autogrow
                />
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
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useFazendas } from 'composables/useFazendas';
import { useRastreabilidade } from 'composables/useRastreabilidade';
import { useVisitasTecnicas } from 'composables/useVisitasTecnicas';
import { TipoVisitaTecnicaOpcoes } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { VisitaTecnicaDto, VisitaTecnicaFormModel } from 'types/dtos/safras.dto';
import { formatarData } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';

const { visitas, carregando, salvando, carregar, criar, editar, remover } =
  useVisitasTecnicas();
const { fazendas, fazendaOpcoes, carregar: carregarFazendas } = useFazendas();
const { talhoes, carregarTalhoes } = useRastreabilidade();

const dialog = ref(false);
const editandoId = ref<string | null>(null);
const formulario = ref<VisitaTecnicaFormModel>({
  clienteId: '',
  fazendaId: '',
  talhaoId: '',
  dataVisita: '',
  tipo: '',
  tecnicoNome: '',
  observacoes: '',
});

const talhaoOpcoes = computed(() =>
  talhoes.value.filter((t) => t.ativo).map((t) => ({ label: t.nome, value: t.id })),
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

const colunas: QTableColumn<VisitaTecnicaDto>[] = [
  { name: 'dataVisita', label: 'Data', field: 'dataVisita', align: 'left', sortable: true },
  { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'left' },
  { name: 'tecnicoNome', label: 'Técnico', field: 'tecnicoNome', align: 'left' },
  { name: 'fazendaId', label: 'Fazenda', field: 'fazendaId', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function rotuloFazenda(id: string | null): string {
  if (!id) return '—';
  return mapaFazendas.value.get(id) ?? id;
}

function rotuloTipo(tipo: string): string {
  return mapaTipos.value.get(tipo) ?? tipo;
}

function abrirDialog(item?: VisitaTecnicaDto): void {
  editandoId.value = item?.id ?? null;
  formulario.value = {
    clienteId: item?.clienteId ?? '',
    fazendaId: item?.fazendaId ?? '',
    talhaoId: item?.talhaoId ?? '',
    dataVisita: item?.dataVisita?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
    tipo: item?.tipo ?? '',
    tecnicoNome: item?.tecnicoNome ?? '',
    observacoes: item?.observacoes ?? '',
  };
  dialog.value = true;
}

async function salvar(): Promise<void> {
  const ok = editandoId.value
    ? await editar(editandoId.value, formulario.value)
    : await criar(formulario.value);
  if (ok) dialog.value = false;
}

onMounted(() => {
  void carregar();
  void carregarFazendas();
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
