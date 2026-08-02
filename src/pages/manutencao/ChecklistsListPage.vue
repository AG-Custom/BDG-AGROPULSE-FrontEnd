<template>
  <q-page class="agro-page">
    <app-page-header
      titulo="Checklists de inspeção"
      subtitulo="Inspeção diária de ativos."
    >
      <agro-btn
        color="primary"
        unelevated
        icon="add"
        label="Novo checklist"
        descricao="Registrar inspeção"
        :to="{ name: 'manutencao-checklist-novo' }"
      />
    </app-page-header>

    <section class="agro-section">
      <agro-card>
        <agro-table-skeleton v-if="carregando && checklists.length === 0" :colunas="6" />
        <empty-state
          v-else-if="!carregando && checklists.length === 0"
          titulo="Nenhum checklist"
          descricao="Registre a primeira inspeção diária."
          icon="checklist"
        >
          <agro-btn
            color="primary"
            unelevated
            label="Novo checklist"
            descricao="Criar"
            :to="{ name: 'manutencao-checklist-novo' }"
          />
        </empty-state>
        <q-table
          v-else
          flat
          bordered
          row-key="id"
          :rows="checklists"
          :columns="colunas"
          :loading="carregando"
          :rows-per-page-options="[10, 25, 50]"
        >
          <template #body-cell-data="props">
            <q-td :props="props">{{ formatarData(props.row.data) }}</q-td>
          </template>
          <template #body-cell-horimetro="props">
            <q-td :props="props" class="text-metric">{{ formatarDecimal(props.row.horimetro) }}</q-td>
          </template>
          <template #body-cell-status="props">
            <q-td :props="props">
              <manutencao-status-badge :valor="props.row.status" tipo="checklist" />
            </q-td>
          </template>
          <template #body-cell-itens="props">
            <q-td :props="props" class="text-metric">{{ props.row.itens.length }}</q-td>
          </template>
          <template #body-cell-acoes="props">
            <q-td :props="props">
              <agro-acoes-menu
                :mostrar-editar="false"
                :mostrar-status="false"
                @visualizar="abrirDialogVisualizar(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </agro-card>
    </section>

    <q-dialog v-model="dialogVisualizar">
      <q-card class="dialog-visualizar">
        <q-card-section>
          <h4 class="titulo">Visualizar checklist</h4>
        </q-card-section>
        <q-card-section>
          <q-form class="agro-formulario agro-formulario--bloqueado">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  :model-value="checklistVisualizar ? nomeAtivo(checklistVisualizar.ativoId) : ''"
                  outlined
                  label="Ativo"
                  readonly
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  :model-value="checklistVisualizar ? formatarData(checklistVisualizar.data) : ''"
                  outlined
                  label="Data"
                  readonly
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  :model-value="checklistVisualizar?.operadorNome ?? ''"
                  outlined
                  label="Operador"
                  readonly
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  :model-value="
                    checklistVisualizar ? formatarDecimal(checklistVisualizar.horimetro) : ''
                  "
                  outlined
                  label="Horímetro"
                  readonly
                  input-class="text-metric"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  :model-value="checklistVisualizar?.status ?? ''"
                  outlined
                  label="Status"
                  readonly
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  :model-value="
                    checklistVisualizar ? String(checklistVisualizar.itens.length) : ''
                  "
                  outlined
                  label="Quantidade de itens"
                  readonly
                  input-class="text-metric"
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
import ManutencaoStatusBadge from 'components/manutencao/ManutencaoStatusBadge.vue';
import AgroAcoesMenu from 'components/ui/AgroAcoesMenu.vue';
import AgroCard from 'components/ui/AgroCard.vue';
import AgroTableSkeleton from 'components/ui/AgroTableSkeleton.vue';
import EmptyState from 'components/ui/EmptyState.vue';
import { useManutencao } from 'composables/useManutencao';
import type { QTableColumn } from 'quasar';
import type { ChecklistManutencaoDto } from 'types/dtos/manutencao.dto';
import { formatarData, formatarDecimal } from 'utils/formatters';
import { onMounted, ref } from 'vue';

const {
  checklists,
  ativos,
  carregando,
  carregarChecklists,
  carregarAtivos,
} = useManutencao();

const dialogVisualizar = ref(false);
const checklistVisualizar = ref<ChecklistManutencaoDto | null>(null);

function nomeAtivo(ativoId: string): string {
  return ativos.value.find((a) => a.id === ativoId)?.nome ?? ativoId;
}

const colunas: QTableColumn<ChecklistManutencaoDto>[] = [
  { name: 'ativoId', label: 'Ativo', field: (r) => nomeAtivo(r.ativoId), align: 'left' },
  { name: 'data', label: 'Data', field: 'data', align: 'left' },
  { name: 'operadorNome', label: 'Operador', field: 'operadorNome', align: 'left' },
  { name: 'horimetro', label: 'Horímetro', field: 'horimetro', align: 'right' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'itens', label: 'Itens', field: 'itens', align: 'right' },
  { name: 'acoes', label: 'Ações', field: 'id', align: 'right' },
];

function abrirDialogVisualizar(item: ChecklistManutencaoDto): void {
  checklistVisualizar.value = item;
  dialogVisualizar.value = true;
}

onMounted(() => {
  void carregarAtivos();
  void carregarChecklists();
});
</script>

<style scoped>
.dialog-visualizar {
  min-width: min(520px, 94vw);
}
.titulo {
  margin: 0;
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
}
</style>
