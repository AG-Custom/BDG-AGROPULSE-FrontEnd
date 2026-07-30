<template>
  <q-page class="agro-page">
    <app-page-header titulo="Caixas" subtitulo="Caixas por unidade operacional.">
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Novo caixa"
        descricao="Cadastrar caixa"
        @click="abrirDialog()"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <agro-table-skeleton v-if="carregando && caixas.length === 0" :colunas="4" />
        <empty-state
          v-else-if="!carregando && caixas.length === 0"
          titulo="Nenhum caixa"
          descricao="Cadastre caixas para transferências e tesouraria."
          icon="point_of_sale"
        />
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="caixas"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-saldoAtual="props">
            <q-td :props="props" class="text-metric">{{ formatarMoeda(props.row.saldoAtual) }}</q-td>
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
            <q-td :props="props">
              <agro-acoes-menu
                :mostrar-status="false"
                @editar="abrirDialog(props.row)"
               @visualizar="abrirDialogVisualizar(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>

    <q-dialog v-model="dialog" persistent>
      <q-card class="dialog">
        <q-card-section><h4 class="titulo">{{ somenteLeitura ? 'Visualizar caixa' : editandoId ? 'Editar caixa' : 'Novo caixa' }}</h4></q-card-section>
        <q-card-section>
          <q-form greedy class="agro-formulario" :class="{ 'agro-formulario--bloqueado': somenteLeitura }" @submit.prevent="salvar">
            <q-input
              v-model="formulario.nome"
              outlined
              label="Nome"
              class="field-required q-mb-md"
              :rules="[obrigatorio]" :readonly="somenteLeitura" />
            <q-select
              v-model="formulario.unidadeId"
              outlined
              label="Unidade"
              clearable
              emit-value
              map-options
              :options="unidadeOpcoes"
              :loading="carregandoUnidades"
              :readonly="!!editandoId || somenteLeitura"
            />
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
import { useCaixas } from 'composables/useCaixas';
import { useUnidades } from 'composables/useUnidades';
import { UnidadeStatus } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { CaixaDto, CaixaFormModel } from 'types/dtos/financeiro-gestao.dto';
import { formatarMoeda } from 'utils/formatters';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';


const { caixas, carregando, salvando, carregar, criar, editar } = useCaixas();
const {
  unidades,
  carregando: carregandoUnidades,
  carregar: carregarUnidades,
} = useUnidades();
const dialog = ref(false);
const somenteLeitura = ref(false);
const editandoId = ref<string | null>(null);
const formulario = ref<CaixaFormModel>({ nome: '', unidadeId: '' });

const unidadeOpcoes = computed(() =>
  unidades.value
    .filter((u) => u.status === UnidadeStatus.Ativa || u.id === formulario.value.unidadeId)
    .map((u) => ({ label: u.nome, value: u.id })),
);

const colunas: QTableColumn<CaixaDto>[] = [
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left', sortable: true },
  { name: 'saldoAtual', label: 'Saldo', field: 'saldoAtual', align: 'right' },
  { name: 'ativo', label: 'Status', field: 'ativo', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function abrirDialog(item?: CaixaDto): void {
  somenteLeitura.value = false;
  editandoId.value = item?.id ?? null;
  formulario.value = { nome: item?.nome ?? '', unidadeId: item?.unidadeId ?? '' };
  dialog.value = true;
}

async function salvar(): Promise<void> {
  const ok = editandoId.value
    ? await editar(editandoId.value, formulario.value, true)
    : await criar(formulario.value);
  if (ok) dialog.value = false;
}

function abrirDialogVisualizar(item: CaixaDto): void {
  abrirDialog(item);
  somenteLeitura.value = true;
}

onMounted(() => {
  void carregar();
  void carregarUnidades();
});
</script>

<style scoped>
.dialog {
  min-width: min(420px, 94vw);
}
.titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
</style>
