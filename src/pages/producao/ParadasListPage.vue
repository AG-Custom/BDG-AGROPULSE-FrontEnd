<template>
  <q-page class="agro-page">
    <app-page-header titulo="Paradas de linha" subtitulo="Causa, duração e impacto na produção.">
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Registrar parada"
        descricao="Nova parada"
        @click="abrirDialog"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <agro-table-skeleton v-if="carregando && paradas.length === 0" :colunas="6" />
        <empty-state
          v-else-if="!carregando && paradas.length === 0"
          titulo="Nenhuma parada"
          descricao="Registre paradas de linha vinculadas às OPs."
          icon="pause_circle"
        />
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="paradas"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-ordemProducaoId="props">
            <q-td :props="props">{{ props.row.ordemProducaoId.slice(0, 8) }}…</q-td>
          </template>
          <template #body-cell-inicio="props">
            <q-td :props="props">{{ formatarDataHora(props.row.inicio) }}</q-td>
          </template>
          <template #body-cell-fim="props">
            <q-td :props="props">
              {{ props.row.fim ? formatarDataHora(props.row.fim) : '—' }}
            </q-td>
          </template>
          <template #body-cell-resolvida="props">
            <q-td :props="props">
              <agro-badge
                :label="props.row.resolvida ? 'Resolvida' : 'Aberta'"
                :variant="props.row.resolvida ? 'success' : 'warning'"
              />
            </q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props">
              <agro-acoes-menu
                :ativo="true"
                :mostrar-editar="false"
                :mostrar-status="false"
                :mostrar-excluir="true"
                excluir-label="Remover"
                :loading-excluir="salvando"
                @excluir="onRemover(props.row.id)"
               @visualizar="abrirDialogVisualizar(props.row)">
                <q-item v-if="!props.row.resolvida" v-close-popup clickable class="agro-acoes-menu__item" @click="onResolver(props.row.id)">
                  <q-item-section avatar><q-icon name="done" class="agro-acoes-menu__icon" /></q-item-section>
                  <q-item-section>Resolver</q-item-section>
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
          <h4 class="titulo">{{ somenteLeitura ? 'Visualizar parada' : 'Registrar parada' }}</h4>
        </q-card-section>
        <q-card-section>
          <q-form greedy class="agro-formulario" :class="{ 'agro-formulario--bloqueado': somenteLeitura }" @submit.prevent="salvar">
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-select
                  v-model="formulario.ordemProducaoId"
                  outlined
                  label="Ordem de produção"
                  class="field-required"
                  emit-value
                  map-options
                  :options="ordemOpcoes"
                  :rules="[obrigatorio]" :readonly="somenteLeitura" />
              </div>
              <div class="col-12">
                <q-input
                  v-model="formulario.causa"
                  outlined
                  label="Causa"
                  class="field-required"
                  :rules="[obrigatorio]" :readonly="somenteLeitura" />
              </div>
              <div class="col-6">
                <q-input
                  v-model="formulario.inicio"
                  outlined
                  label="Início"
                  type="datetime-local"
                  class="field-required"
                  :rules="[obrigatorio]" :readonly="somenteLeitura" />
              </div>
              <div class="col-6">
                <q-input v-model="formulario.equipamento" outlined label="Equipamento" :readonly="somenteLeitura" />
              </div>
              <div class="col-6">
                <q-input
                  v-model="formulario.impactoUnidades"
                  outlined
                  label="Impacto (unidades)"
                  type="number" :readonly="somenteLeitura" />
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
import { useParadas } from 'composables/useParadas';
import { useProducao } from 'composables/useProducao';
import { useProdutos } from 'composables/useProdutos';
import type { QTableColumn } from 'quasar';
import type { ParadaLinhaDto, ParadaLinhaFormModel } from 'types/dtos/producao.dto';
import { formatarDataHora } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';


const { paradas, carregando, salvando, carregar, criar, resolver, remover } = useParadas();
const { ordens, carregarOrdens } = useProducao();
const { produtos, carregar: carregarProdutos } = useProdutos();

const dialog = ref(false);
const somenteLeitura = ref(false);
const formulario = ref<ParadaLinhaFormModel>({
  ordemProducaoId: '',
  causa: '',
  inicio: '',
  fim: '',
  impactoUnidades: '',
  equipamento: '',
});

const mapa = computed(() => {
  const m = new Map<string, string>();
  for (const p of produtos.value) m.set(p.id, `${p.descricao}`);
  return m;
});

const ordemOpcoes = computed(() =>
  ordens.value.map((o) => ({
    label: `${o.id.slice(0, 8)}… — ${mapa.value.get(o.produtoSaidaId) ?? o.produtoSaidaId}`,
    value: o.id,
  })),
);

const colunas: QTableColumn<ParadaLinhaDto>[] = [
  { name: 'ordemProducaoId', label: 'OP', field: 'ordemProducaoId', align: 'left' },
  { name: 'causa', label: 'Causa', field: 'causa', align: 'left' },
  { name: 'equipamento', label: 'Equipamento', field: 'equipamento', align: 'left' },
  { name: 'inicio', label: 'Início', field: 'inicio', align: 'left' },
  { name: 'fim', label: 'Fim', field: 'fim', align: 'left' },
  { name: 'resolvida', label: 'Status', field: 'resolvida', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function abrirDialog(): void {
  somenteLeitura.value = false;
  formulario.value = {
    ordemProducaoId: '',
    causa: '',
    inicio: new Date().toISOString().slice(0, 16),
    fim: '',
    impactoUnidades: '',
    equipamento: '',
  };
  dialog.value = true;
}

async function salvar(): Promise<void> {
  const criada = await criar({
    ...formulario.value,
    inicio: new Date(formulario.value.inicio).toISOString(),
  });
  if (criada) {
    dialog.value = false;
    await carregar();
  }
}

async function onResolver(id: string): Promise<void> {
  if (await resolver(id)) await carregar();
}

async function onRemover(id: string): Promise<void> {
  if (await remover(id)) await carregar();
}

function abrirDialogVisualizar(item: ParadaLinhaDto): void {
  somenteLeitura.value = true;
  formulario.value = {
    ordemProducaoId: item.ordemProducaoId,
    causa: item.causa,
    inicio: item.inicio.slice(0, 16),
    fim: item.fim ? item.fim.slice(0, 16) : '',
    impactoUnidades: item.impactoUnidades != null ? String(item.impactoUnidades) : '',
    equipamento: item.equipamento ?? '',
  };
  dialog.value = true;
}

onMounted(() => {
  void carregarProdutos();
  void carregarOrdens();
  void carregar();
});
</script>

<style scoped>
.acoes {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-1);
}
.dialog {
  min-width: min(480px, 92vw);
}
.titulo {
  margin: 0;
  font-family: var(--font-family-display);
}
</style>
