<template>
  <q-page class="agro-page">
    <app-page-header titulo="Centros de custo" subtitulo="Classificação de títulos e lançamentos.">
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Novo centro"
        descricao="Cadastrar centro de custo"
        @click="abrirDialog()"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <agro-table-skeleton v-if="carregando && centros.length === 0" :colunas="3" />
        <empty-state
          v-else-if="!carregando && centros.length === 0"
          titulo="Nenhum centro de custo"
          descricao="Cadastre centros para rateio financeiro."
          icon="account_tree"
        />
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="centros"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
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
        <q-card-section>
          <h4 class="titulo">{{ somenteLeitura ? 'Visualizar centro' : editandoId ? 'Editar centro' : 'Novo centro de custo' }}</h4>
        </q-card-section>
        <q-card-section>
          <q-form greedy class="agro-formulario" :class="{ 'agro-formulario--bloqueado': somenteLeitura }" @submit.prevent="salvar">
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-input
                  v-model="formulario.nome"
                  outlined
                  label="Nome"
                  class="field-required"
                  :rules="[obrigatorio]" :readonly="somenteLeitura" />
              </div>
              <div class="col-12">
                <agro-select-cadastro
                  v-model="formulario.unidadeId"
                  entidade="unidade"
                  label="Unidade"
                  clearable
                  :options="unidadeOpcoes"
                  :loading="carregandoUnidades"
                  :readonly="!!editandoId || somenteLeitura"
                  @atualizar="carregarUnidades()"
                />
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
import AgroSelectCadastro from 'components/ui/AgroSelectCadastro.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useCentrosCusto } from 'composables/useCentrosCusto';
import { useUnidades } from 'composables/useUnidades';
import { UnidadeStatus } from 'constants/enums';
import type { QTableColumn } from 'quasar';
import type { CentroCustoDto, CentroCustoFormModel } from 'types/dtos/financeiro-gestao.dto';
import { obrigatorio } from 'utils/validators';
import { computed, onMounted, ref } from 'vue';


const { centros, carregando, salvando, carregar, criar, editar } = useCentrosCusto();
const {
  unidades,
  carregando: carregandoUnidades,
  carregar: carregarUnidades,
} = useUnidades();
const dialog = ref(false);
const somenteLeitura = ref(false);
const editandoId = ref<string | null>(null);
const formulario = ref<CentroCustoFormModel>({ nome: '', unidadeId: '' });

const unidadeOpcoes = computed(() =>
  unidades.value
    .filter((u) => u.status === UnidadeStatus.Ativa || u.id === formulario.value.unidadeId)
    .map((u) => ({ label: u.nome, value: u.id })),
);

const colunas: QTableColumn<CentroCustoDto>[] = [
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left', sortable: true },
  { name: 'ativo', label: 'Status', field: 'ativo', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function abrirDialog(item?: CentroCustoDto): void {
  somenteLeitura.value = false;
  editandoId.value = item?.id ?? null;
  formulario.value = {
    nome: item?.nome ?? '',
    unidadeId: item?.unidadeId ?? '',
  };
  dialog.value = true;
}

async function salvar(): Promise<void> {
  const ok = editandoId.value
    ? await editar(editandoId.value, formulario.value, true)
    : await criar(formulario.value);
  if (ok) dialog.value = false;
}

function abrirDialogVisualizar(item: CentroCustoDto): void {
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
  min-width: min(480px, 94vw);
}
.titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
</style>
