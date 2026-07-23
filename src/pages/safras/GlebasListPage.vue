<template>
  <q-page class="agro-page">
    <app-page-header titulo="Glebas" subtitulo="Subdivisões dentro das fazendas.">
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Nova gleba"
        descricao="Cadastrar gleba"
        @click="abrirDialog()"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <div class="agro-filter-bar">
          <q-select
            v-model="filtroFazendaId"
            outlined
            dense
            clearable
            emit-value
            map-options
            label="Fazenda"
            class="filtro"
            :options="fazendaOpcoes"
            @update:model-value="aplicarFiltro"
          />
        </div>

        <agro-table-skeleton v-if="carregando && glebas.length === 0" :colunas="4" />
        <empty-state
          v-else-if="!carregando && glebas.length === 0"
          titulo="Nenhuma gleba"
          descricao="Cadastre glebas vinculadas a uma fazenda."
          icon="map"
        />
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="glebas"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-fazendaId="props">
            <q-td :props="props">{{ rotuloFazenda(props.row.fazendaId) }}</q-td>
          </template>
          <template #body-cell-areaHa="props">
            <q-td :props="props" class="text-metric">
              {{ props.row.areaHa != null ? formatarDecimal(props.row.areaHa) : '—' }}
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
                :mostrar-visualizar="false"
                :mostrar-status="props.row.ativo"
                :loading-status="salvando"
                @editar="abrirDialog(props.row)"
                @desabilitar="inativar(props.row.id, filtroFazendaId || undefined)"
              />
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>

    <q-dialog v-model="dialog" persistent>
      <q-card class="dialog">
        <q-card-section>
          <h4 class="titulo">{{ editandoId ? 'Editar gleba' : 'Nova gleba' }}</h4>
        </q-card-section>
        <q-card-section>
          <q-form greedy class="agro-formulario" @submit.prevent="salvar">
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-select
                  v-model="formulario.fazendaId"
                  outlined
                  label="Fazenda"
                  class="field-required"
                  emit-value
                  map-options
                  :options="fazendaOpcoes"
                  :disable="!!editandoId"
                  :rules="[obrigatorio]"
                />
              </div>
              <div class="col-12 col-md-8">
                <q-input
                  v-model="formulario.nome"
                  outlined
                  label="Nome"
                  class="field-required"
                  :rules="[obrigatorio]"
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  v-model="formulario.areaHa"
                  outlined
                  label="Área (ha)"
                  type="number"
                  step="0.01"
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
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useFazendas } from 'composables/useFazendas';
import { useGlebas } from 'composables/useGlebas';
import type { QTableColumn } from 'quasar';
import type { GlebaDto, GlebaFormModel } from 'types/dtos/safras.dto';
import { formatarDecimal } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';

const { fazendas, fazendaOpcoes, carregar: carregarFazendas } = useFazendas();
const { glebas, carregando, salvando, carregar, criar, editar, inativar } = useGlebas();

const filtroFazendaId = ref<string | null>(null);
const dialog = ref(false);
const editandoId = ref<string | null>(null);
const formulario = ref<GlebaFormModel>({ fazendaId: '', nome: '', areaHa: '' });

const mapaFazendas = computed(() => {
  const m = new Map<string, string>();
  for (const f of fazendas.value) m.set(f.id, f.nome);
  return m;
});

const colunas: QTableColumn<GlebaDto>[] = [
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left', sortable: true },
  { name: 'fazendaId', label: 'Fazenda', field: 'fazendaId', align: 'left' },
  { name: 'areaHa', label: 'Área (ha)', field: 'areaHa', align: 'right' },
  { name: 'ativo', label: 'Status', field: 'ativo', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function rotuloFazenda(id: string): string {
  return mapaFazendas.value.get(id) ?? id;
}

function aplicarFiltro(): void {
  void carregar(filtroFazendaId.value ? { fazendaId: filtroFazendaId.value } : undefined);
}

function abrirDialog(item?: GlebaDto): void {
  editandoId.value = item?.id ?? null;
  formulario.value = {
    fazendaId: item?.fazendaId ?? filtroFazendaId.value ?? '',
    nome: item?.nome ?? '',
    areaHa: item?.areaHa != null ? String(item.areaHa) : '',
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
  void carregarFazendas();
  void carregar();
});
</script>

<style scoped>
.filtro {
  min-width: 220px;
  max-width: 320px;
}
.dialog {
  min-width: min(480px, 94vw);
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
