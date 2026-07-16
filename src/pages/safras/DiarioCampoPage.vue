<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Diário de campo"
      subtitulo="Registros de atividades e sync offline."
    >
      <div class="header-actions">
        <agro-btn
          outline
          color="primary"
          icon="sync"
          label="Sync offline"
          descricao="Sincronizar pendências"
          :loading="sincronizando"
          @click="sincronizar"
        />
        <agro-btn
          color="primary"
          unelevated
          icon="add"
          label="Nova entrada"
          descricao="Registrar atividade"
          @click="abrirDialog"
        />
      </div>
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <p v-if="pendentesSync.length > 0" class="pendentes text-caption">
          {{ pendentesSync.length }} pendência(s) local(is) para sync.
        </p>

        <agro-table-skeleton v-if="carregando && entradas.length === 0" :colunas="5" />
        <empty-state
          v-else-if="!carregando && entradas.length === 0"
          titulo="Nenhuma entrada"
          descricao="Registre atividades do diário de campo."
          icon="menu_book"
        />
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="entradas"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-data="props">
            <q-td :props="props">{{ formatarData(props.row.data) }}</q-td>
          </template>
          <template #body-cell-tipoAtividade="props">
            <q-td :props="props">{{ rotuloTipo(props.row.tipoAtividade) }}</q-td>
          </template>
          <template #body-cell-talhaoId="props">
            <q-td :props="props">{{ rotuloTalhao(props.row.talhaoId) }}</q-td>
          </template>
        </q-table>
      </agro-card>
    </section>

    <q-dialog v-model="dialog" persistent>
      <q-card class="dialog">
        <q-card-section><h4 class="titulo">Nova entrada</h4></q-card-section>
        <q-card-section>
          <q-form greedy class="agro-formulario" @submit.prevent="salvar">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="formulario.data"
                  outlined
                  label="Data"
                  type="date"
                  class="field-required"
                  :rules="[obrigatorio]"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="formulario.tipoAtividade"
                  outlined
                  label="Tipo de atividade"
                  class="field-required"
                  emit-value
                  map-options
                  :options="TipoAtividadeDiarioCampoOpcoes"
                  :rules="[obrigatorio]"
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
                <q-select
                  v-model="formulario.safraId"
                  outlined
                  label="Safra"
                  clearable
                  emit-value
                  map-options
                  :options="safraOpcoes"
                />
              </div>
              <div class="col-12">
                <q-input
                  v-model="formulario.descricao"
                  outlined
                  label="Descrição"
                  type="textarea"
                  autogrow
                  class="field-required"
                  :rules="[obrigatorio]"
                />
              </div>
            </div>
            <div class="agro-form-actions">
              <agro-btn flat label="Cancelar" descricao="Fechar" @click="dialog = false" />
              <agro-btn
                flat
                color="primary"
                label="Enfileirar offline"
                descricao="Guardar para sync"
                @click="enfileirar"
              />
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
import { useDiarioCampo } from 'composables/useDiarioCampo';
import { useRastreabilidade } from 'composables/useRastreabilidade';
import { useSafras } from 'composables/useSafras';
import { TipoAtividadeDiarioCampoOpcoes } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { DiarioCampoDto, DiarioCampoFormModel } from 'types/dtos/safras.dto';
import { formatarData } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';

const {
  entradas,
  pendentesSync,
  carregando,
  salvando,
  sincronizando,
  carregar,
  criar,
  enfileirarOffline,
  sincronizar,
} = useDiarioCampo();
const { talhoes, carregarTalhoes } = useRastreabilidade();
const { safraOpcoes, carregar: carregarSafras } = useSafras();

const dialog = ref(false);
const formulario = ref<DiarioCampoFormModel>({
  data: '',
  tipoAtividade: '',
  descricao: '',
  talhaoId: '',
  safraId: '',
});

const talhaoOpcoes = computed(() =>
  talhoes.value.filter((t) => t.ativo).map((t) => ({ label: t.nome, value: t.id })),
);

const mapaTalhoes = computed(() => {
  const m = new Map<string, string>();
  for (const t of talhoes.value) m.set(t.id, t.nome);
  return m;
});

const mapaTipos = computed(() => {
  const m = new Map<string, string>();
  for (const o of TipoAtividadeDiarioCampoOpcoes) m.set(o.value, o.label);
  return m;
});

const colunas: QTableColumn<DiarioCampoDto>[] = [
  { name: 'data', label: 'Data', field: 'data', align: 'left', sortable: true },
  { name: 'tipoAtividade', label: 'Atividade', field: 'tipoAtividade', align: 'left' },
  { name: 'descricao', label: 'Descrição', field: 'descricao', align: 'left' },
  { name: 'talhaoId', label: 'Talhão', field: 'talhaoId', align: 'left' },
];

function rotuloTalhao(id: string | null): string {
  if (!id) return '—';
  return mapaTalhoes.value.get(id) ?? id;
}

function rotuloTipo(tipo: string): string {
  return mapaTipos.value.get(tipo) ?? tipo;
}

function abrirDialog(): void {
  formulario.value = {
    data: new Date().toISOString().slice(0, 10),
    tipoAtividade: '',
    descricao: '',
    talhaoId: '',
    safraId: '',
  };
  dialog.value = true;
}

async function salvar(): Promise<void> {
  const ok = await criar(formulario.value);
  if (ok) dialog.value = false;
}

function enfileirar(): void {
  enfileirarOffline(formulario.value);
  dialog.value = false;
}

onMounted(() => {
  void carregar();
  void carregarTalhoes();
  void carregarSafras();
});
</script>

<style scoped>
.header-actions {
  display: flex;
  gap: var(--spacing-2);
  flex-wrap: wrap;
}
.pendentes {
  margin: 0 0 var(--spacing-3);
  color: var(--color-text-secondary);
}
.dialog {
  min-width: min(560px, 94vw);
}
.titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
</style>
