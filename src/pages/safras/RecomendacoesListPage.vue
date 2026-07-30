<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Recomendações"
      subtitulo="Recomendações técnicas ao produtor (revenda)."
    >
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Nova recomendação"
        descricao="Criar recomendação"
        @click="abrirDialog()"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <agro-table-skeleton v-if="carregando && recomendacoes.length === 0" :colunas="5" />
        <empty-state
          v-else-if="!carregando && recomendacoes.length === 0"
          titulo="Nenhuma recomendação"
          descricao="Crie recomendações vinculadas a visitas ou talhões."
          icon="recommend"
        />
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="recomendacoes"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-dataRecomendacao="props">
            <q-td :props="props">{{ formatarData(props.row.dataRecomendacao) }}</q-td>
          </template>
          <template #body-cell-status="props">
            <q-td :props="props">
              <agro-badge
                :label="rotuloStatus(props.row.status)"
                :variant="variantStatus(props.row.status)"
              />
            </q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props" class="acoes">
              <agro-acoes-menu
                :ativo="true"
                :mostrar-status="false"
                @editar="abrirDialog(props.row)"
               @visualizar="abrirDialogVisualizar(props.row)">
                <q-item
                  v-if="props.row.status === StatusRecomendacao.Pendente"
                  v-close-popup
                  clickable
                  class="agro-acoes-menu__item"
                  @click="aplicar(props.row.id)"
                >
                  <q-item-section avatar><q-icon name="done" class="agro-acoes-menu__icon" /></q-item-section>
                  <q-item-section>Aplicar</q-item-section>
                </q-item>
                <q-item
                  v-if="props.row.status === StatusRecomendacao.Pendente"
                  v-close-popup
                  clickable
                  class="agro-acoes-menu__item"
                  @click="cancelar(props.row.id)"
                >
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
          <h4 class="titulo">
            {{ editandoId ? 'Editar recomendação' : 'Nova recomendação' }}
          </h4>
        </q-card-section>
        <q-card-section>
          <q-form greedy class="agro-formulario" @submit.prevent="salvar">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="formulario.dataRecomendacao"
                  outlined
                  label="Data"
                  type="date"
                  class="field-required"
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
                <q-select
                  v-model="formulario.produtoId"
                  outlined
                  label="Produto"
                  clearable
                  emit-value
                  map-options
                  :options="produtoOpcoes"
                />
              </div>
              <div class="col-6 col-md-3">
                <q-input v-model="formulario.dose" outlined label="Dose" />
              </div>
              <div class="col-6 col-md-3">
                <q-input v-model="formulario.unidade" outlined label="Unidade" />
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
                  :loading="carregandoClientes"
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

    <agro-entity-details-dialog
      v-model="dialogVisualizar"
      :titulo="tituloDetalhe"
      :registro="registroSelecionado"
    />
  </q-page>
</template>

<script setup lang="ts">
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroEntityDetailsDialog from 'components/ui/AgroEntityDetailsDialog.vue';
import AgroBadge from 'components/ui/AgroBadge.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useClientes } from 'composables/useClientes';
import { useFazendas } from 'composables/useFazendas';
import { useProdutos } from 'composables/useProdutos';
import { useRastreabilidade } from 'composables/useRastreabilidade';
import { useRecomendacoes } from 'composables/useRecomendacoes';
import { StatusRecomendacao, StatusRecomendacaoOpcoes } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { RecomendacaoDto, RecomendacaoFormModel } from 'types/dtos/safras.dto';
import { formatarData } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';


const dialogVisualizar = ref(false);
const registroSelecionado = ref<Record<string, unknown> | null>(null);
const tituloDetalhe = computed(() => 'Detalhes de Recomendações');

const { recomendacoes, carregando, salvando, carregar, criar, editar, aplicar, cancelar } =
  useRecomendacoes();
const { fazendaOpcoes, carregar: carregarFazendas } = useFazendas();
const {
  clientes,
  carregando: carregandoClientes,
  carregar: carregarClientes,
} = useClientes();
const { talhoes, carregarTalhoes } = useRastreabilidade();
const { produtos, carregar: carregarProdutos } = useProdutos();

const dialog = ref(false);
const editandoId = ref<string | null>(null);
const formulario = ref<RecomendacaoFormModel>({
  visitaId: '',
  clienteId: '',
  fazendaId: '',
  talhaoId: '',
  safraId: '',
  produtoId: '',
  descricao: '',
  dose: '',
  unidade: '',
  dataRecomendacao: '',
});

const talhaoOpcoes = computed(() =>
  talhoes.value.filter((t) => t.ativo).map((t) => ({ label: t.nome, value: t.id })),
);
const produtoOpcoes = computed(() =>
  produtos.value.map((p) => ({ label: `${p.descricao}`, value: p.id })),
);
const clienteOpcoes = computed(() =>
  clientes.value.map((c) => ({
    label: c.nomeFantasia || c.nomeRazao,
    value: c.id,
  })),
);

const mapaStatus = computed(() => {
  const m = new Map<string, string>();
  for (const o of StatusRecomendacaoOpcoes) m.set(o.value, o.label);
  return m;
});

const colunas: QTableColumn<RecomendacaoDto>[] = [
  {
    name: 'dataRecomendacao',
    label: 'Data',
    field: 'dataRecomendacao',
    align: 'left',
    sortable: true,
  },
  { name: 'descricao', label: 'Descrição', field: 'descricao', align: 'left' },
  { name: 'dose', label: 'Dose', field: 'dose', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function rotuloStatus(status: string): string {
  return mapaStatus.value.get(status) ?? status;
}

function variantStatus(status: string): 'success' | 'warning' | 'default' {
  if (status === StatusRecomendacao.Aplicada) return 'success';
  if (status === StatusRecomendacao.Pendente) return 'warning';
  return 'default';
}

function abrirDialog(item?: RecomendacaoDto): void {
  editandoId.value = item?.id ?? null;
  formulario.value = {
    visitaId: item?.visitaId ?? '',
    clienteId: item?.clienteId ?? '',
    fazendaId: item?.fazendaId ?? '',
    talhaoId: item?.talhaoId ?? '',
    safraId: item?.safraId ?? '',
    produtoId: item?.produtoId ?? '',
    descricao: item?.descricao ?? '',
    dose: item?.dose ?? '',
    unidade: item?.unidade ?? '',
    dataRecomendacao:
      item?.dataRecomendacao?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
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
  void carregarClientes();
  void carregarTalhoes();
  void carregarProdutos();
});
function abrirDialogVisualizar(registro: Record<string, unknown> | object): void {
  registroSelecionado.value = registro as Record<string, unknown>;
  dialogVisualizar.value = true;
}

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
